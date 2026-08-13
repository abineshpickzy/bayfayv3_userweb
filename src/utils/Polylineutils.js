// Port of the Google encoded-polyline decoder used in the mobile app's
// DirectionsJSONParser.decodePoly(). Decodes a single encoded polyline string
// into an array of {lat, lng} points.
export const decodePolyline = (encoded) => {
    if (!encoded) return [];

    const points = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
        let b;
        let shift = 0;
        let result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
        lng += dlng;

        points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return points;
};

// Extracts a flat path of {lat, lng} points from a raw Google Directions API
// response shape (the "GooglePolyLine" object returned by both
// /order/track/delivery/track's top-level `route` field and
// /order/track/delivery/coord's `data` field).
export const extractPathFromGooglePolyline = (googlePolyLine) => {
    if (!googlePolyLine?.routes?.length) return [];

    const path = [];
    googlePolyLine.routes.forEach(route => {
        route.legs?.forEach(leg => {
            leg.steps?.forEach(step => {
                const pts = step?.polyline?.points;
                if (pts) {
                    path.push(...decodePolyline(pts));
                }
            });
        });
    });
    return path;
};

// Builds the GeoJSON Point body shape the backend expects for
// /order/track/delivery/coord (matches mobile's getGeoCoordinates()).
export const toGeoJsonPoint = ({ lat, lng }) => ({
    type: 'Point',
    coordinates: [lng, lat]
});

const EARTH_RADIUS_METERS = 6371000;
const toRad = deg => (deg * Math.PI) / 180;

// Great-circle distance between two {lat, lng} points, in meters.
export const haversineDistanceMeters = (a, b) => {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
    return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
};

// Finds the closest point in `path` to `point`, scanning forward from
// fromIndex only. Mirrors mobile's verifyDeliveryAssociateRoute(), which
// scans routeGeoPoints starting at prevRouteIndex — since the associate is
// assumed to be moving forward along the route, this avoids re-matching
// points already passed and is cheap enough to run on every location tick.
export const findNearestPointOnPath = (path, point, fromIndex = 0) => {
    if (!path || path.length === 0) return null;
    const startIndex = Math.min(Math.max(fromIndex, 0), path.length - 1);
    let bestIndex = startIndex;
    let bestDistance = haversineDistanceMeters(point, path[startIndex]);

    for (let i = startIndex; i < path.length; i++) {
        const d = haversineDistanceMeters(point, path[i]);
        if (d < bestDistance) {
            bestDistance = d;
            bestIndex = i;
        }
    }
    return { index: bestIndex, distanceMeters: bestDistance, point: path[bestIndex] };
};