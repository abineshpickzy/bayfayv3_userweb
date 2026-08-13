import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from '../../utils/constants';
import deliveryManIcon from '../../assets/images/trackingbike.png';
import shopIcon from '../../assets/images/delivery-shop.png';
import homeIcon from '../../assets/images/delivery-home.png';
import otherDeliveryIcon from '../../assets/images/other-delivery-pin.png';

const containerStyle = { width: '100%', height: '100%' };
const ASSOCIATE_ICON_SIZE = 66;
const ARC_ENDPOINT_LIFT_PX = 20;
const FOLLOW_ZOOM = 17;
// The bike glides from its last position to each new GPS ping over a
// duration that matches how long it's actually been since the previous
// ping — not a fixed length. This is the trick apps like Swiggy/Zomato use:
// if pings arrive every ~3s, the glide takes ~3s, so the marker is always
// moving and never stalls waiting for the next update or jumps ahead of it.
// Clamped so a very fast burst of pings doesn't look like teleporting, and a
// long gap in pings doesn't make the marker crawl forever.
const MIN_MOVE_ANIMATION_MS = 700;
const MAX_MOVE_ANIMATION_MS = 4000;
const DEFAULT_MOVE_ANIMATION_MS = 1500; // used only for the very first ping, before we have a real interval to measure

// Route line colors, mirroring mobile's R.color.road_color_grey (before pickup)
// and R.color.dark_gray (after pickup) from ParserTask.onPostExecute().
const ROUTE_COLOR_BEFORE_PICKUP = '#9e9e9e';
const ROUTE_COLOR_AFTER_PICKUP = '#424242';

const TOOLTIP_STYLE_ID = 'live-tracking-tooltip-style';
const ensureTooltipStyles = () => {
    if (document.getElementById(TOOLTIP_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = TOOLTIP_STYLE_ID;
    style.textContent = `
        .live-tracking-tooltip {
            position: absolute;
            transform: translate(-50%, -100%);
            background: #fff;
            padding: 8px 14px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.18);
            font: 600 13px/1.3 Arial, sans-serif;
            white-space: nowrap;
            pointer-events: none;
        }
        .live-tracking-tooltip::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -6px;
            transform: translateX(-50%);
            border-width: 6px 6px 0 6px;
            border-style: solid;
            border-color: #fff transparent transparent transparent;
        }
    `;
    document.head.appendChild(style);
};

const createTooltipOverlay = (map, position, text, liftPx) => {
    class TooltipOverlay extends window.google.maps.OverlayView {
        onAdd() {
            this.div = document.createElement('div');
            this.div.className = 'live-tracking-tooltip';
            this.div.textContent = text;
            this.getPanes().floatPane.appendChild(this.div);
        }
        draw() {
            const projection = this.getProjection();
            if (!projection || !this.div) return;
            const point = projection.fromLatLngToDivPixel(
                new window.google.maps.LatLng(position.lat, position.lng)
            );
            this.div.style.left = `${point.x}px`;
            this.div.style.top = `${point.y - liftPx}px`;
        }
        onRemove() {
            this.div?.parentNode?.removeChild(this.div);
            this.div = null;
        }
    }
    const overlay = new TooltipOverlay();
    overlay.setMap(map);
    return overlay;
};

const MapTooltip = ({ map, position, text, liftPx }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (!map || !position) return;
        ensureTooltipStyles();
        overlayRef.current = createTooltipOverlay(map, position, text, liftPx);
        return () => {
            overlayRef.current?.setMap(null);
            overlayRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, position?.lat, position?.lng, text, liftPx]);

    return null;
};

const toRad = deg => (deg * Math.PI) / 180;
const toDeg = rad => (rad * 180) / Math.PI;

const getBearing = (a, b) => {
    const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
    const dLng = toRad(b.lng - a.lng);
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

const easeOut = t => 1 - Math.pow(1 - t, 3);

// Linear angle interpolation, shortest-path direction (handles the 0/360 wrap).
const lerpAngle = (a, b, t) => {
    let diff = ((b - a + 540) % 360) - 180;
    return a + diff * t;
};

// Plain linear interpolation between two GPS pings — matches mobile's
// moveVechile() exactly:
//   lat = start.lat * (1-t) + end.lat * t
//   lng = start.lng * (1-t) + end.lng * t
const lerpPoint = (from, to, t) => ({
    lat: from.lat * (1 - t) + to.lat * t,
    lng: from.lng * (1 - t) + to.lng * t
});

// Approximate meters-per-degree scale factors at a given latitude, used to
// convert lat/lng deltas into a locally-flat, roughly-equidistant frame
// before doing segment projection math. Without this, a degree of longitude
// and a degree of latitude are treated as equal distances, which distorts
// the "nearest point on segment" result (more so at higher latitudes).
const metersPerDegree = (lat) => {
    const latRad = toRad(lat);
    return {
        mPerDegLat: 111320,
        mPerDegLng: 111320 * Math.cos(latRad)
    };
};

// Snaps a raw GPS point to the nearest point on the drawn routePath segments.
// Pure geometry — free, no API calls. Returns the original point if no route.
// Projects in a locally-flat meter frame (scaled by latitude) rather than
// raw lat/lng degrees, so the "nearest point" is geometrically correct
// instead of skewed by longitude degrees being narrower than latitude degrees.
const snapToRoute = (point, routePath) => {
    if (!routePath || routePath.length < 2) return point;

    const { mPerDegLat, mPerDegLng } = metersPerDegree(point.lat);
    let bestDistSq = Infinity;
    let best = point;

    for (let i = 0; i < routePath.length - 1; i++) {
        const a = routePath[i], b = routePath[i + 1];

        // Convert to a local meter frame relative to `a` for this segment.
        const ax = 0, ay = 0;
        const bx = (b.lng - a.lng) * mPerDegLng, by = (b.lat - a.lat) * mPerDegLat;
        const px = (point.lng - a.lng) * mPerDegLng, py = (point.lat - a.lat) * mPerDegLat;

        const dx = bx - ax, dy = by - ay;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) continue;

        const t = Math.max(0, Math.min(1, (px * dx + py * dy) / lenSq));
        const projX = ax + t * dx, projY = ay + t * dy;
        const distSq = (px - projX) * (px - projX) + (py - projY) * (py - projY);

        if (distSq < bestDistSq) {
            bestDistSq = distSq;
            // Convert the projected meter-frame point back to lat/lng.
            best = {
                lat: a.lat + projY / mPerDegLat,
                lng: a.lng + projX / mPerDegLng
            };
        }
    }
    return best;
};

const rotatedIconCache = new Map();
const getRotatedIcon = (angleDeg) => {
    const rounded = Math.round(angleDeg / 5) * 5;
    if (rotatedIconCache.has(rounded)) return Promise.resolve(rotatedIconCache.get(rounded));

    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const size = ASSOCIATE_ICON_SIZE;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.translate(size / 2, size / 2);
            ctx.rotate(toRad(rounded));
            ctx.drawImage(img, -size / 2, -size / 2, size, size);
            const dataUrl = canvas.toDataURL();
            rotatedIconCache.set(rounded, dataUrl);
            resolve(dataUrl);
        };
        img.src = deliveryManIcon;
    });
};

// Shared icon config so every setIcon() call (initial creation AND every
// rotation update) uses the identical anchor. This matters: setIcon()
// REPLACES the whole icon object rather than merging with the previous one,
// so if a later call omits `anchor`, Google Maps silently falls back to a
// default anchor (not necessarily center) and the marker visibly drifts off
// its true position — which is exactly what was happening here, since the
// rotation-update call was missing this. Was NOT an issue with the artwork
// itself (measured: the source PNG's bounding box is centered within half a
// pixel of the image center).
const associateIconConfig = (url) => ({
    url,
    scaledSize: new window.google.maps.Size(ASSOCIATE_ICON_SIZE, ASSOCIATE_ICON_SIZE),
    anchor: new window.google.maps.Point(ASSOCIATE_ICON_SIZE / 2, ASSOCIATE_ICON_SIZE / 2)
});

const AnimatedAssociateMarker = ({ map, position, pingSeq, label = 'Delivery Associate', onOpen, registerCloser }) => {
    const markerRef = useRef(null);
    const currentPosRef = useRef(null);
    const currentBearingRef = useRef(0);
    const rafRef = useRef(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipAnchor, setTooltipAnchor] = useState(null);
    const rotationRequestIdRef = useRef(0);
    // Timestamp of the previous ping, used to measure the real gap between
    // updates so the glide duration matches it (see MIN/MAX/DEFAULT above).
    const lastPingTimeRef = useRef(null);

    useEffect(() => {
        if (!map || markerRef.current || !position) return;
        markerRef.current = new window.google.maps.Marker({
            map,
            position,
            icon: associateIconConfig(deliveryManIcon)
        });
        currentPosRef.current = position;

        const clickListener = markerRef.current.addListener('click', () => {
            onOpen?.();
            setTooltipAnchor(currentPosRef.current);
            setTooltipOpen(true);
        });
        const mapClickListener = map.addListener('click', () => setTooltipOpen(false));
        registerCloser?.(() => setTooltipOpen(false));

        return () => {
            window.google.maps.event.removeListener(clickListener);
            window.google.maps.event.removeListener(mapClickListener);
            markerRef.current?.setMap(null);
            markerRef.current = null;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    useEffect(() => {
        if (!markerRef.current || !position) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        const from = currentPosRef.current || position;
        const to = position;

        const samePos = from.lat === to.lat && from.lng === to.lng;
        if (samePos && pingSeq === 0) return;

        const now = performance.now();
        let duration = DEFAULT_MOVE_ANIMATION_MS;
        if (lastPingTimeRef.current != null) {
            const elapsedSinceLastPing = now - lastPingTimeRef.current;
            duration = Math.min(MAX_MOVE_ANIMATION_MS, Math.max(MIN_MOVE_ANIMATION_MS, elapsedSinceLastPing));
        }
        lastPingTimeRef.current = now;

        const targetBearing = getBearing(from, to);
        const startBearing = currentBearingRef.current;
        const start = now;

        const step = (nowFrame) => {
            const raw = Math.min(1, (nowFrame - start) / duration);
            const t = easeOut(raw);

            const { lat, lng } = lerpPoint(from, to, t);
            const bearing = lerpAngle(startBearing, targetBearing, t);

            currentPosRef.current = { lat, lng };
            currentBearingRef.current = bearing;
            markerRef.current?.setPosition({ lat, lng });

            const roundedBearing = Math.round(bearing / 5) * 5;
            const requestId = ++rotationRequestIdRef.current;
            getRotatedIcon(roundedBearing).then(iconUrl => {
                if (rotationRequestIdRef.current !== requestId) return;
                markerRef.current?.setIcon(associateIconConfig(iconUrl));
            });

            if (raw < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position?.lat, position?.lng, pingSeq]);

    // Pulse bounce on every ping — even when position hasn't changed,
    // gives a visible "heartbeat" so user knows marker is alive and receiving.
    const pulseRafRef = useRef(null);
    useEffect(() => {
        if (!markerRef.current) return;
        const PULSE_DURATION = 300;
        const BASE = ASSOCIATE_ICON_SIZE;
        const PEAK = BASE + 8;
        const start = performance.now();
        const pulse = (now) => {
            const raw = Math.min(1, (now - start) / PULSE_DURATION);
            const wave = raw < 0.5 ? raw * 2 : 2 - raw * 2;
            const size = Math.round(BASE + (PEAK - BASE) * wave);
            const currentIcon = markerRef.current?.getIcon();
            if (currentIcon) {
                markerRef.current.setIcon({
                    ...currentIcon,
                    scaledSize: new window.google.maps.Size(size, size),
                    anchor: new window.google.maps.Point(size / 2, size / 2)
                });
            }
            if (raw < 1) pulseRafRef.current = requestAnimationFrame(pulse);
        };
        pulseRafRef.current = requestAnimationFrame(pulse);
        return () => { if (pulseRafRef.current) cancelAnimationFrame(pulseRafRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pingSeq]);

    return tooltipOpen && tooltipAnchor ? (
        <MapTooltip
            map={map}
            position={tooltipAnchor}
            text={label}
            liftPx={ASSOCIATE_ICON_SIZE / 2 + 10}
        />
    ) : null;
};

const buildArcPath = (from, to, bowFactor = 0.15) => {
    const midLat = (from.lat + to.lat) / 2;
    const midLng = (from.lng + to.lng) / 2;
    const dx = to.lng - from.lng;
    const dy = to.lat - from.lat;
    const offsetLat = -dx * bowFactor;
    const offsetLng = dy * bowFactor;
    const controlPoint = { lat: midLat + offsetLat, lng: midLng + offsetLng };

    const points = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = (1 - t) * (1 - t) * from.lat + 2 * (1 - t) * t * controlPoint.lat + t * t * to.lat;
        const lng = (1 - t) * (1 - t) * from.lng + 2 * (1 - t) * t * controlPoint.lng + t * t * to.lng;
        points.push({ lat, lng });
    }
    return points;
};

const liftPointByPixels = (map, point, liftPx) => {
    const projection = map.getProjection();
    if (!projection) return point;
    const zoom = map.getZoom();
    const scale = Math.pow(2, zoom);

    const worldPoint = projection.fromLatLngToPoint(new window.google.maps.LatLng(point.lat, point.lng));
    const pixelPoint = { x: worldPoint.x * scale, y: worldPoint.y * scale - liftPx };
    const liftedWorldPoint = new window.google.maps.Point(pixelPoint.x / scale, pixelPoint.y / scale);
    const liftedLatLng = projection.fromPointToLatLng(liftedWorldPoint);

    return { lat: liftedLatLng.lat(), lng: liftedLatLng.lng() };
};

const WaitingArc = ({ map, shopPosition, homePosition }) => {
    const polylineRef = useRef(null);

    const computePath = () => {
        const liftedShop = liftPointByPixels(map, shopPosition, ARC_ENDPOINT_LIFT_PX);
        const liftedHome = liftPointByPixels(map, homePosition, ARC_ENDPOINT_LIFT_PX);
        return buildArcPath(liftedShop, liftedHome);
    };

    useEffect(() => {
        if (!map) return;

        polylineRef.current = new window.google.maps.Polyline({
            map,
            path: computePath(),
            strokeOpacity: 0,
            zIndex: 999,
            icons: [{
                icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    strokeColor: '#8a8a8a',
                    scale: 3
                },
                offset: '0',
                repeat: '14px'
            }],
            geodesic: true
        });

        const update = () => polylineRef.current?.setPath(computePath());
        const zoomListener = map.addListener('zoom_changed', update);
        const projectionListener = map.addListener('projection_changed', update);

        return () => {
            polylineRef.current?.setMap(null);
            polylineRef.current = null;
            window.google.maps.event.removeListener(zoomListener);
            window.google.maps.event.removeListener(projectionListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, shopPosition.lat, shopPosition.lng, homePosition.lat, homePosition.lng]);

    return null;
};

// Nearby-delivery markers, equivalent to mobile's createOtherDeliveryMarker().
// Rendered as plain circle symbols since the web app has no ic_place asset.
const OtherDeliveryMarkers = ({ otherDeliveries }) => {
    if (!otherDeliveries?.length || !window.google) return null;

    return otherDeliveries.map((delivery, idx) => {
        const coords = delivery?.location?.coordinates;
        if (!coords) return null;
        const position = { lat: coords[1], lng: coords[0] };

        return (
            <Marker
                key={delivery._id || idx}
                position={position}
                title="Nearby Delivery"
                icon={{
                    url: otherDeliveryIcon,
                    scaledSize: new window.google.maps.Size(36, 36),
                    anchor: new window.google.maps.Point(18, 36) // bottom-center, since it's a pin shape not a circle
                }}
            />
        );
    });
};

const LiveTrackingMap = ({ associateLocation, shopLocation, deliveryLocation, associateStatus, routePath, otherDeliveries, pingSeq }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_API_KEY
    });

    const [mapInstance, setMapInstance] = useState(null);
    const initialCenterRef = useRef(null);
    const lastFollowedPosRef = useRef(null);
    const [activeInfo, setActiveInfo] = useState(null);
    const associateInfoCloserRef = useRef(null);


    useEffect(() => {
        if (isLoaded) ensureTooltipStyles();
    }, [isLoaded]);

    if (!isLoaded) return null;

    const shopPosition = shopLocation?.coordinates
        ? { lat: shopLocation.coordinates[1], lng: shopLocation.coordinates[0] }
        : null;

    const homePosition = deliveryLocation?.coordinates
        ? { lat: deliveryLocation.coordinates[1], lng: deliveryLocation.coordinates[0] }
        : null;

    const rawAssociatePosition = associateLocation?.coordinates
        ? { lat: associateLocation.coordinates[1], lng: associateLocation.coordinates[0] }
        : null;

    if (!rawAssociatePosition && !shopPosition && !homePosition) return null;

    // Real road route takes priority over the decorative dashed waiting arc.
    // Matches mobile: arc only shows before an associate is assigned/started.
    const hasRealRoute = routePath && routePath.length > 1;
    const showWaitingArc = !hasRealRoute && shopPosition && homePosition && (associateStatus == null || associateStatus === 0);

    // Snap ONCE here, at the top level. If the snapped point is too far from
    // the raw GPS (>30m, meaning the route is stale or coarse), fall back to
    // raw so the marker keeps moving instead of freezing on a stale snap point.
    const SNAP_FALLBACK_METERS = 20;
    let associatePosition = rawAssociatePosition;
    if (hasRealRoute && rawAssociatePosition) {
        const snapped = snapToRoute(rawAssociatePosition, routePath);
        const { mPerDegLat, mPerDegLng } = (() => {
            const latRad = (rawAssociatePosition.lat * Math.PI) / 180;
            return { mPerDegLat: 111320, mPerDegLng: 111320 * Math.cos(latRad) };
        })();
        const dLat = (snapped.lat - rawAssociatePosition.lat) * mPerDegLat;
        const dLng = (snapped.lng - rawAssociatePosition.lng) * mPerDegLng;
        const snapDistMeters = Math.sqrt(dLat * dLat + dLng * dLng);
        associatePosition = snapDistMeters <= SNAP_FALLBACK_METERS ? snapped : rawAssociatePosition;
    }

    if (!initialCenterRef.current) {
        initialCenterRef.current = associatePosition || shopPosition || homePosition;
    }

    const shopMarkerIcon = {
        url: shopIcon,
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(15, 30)
    };

    const homeMarkerIcon = {
        url: homeIcon,
        scaledSize: new window.google.maps.Size(60, 56),
        anchor: new window.google.maps.Point(23, 46)
    };

    const SHOP_ICON_HEIGHT = 30;
    const HOME_ICON_HEIGHT = 46;
    const shopTooltipLift = SHOP_ICON_HEIGHT + 10;
    const homeTooltipLift = HOME_ICON_HEIGHT + 10;

    // status <=2 (assigned/started/reached shop): grey, heading to pickup.
    // status 3+ (picked up/shipping): dark, heading to delivery. Mirrors
    // mobile's ParserTask color logic keyed off associate_status.
    const routeColor = ROUTE_COLOR_BEFORE_PICKUP;

    return (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={initialCenterRef.current}
                zoom={associatePosition ? 14 : 13}
                options={{ streetViewControl: false, mapTypeControl: false }}
                onLoad={map => {
                    setMapInstance(map);
                
                }}
                onUnmount={() => setMapInstance(null)}
                onClick={() => {
                    setActiveInfo(null);
                    associateInfoCloserRef.current?.();
                }}
            >
                {shopPosition ? (
                    <Marker
                        position={shopPosition}
                        icon={shopMarkerIcon}
                        onClick={() => {
                            associateInfoCloserRef.current?.();
                            setActiveInfo('shop');
                        }}
                    />
                ) : null}

                {homePosition ? (
                    <Marker
                        position={homePosition}
                        icon={homeMarkerIcon}
                        onClick={() => {
                            associateInfoCloserRef.current?.();
                            setActiveInfo('home');
                        }}
                    />
                ) : null}

                {hasRealRoute ? (
                    <Polyline
                        path={routePath}
                        options={{
                            strokeColor: routeColor,
                            strokeOpacity: 1,
                            strokeWeight: 5,
                            geodesic: true,
                            zIndex: 500
                        }}
                    />
                ) : null}

                <OtherDeliveryMarkers otherDeliveries={otherDeliveries} />
            </GoogleMap>

            {mapInstance && activeInfo === 'shop' && shopPosition ? (
                <MapTooltip map={mapInstance} position={shopPosition} text="Shop Location" liftPx={shopTooltipLift} />
            ) : null}

            {mapInstance && activeInfo === 'home' && homePosition ? (
                <MapTooltip map={mapInstance} position={homePosition} text="Delivery Location" liftPx={homeTooltipLift} />
            ) : null}

            {mapInstance && associatePosition && !showWaitingArc ? (
                <AnimatedAssociateMarker
                    map={mapInstance}
                    position={associatePosition}
                    pingSeq={pingSeq}
                    onOpen={() => setActiveInfo(null)}
                    registerCloser={fn => { associateInfoCloserRef.current = fn; }}
                />
            ) : null}

            {mapInstance && !showWaitingArc ? (
                <FollowAssociate
                    map={mapInstance}
                    position={associatePosition || shopPosition}
                    lastFollowedPosRef={lastFollowedPosRef}
                />
            ) : null}

            {mapInstance && showWaitingArc ? (
                <WaitingArc map={mapInstance} shopPosition={shopPosition} homePosition={homePosition} />
            ) : null}


        </>
    );
};

const FollowAssociate = ({ map, position, lastFollowedPosRef }) => {
    const lastPanTimeRef = useRef(0);

    useEffect(() => {
        if (!map || !position) return;
        if (lastFollowedPosRef.current?.lat === position.lat &&
            lastFollowedPosRef.current?.lng === position.lng) return;

        const now = Date.now();
        if (now - lastPanTimeRef.current < 5000) return;

        map.panTo(position);
        if (map.getZoom() < FOLLOW_ZOOM) map.setZoom(FOLLOW_ZOOM);
        lastFollowedPosRef.current = position;
        lastPanTimeRef.current = now;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, position?.lat, position?.lng]);

    return null;
};

export default LiveTrackingMap;