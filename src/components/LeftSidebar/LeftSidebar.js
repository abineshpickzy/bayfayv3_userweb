import React, { useEffect, useState } from 'react';
import './LeftSidebar.scss';
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import ImageLoader from "../ImageLoader/ImageLoader";
import { useSelector } from "react-redux";
import Aux from "../../utils/auxilary";

const LeftSidebar = ({ categories, onCategorySelect, isPrivate }) => {

    const {
        image,
        shop
    } = useSelector(state => state.shopsReducer.openedShop);

    const [shopCount, setShopCount] = useState(-1);

    useEffect(() => {
        calculateShopCount();
    }, [shop]);

    const calculateShopCount = () => {
        if (shop?.stores?.length > 0) {
            setShopCount(shop.stores.length);
        }
    };

    const getDeliveryTime = () => {
        let deliveryTime = '';
        if (shop?.delivery?.local?.delivery_max_hours || shop?.delivery?.local?.delivery_max_minutes) {
            if (shop?.delivery?.local?.delivery_max_hours) {
                deliveryTime = shop?.delivery.local.delivery_max_hours.toString();
            }
            if (shop?.delivery?.local?.delivery_max_minutes) {
                let prefix = '';
                if (deliveryTime.length > 0) {
                    prefix = ':'
                }
                deliveryTime += `${prefix}${shop.delivery.local.delivery_max_minutes} mins`;
            } else {
                deliveryTime += ' hours';
            }
            return deliveryTime;
        }
        return shop?.delivery_local_duration?.toString().length > 0 ?
            `${shop?.delivery_local_duration} ${shop?.delivery_local_duration_unit}` : '';
    };

    return (
        <div className='left-sidebar d-flex flex-column align-items-center justify-content-between p-1 pb-6'>
            <div className='w-100 d-flex flex-column align-items-center'>
                <div className='d-flex flex-column shop-info pt-3'>
                    <div className='image-placeholder position-relative'>
                        {image ?
                            <img src={image} alt="logo" className='image-100x100 border-radius-5px' /> :
                            <ImageLoader cssClass={'leftSidebarImgSpinner'} customSize={true} />
                        }
                        {(shopCount !== -1 && !isPrivate) ?
                            <span className='shop-count'>
                                {shopCount}
                            </span> : null}
                    </div>
                    <div className='shop-name-label'>{shop?.display_name}</div>
                    <h1 className='h1-hidden'>{shop?.display_name}</h1>
                    <div className='mt-2 rating-delivery d-flex flex-row justify-content-center pb-2 w-100'>
                        <div className='d-flex flex-column align-items-center w-40'>
                            {shop?.rating ? <Aux>
                                <span className='font-size-1rem font-weight-bold text-center text-white'>
                                    <i className='fas fa-star mr-2 store-rating-star' />
                                    <span className='shop-info-color'>{(+(shop?.rating))?.toFixed(1)}</span>
                                </span>
                                <span className='font-size-2 text-center shop-info-label'>Ratings</span>
                            </Aux> : shop ?
                                <span className='font-size-3 text-center shop-info-label pt-2'>No Ratings</span> : null}
                        </div>
                        <div className='rating-delivery-separator' />
                        <div className='d-flex flex-column align-items-center w-40'>
                            {getDeliveryTime().toString().length > 0 && <Aux>
                                <span
                                    className='font-size-1rem font-weight-bold text-center shop-info-color'>
                                    {getDeliveryTime()}
                                </span>
                                <span className='font-size-2 text-center shop-info-label'>Delivery Time</span>
                            </Aux>}
                        </div>
                    </div>
                </div>
                <div className='w-100 mt-2 categories-wrapper'>
                    {
                        categories?.length > 0 &&
                        <CustomDropdown items={categories} onSelect={onCategorySelect} preSelected={'All'}
                            allValue={true} />
                    }
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;
