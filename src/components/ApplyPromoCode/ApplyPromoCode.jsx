import React, {useEffect, useState} from 'react';
import CSSTransition from "react-transition-group/CSSTransition";
import './ApplyPromoCode.scss';
import {useSelector} from "react-redux";
import moment from 'moment';
import {fetchImage} from "../../utils/imageUtils";
import ImageLoader from "../ImageLoader/ImageLoader";
import AuthUtils from "../../utils/AuthUtils";

const animationTiming = {
    enter: 1000,
    exit: 1000
};

const ApplyPromoCode = ({show, closeModal, applyCode, totalAmount}) => {

    const promoList = useSelector(state => state.orderReducer.promoList);
    const [images, setImages] = useState({});
    const [isInvalidPromoCode, setIsInvalidPromoCode] = useState(false);
    const [codeEntered, setCodeEntered] = useState('');

    useEffect(() => {
        let isCanceled = false;
        if (show && promoList?.length > 0 && Object.keys(images).length === 0) {
            promoList.forEach(promo => fetchShopImage(promo.store_icon, isCanceled))
        }
        return () => {
            isCanceled = true;
        }
    }, [show, promoList]);

    const fetchShopImage = (imageName, isCanceled) => {
        fetchImage(`/category/view/img?img=${imageName}&format=jpeg&width=400&height=400`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                if (!isCanceled) {
                    const base64Image = "data:;base64," + base64;
                    setImages(prevState => {
                        prevState[imageName] = base64Image;
                        return {...prevState};
                    });
                }
            })
            .catch(err => console.log(err));
    };

    const checkIfValidAndApply = (promo) => {
        if (!checkIfValid(promo)) return;
        const code = promo.promo_code;
        const isExist = promoList.find(promo => promo.promo_code === code);
        if (isExist) {
            applyCode({code: isExist.promo_code, id: isExist._id, ...isExist});
        }
    };

    const onApplyCode = () => {
        const isExist = promoList.find(promo => promo.promo_code === codeEntered);
        if (!isExist) {
            setIsInvalidPromoCode(true);
            return;
        }
        const isValid = checkIfValid(isExist);
        setIsInvalidPromoCode(!isValid);
        if (isValid) {
            applyCode({code: isExist.promo_code, id: isExist._id, ...isExist});
        }
    };

    const checkIfValid = promo => {

        if (promo.code_pro_obj.value_type == 1 && totalAmount < promo.code_pro_obj.code_value) {
            return false
        }
        const isUserNew = AuthUtils.getIsUserNew();
        if (!isUserNew && promo.customer_id === 2) return false;
        return promo.min_purchase_enable && totalAmount >= promo.min_purchase_obj.value;
    };

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    return (
        <div onClick={closeModal}
             className={`promo-code-container ${show ? 'promo-code-container-open' : 'promo-code-container-closed'}`}>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={show}
                timeout={animationTiming}
                classNames={{
                    enter: '',
                    enterActive: 'modalOpen',
                    exit: 'modalClosed',
                    exitActive: 'modalClosed'
                }}>
                <div className="position-fixed apply-promo-container apply-promo-container-modal d-flex flex-column"
                     onClick={e => e.stopPropagation()}>

                    <div className="closeModalIcon d-flex justify-content-start">
                        <button className='btn close-apply-promo border-0' onClick={closeModal}>
                            <i className="fal fa-times font-size-15"/>
                        </button>
                    </div>

                    <div className="d-flex container mt-2 px-5 flex-column">
                        <div className="input-group apply-code-input-group">
                        <input type="text" className="form-control promo-input" aria-   label="Large"
                                   value={codeEntered}
                                   onInput={toInputUppercase}
                                   onChange={e => setCodeEntered(e.target.value)}
                                   aria-describedby="inputGroup-sizing-sm" placeholder='Enter Promo Code'/>
                            <div className="input-group-append">
                                <button onClick={onApplyCode}
                                        className="input-group-text apply-code-btn min-width-100px d-flex justify-content-center"
                                        id="inputGroup-sizing-lg">Apply
                                </button>
                            </div>
                        </div>
                        {isInvalidPromoCode ?
                            <span className='font-size-2 text-danger text-left'>Promo code is invalid!</span> : null}
                    </div>

                    <div className="d-flex flex-column align-items-center pt-3 items-wrapper font-size-3">
                        {promoList.filter(promo => !promo.hide_from_public).map(promo => (
                            <div key={promo._id}
                                 className={`w-100 mt-1 d-flex cursor-pointer ${checkIfValid(promo) ? '' : 'disabled-promo'}
                    justify-content-between flex-shrink-0 promo-box-shadow bg-white d-flex py-2 px-3`}
                                 onClick={() => checkIfValidAndApply(promo)}>
                                <div className='d-flex justify-content-start flex-grow-1'>
                                    <div className="mr-2">
                                        {
                                            images[promo.store_icon] ?
                                                <img src={images[promo.store_icon]} className='promo-shop-image'
                                                     alt="storeImg"/> :
                                                <ImageLoader cssClass='wh100px' customSize={true}/>
                                        }
                                    </div>

                                    <div className="d-flex flex-column align-items-start py-1">
                            <span
                                className="font-weight-bold promo-shop-title font-size-1rem">{promo.promo_title}</span>
                                        <span
                                            className="promo-shop-info font-size-2">{promo.limited_users_per_day}</span>
                                        <span
                                            className="font-italic overflow-auto mr-2 promo-shop-info2 text-left font-size-2">{promo.applicable_only_for_new_customer}</span>
                                        {(promo.code_pro_obj.value_type === 2 && promo.max_limit === "Max Limit" && promo.code_pro_obj.price_limit) ?
                                            <span
                                                className='font-size-2 max-limit'>Max Limit {promo.code_pro_obj.price_limit} ₹</span> : null}
                                        {promo?.min_purchase_obj?.type === 2 && promo?.min_purchase_obj.value > 0 ?
                                            <span className='font-size-2 promo-discount text-left font-italic'>Minimum Purchase Limit {promo.min_purchase_obj.value}</span> : null}
                                        <span
                                            className="font-italic promo-expiration font-size-2">Expiry on: {moment(promo.expiry_date).format('DD/MM/YYYY')}</span>
                                    </div>
                                </div>

                                <div
                                    className="d-flex flex-column align-items-center justify-content-center align-self-center">
                                    <h5 className="font-weight-bold promo-amount-color">
                                        {promo.code_pro_obj.value_type === 1 ? `₹ ${promo.code_pro_obj.code_value}` : ''}
                                        {promo.code_pro_obj.value_type === 2 ? `${promo.code_pro_obj.code_value} %` : ''}
                                    </h5>
                                    <span
                                        className="font-italic mb-1 promo-discount ">
                                     {(promo.code_pro_obj.offer_type === 2) ? 'Discount' : ''}
                                        {(promo.code_pro_obj.offer_type === 1) ? 'Cashback' : ''}
                                </span>
                                    <span className="promo-code py-1 px-4 text-uppercase">{promo.promo_code}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};
export default ApplyPromoCode;
