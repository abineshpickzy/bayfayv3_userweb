import React, { useEffect, useState } from 'react';
import LocationSearch from "../components/Location-search/LocationSearch";
import Aux from "../utils/auxilary";
import ShopItems from "../components/Shop-items/ShopItems";
import { useSelector } from "react-redux";
import './Shopping.scss';
import Loader from "../components/Loader/Loader";
import { NavLink } from "react-router-dom";
import { HIDE_NO_NEARBY_SHOPS_WARNING } from "../store/actionTypes/global-actions";
import useSyncDispatch from "../hooks/dispatch";
import { Helmet } from "react-helmet";

const publicStaticImagePrefix = 'public';
const privateStaticImagePrefix = 'private';
const brandedStaticImagePrefix = 'branded';

const Shopping = (props) => {
    const { sendDispatch } = useSyncDispatch();

    const deliveryLocationCoordinates = useSelector(state => state.globalReducer.deliveryLocationCoordinates);
    const productSearchLocationCoordinates = useSelector(state => state.globalReducer.productSearchLocationCoordinates);
    const showNoNearbyShopsWarning = useSelector(state => state.globalReducer.showNoNearbyShopsWarning);
    const [counter, setCounter] = useState(0);
    const [error, setError] = useState(null);
    const [showLocationWarning, setShowLocationWarning] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    const increaseCounter = () => {
        setCounter(prevCounter => prevCounter + 1);
    };

    const resetCounter = () => {
        setCounter(0);
    };

    const removeInfo = () => {
        sendDispatch(HIDE_NO_NEARBY_SHOPS_WARNING);
    };

    const { privateShops, publicShops, globalShops, brandedShops } = useSelector(state => {
        return {
            privateShops: state.shopsReducer.privateShops,
            publicShops: state.shopsReducer.publicShops,
            globalShops: state.shopsReducer.globalShops,
            brandedShops: state.shopsReducer.brandedShops
        }
    });

    const renderWarning = () => {
        const isDefaultCoordinates = ((productSearchLocationCoordinates && productSearchLocationCoordinates.lng === 0 &&
            productSearchLocationCoordinates.lat === 0) &&
            (deliveryLocationCoordinates && deliveryLocationCoordinates.lng === 0 && deliveryLocationCoordinates.lat === 0));
        return isDefaultCoordinates && showLocationWarning ? (
            <div className='w-70 m-auto d-flex align-items-center location-warning-container'>
                <div className='flex-grow-1 d-flex align-items-center'>
                    <img src={require('../assets/images/warning.png')} alt="warning" className='location-warning-img' />
                    <span className='location-warning-text'>
                        Kindly select the Delivery Location and Search Location to view nearby shops!
                    </span>
                </div>
                <span className='location-warning-close'>
                    <i className="fal fa-times font-size-15 cursor-pointer"
                        onClick={() => setShowLocationWarning(false)} />
                </span>
            </div>
        ) : null;
    };

    const renderShops = () => {
        if (privateShops.shops === null || publicShops.shops === null || brandedShops.shops === null || globalShops.shops === null) {
            return null;
        }
        if (privateShops.count > 0 && publicShops.count > 0) {
            if (brandedShops.count > 0) {
                return (
                    <Aux>
                        {publicShops.shops &&
                            <ShopItems staticImagePrefix={publicStaticImagePrefix}
                                title={"Public Shops:"} isPrivate={false}
                                isOtherLocationShop={false} isPublic={true}
                                shopsObject={publicShops} showCount={true} />}
                        {privateShops.shops &&
                            <ShopItems staticImagePrefix={privateStaticImagePrefix}
                                title={"Private Shops:"} isPrivate={true}
                                isOtherLocationShop={false}
                                shopsObject={privateShops} />}
                        {brandedShops.shops &&
                            <ShopItems staticImagePrefix={brandedStaticImagePrefix}
                                title={"Branded Shops"} isPrivate={false}
                                isOtherLocationShop={false} isBranded={true}
                                shopsObject={brandedShops} showCount={true} />}
                        {globalShops.shops &&
                            <ShopItems staticImagePrefix={publicStaticImagePrefix}
                                title={"Other location shops:"} isPrivate={false}
                                isOtherLocationShop={true}
                                shopsObject={globalShops} showCount={true} />}
                    </Aux>
                )
            } else {
                return (
                    <Aux>
                        {publicShops.shops &&
                            <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Public Shops:"}
                                shopsObject={publicShops} showCount={true} isPrivate={false}
                                isOtherLocationShop={false} isPublic={true} />}
                        {privateShops.shops &&
                            <ShopItems staticImagePrefix={privateStaticImagePrefix} title={"Private Shops:"}
                                shopsObject={privateShops} isPrivate={true} isOtherLocationShop={false} />}
                        {globalShops.shops &&
                            <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Other location shops:"}
                                shopsObject={globalShops} showCount={true} isPrivate={false}
                                isOtherLocationShop={true} />}
                        {brandedShops.shops &&
                            <ShopItems staticImagePrefix={brandedStaticImagePrefix} title={"Branded Shops"}
                                shopsObject={brandedShops} showCount={true} isPrivate={false}
                                isOtherLocationShop={false} isBranded={true} />}
                    </Aux>
                )
            }
        } else if (publicShops.count === 0 && privateShops.count > 0 && brandedShops.count > 0) {
            return (
                <Aux>
                    {privateShops.shops &&
                        <ShopItems staticImagePrefix={privateStaticImagePrefix} title={"Private Shops:"}
                            shopsObject={privateShops} isPrivate={true} isOtherLocationShop={false} />}
                    {brandedShops.shops &&
                        <ShopItems staticImagePrefix={brandedStaticImagePrefix} title={"Branded Shops"}
                            shopsObject={brandedShops} showCount={true} isPrivate={false} isBranded={true}
                            isOtherLocationShop={false} />}
                    {globalShops.shops &&
                        <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Other location shops:"}
                            shopsObject={globalShops} showCount={true} isPrivate={false}
                            isOtherLocationShop={true} />}
                    {publicShops.shops && <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Public Shops:"}
                        shopsObject={publicShops} showCount={true} isPrivate={false}
                        isOtherLocationShop={false} isPublic={true} />}
                </Aux>
            )
        } else if (publicShops.count === 0 && privateShops.count === 0 && brandedShops.count === 0) {
            const isDefaultCoordinates = ((productSearchLocationCoordinates && productSearchLocationCoordinates.lng === 0 &&
                productSearchLocationCoordinates.lat === 0) &&
                (deliveryLocationCoordinates && deliveryLocationCoordinates.lng === 0 && deliveryLocationCoordinates.lat === 0));
            return (
                <Aux>
                    {showNoNearbyShopsWarning && !isDefaultCoordinates && <div
                        className='d-flex flex-column justify-content-center align-items-center mb-2 rounded-10 background-light-silver p-2'>
                        <div className='d-flex flex-row align-self-start justify-content-between'>
                            <span className='empty-stores-info text-center'>
                                No nearby shops found within the specified kilometers, we will notify you when shops
                                attached
                                in your area.
                                Meanwhile you can purchase from below Other Location Shops. If you are a merchant click
                                below
                                link for more details.
                            </span>
                            <span
                                className='fal fa-times close-circle d-flex align-items-center justify-content-center cursor-pointer'
                                onClick={removeInfo} />
                        </div>
                        <NavLink exact={true} to={'/partner'}>Click here</NavLink>
                    </div>}
                    {globalShops.shops &&
                        <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Other location shops:"}
                            shopsObject={globalShops} showCount={true} isPrivate={false}
                            isOtherLocationShop={true} />}
                    {publicShops.shops &&
                        <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Public Shops:"} isPublic={true}
                            shopsObject={publicShops} showCount={true} isPrivate={false}
                            isOtherLocationShop={false} />}
                    {privateShops.shops &&
                        <ShopItems staticImagePrefix={privateStaticImagePrefix} title={"Private Shops:"}
                            shopsObject={privateShops} isPrivate={true} isOtherLocationShop={false} />}
                    {brandedShops.shops &&
                        <ShopItems staticImagePrefix={brandedStaticImagePrefix} title={"Branded Shops"} isBranded={true}
                            shopsObject={brandedShops} showCount={true} isPrivate={false}
                            isOtherLocationShop={false} />}
                </Aux>
            )
        } else {
            return (
                <Aux>
                    {privateShops.shops &&
                        <ShopItems staticImagePrefix={privateStaticImagePrefix} title={"Private Shops:"}
                            shopsObject={privateShops} isPrivate={true} isOtherLocationShop={false} />}
                    {globalShops.shops &&
                        <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Other location shops:"}
                            shopsObject={globalShops} showCount={true} isPrivate={false}
                            isOtherLocationShop={true} />}
                    {publicShops.shops &&
                        <ShopItems staticImagePrefix={publicStaticImagePrefix} title={"Public Shops:"} isPublic={true}
                            shopsObject={publicShops} showCount={true} isPrivate={false}
                            isOtherLocationShop={false} />}
                    {brandedShops.shops &&
                        <ShopItems staticImagePrefix={brandedStaticImagePrefix} title={"Branded Shops"} isBranded={true}
                            shopsObject={brandedShops} showCount={true} isPrivate={false}
                            isOtherLocationShop={false} />}
                </Aux>
            )
        }
    };

    return (
        <Aux>
            <Helmet>
                <title id={'homepage-title'}>Order Food, Groceries, Meat on BayFay, best home delivery service. Order from restaurants and nearby shops</title>
                <meta name="description" id={'description1'}
                    content="Order food online from restaurants and get it delivered. Serving in Bangalore, Hyderabad, Delhi, Gurgaon, Nagpur, Jaipur, Coimbatore, Chandigarh, Ahemdabad, Visakhapatnam, Lucknow, Noida, Mumbai, Pune, Indore, Kochi, Kolkata, Nagercoil and Chennai. Order Pizzas, Burgers, Biryanis, Desserts." />
                <meta name="keywords" id={'keywords1'}
                    content="restaurants, order food, order Groceries, order Meat, order online, order food online, food, delivery, food delivery, home delivery, fast, hungry, quickly, offer, discount, takeaway, cuisine, pizza, burger, biryani, dessert, juice, dosa, bangalore, visakhapatnam, nagpur, bengaluru, delhi, gurgaon, ncr, noida, lucknow, hyderabad, mumbai, jaipur, bombay, chennai, pune, kolkata, ahemdabad, kochi, coimbatore, nagercoil, pizza hut, mcd, mcdonalds, dominos, haagen dazs, baskin robbins, papa johns, kfc, haldiram, breakfast, lunch, dinner, snacks, restaurants near me, Aashirvaad, Saffola, Fortune, Nestle, Amul, Mother Dairy, Coke, Pepsi, Bisleri, Colgate, Patanjali, Dabur, Surf Excel, Maggi, Vim, Haldiram's, Kellogg’s, Nescafe, Pampers" />
                <meta httpEquiv="X-UA-Compatible" content="IE=Edge,chrome=1" id={'X-UA-Compatible1'} />
                <meta name="robots" content="index, follow" id={'robots1'} />
                <meta name="og_site_name" id="og_site_name1" property='og:site_name' content="bayfay.com" />
                <meta name="og_title" id="og_title1" property="og:title"
                    content="Order Food, Groceries, Meat on BayFay, best home delivery service. Order from restaurants and nearby shops" />
                <meta property="og:type" id="property1" content="website" />
                <meta property="og:description" id='property2'
                    content="Order food online from restaurants and get it delivered. Serving in Bangalore, Hyderabad, Delhi, Gurgaon, Nagpur, Jaipur, Coimbatore, Chandigarh, Ahemdabad, Visakhapatnam, Lucknow, Noida, Mumbai, Pune, Indore, Kochi, Kolkata, Nagercoil and Chennai. Order Pizzas, Burgers, Biryanis, Desserts." />
                <meta name="og_url" id="property3" property="og:url" content={`${window.location.origin}/home`} />
                <meta property="og:image" id="property4" content='../assets/images/bayfay-logo.png' />
                <link rel="icon" id={'icon192x192'} sizes="192x192"
                    href={`${window.location.origin}/icons/images/icon-192x192.png`} />
                <link rel="apple-touch-icon" id='apple-touch-icon192x192' sizes="192x192"
                    href={`${window.location.origin}/icons/images/icon-192x192.png`} />
                <meta name="msapplication-TileColor" id="msapplication-TileColor1" content="#1d9bf6" />
                <meta name="msapplication-TileImage" id="msapplication-TileImage1"
                    content={`${window.location.origin}/icons/images/mstile-150x150.png`} />
                <link rel="icon" id='iconimage/x-icon' type="image/x-icon"
                    href={`${window.location.origin}/icons/images/favicon-16x16.ico`} />
                <link rel="shortcut icon" id={'shortcut iconimage/x-icon'} type="image/x-icon"
                    href={`${window.location.origin}/icons/images/favicon-32x32.ico`} />
                <link rel="icon" type="image/png" id={'icon123'}
                    href={`${window.location.origin}/icons/images/favicon-96x96.png`} />
                <link rel="apple-touch-icon-precomposed" sizes="72x72" id={'apple-touch-icon-precomposed12'}
                    href={`${window.location.origin}/icons/images/apple-touch-icon-72x72.png`} />
            </Helmet>
            <LocationSearch increaseCounter={increaseCounter} resetCounter={resetCounter} setError={setError} />
            {renderWarning()}
            <div className="w-70 m-auto shopping-min-height">
                {renderShops()}
            </div>
            {counter < 2 && !error &&
                <div className='shops-loader-container'>
                    <Loader />
                </div>}
        </Aux>
    );
};
export default Shopping;
