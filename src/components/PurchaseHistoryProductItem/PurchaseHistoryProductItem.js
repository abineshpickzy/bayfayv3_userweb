import React, { useEffect, useRef, useState } from 'react';
import './PurchaseHistoryProductItem.scss';
import { fetchImage } from "../../utils/imageUtils";
import img from "../../assets/images/100x100.png";
import ImageLoader from "../ImageLoader/ImageLoader";
import moment from "moment";
import Aux from "../../utils/auxilary";
import { useSelector } from "react-redux";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";

const PurchaseHistoryProductItem = ({ product, order, updateProductStatus, writeProductReview, deliveredDate, getProductsDetails, verifyOrder }) => {
    const { sendRequest } = useHttp();
    const apiEndpoints = new ApiEndpoints();

    const [image, setImage] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [productQty, setProductQty] = useState(product.qty);
    const [productStatus, setProductStatus] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [replacementReason, setReplacementReason] = useState('');
    const [invalidReplacementReason, setInvalidReplacementReason] = useState(false);
    const [productVerifying, setProductVerifying] = useState(false);
    const [replacementExplanation, setReplacementExplanation] = useState('');
    const [invalidMessage, setInvalidMessage] = useState(false);
    const [files, setFiles] = useState([]);
    const [invalidImages, setInvalidImages] = useState(false);
    const [canShowProductStatus, setCanShowProductStatus] = useState(false);
    const [negativePrice, setNegativePrice] = useState(false);

    const uploadImageRef = useRef(null);
    const multiUploadImageRef = useRef(null);

    const replacementTitles = useSelector(state => state.trackOrderReducer.replacementTitles);

    useEffect(() => {
        if (order.status === 6) {
            if (product.verify_status === 2 || product.verify_status === 3) {
                setNegativePrice(true);
                if (product.escalated_qty && product.escalated_qty > 0) {
                    setProductQty(product.escalated_qty);
                }
            }
        } else if (order.status === 5) {
            setNegativePrice(false);
        }
    }, []);

    useEffect(() => {
        if (productStatus !== 3) {
            updateProductStatus(product.id, productStatus);
        }
        if (replacementExplanation?.length > 0) {
            setReplacementExplanation('');
        }
        if ((order.status === 6 || order.status === 5) && productStatus !== 0) {
            if (productStatus === 1) {
                setNegativePrice(false);
            } else {
                setNegativePrice(true);
            }
        }
    }, [productStatus]);

    useEffect(() => {
        let isCancelled = false;

        fetchImage(`/product/img/view?img=${product?.image?.name}&format=png&height=300`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                if (!isCancelled) {
                    const imageBase64 = "data:;base64," + base64;
                    setImage(imageBase64);
                }
            })
             .catch(err => console.log(err));

        return () => {
            isCancelled = true;
        }
    }, []);


    const changeQuantity = qty => {
        setProductQty(qty);
        if (productStatus === 2) {
            verifyProduct(qty, false, false, true, productStatus);
        }
    };

    const verifyProduct = (qty, withNotifications, withTitle, withQty, verifyStatus) => {
        if (verifyStatus === 3) {
            setProductVerifying(true);
        }
        const apiBody = {
            category_id: order.category_id,
            shop_id: order.store_id,
            order_id: order._id,
            product_id: product.id,
            verify_status: verifyStatus,
        };
        if (withQty) {
            apiBody['qty'] = qty;
        }
        if (withNotifications) {
            apiBody['notifications'] = product?.notifications === true;
        }
        if (withTitle) {
            const title = productStatus === 1 ? 'delivered' :
                productStatus === 2 ? 'undelivered' :
                    productStatus === 3 ? 'replacement' : '';
            apiBody['title'] = title;
        }
        if (verifyStatus === 3) {
            if (replacementExplanation?.length > 0) {
                apiBody['message'] = replacementExplanation;
            }
            if (files.length > 0) {
                apiBody['image1'] = files[0];
            }
            if (files.length > 1) {
                apiBody['image2'] = files[1];
            }
            if (files.length > 2) {
                apiBody['image3'] = files[2];
            }
        }
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .ordersHistory
                .verifyProduct(apiBody);
        sendRequest(url, method, body, success, error, response => {
            setProductVerifying(false);
            (productStatus === 2 || productStatus === 3) && setCanShowProductStatus(true);
            if (productStatus === 3) {
                setIsVerified(true);
                updateProductStatus(product.id, productStatus);
            }
            if (order.status === 6) {
                verifyOrder();
            }
            getProductsDetails();
        });
    };

    const onImgUpload = e => {
        const file = e.target.files[0];
        saveImage(file);
    };

    const onMultipleImgUpload = e => {
        const file1 = e.target.files[0];
        const file2 = e.target.files.length > 1 ? e.target.files[1] : null;
        const file3 = e.target.files.length > 2 ? e.target.files[2] : null;
        let removeIndex = 2;
        let removeCount = 1;
        if (file2) {
            removeIndex = 1;
            removeCount = 2;
        }
        if (file3) {
            removeIndex = 0;
            removeCount = 3;
        }
        const x = [...uploadedImages];
        x.splice(removeIndex, removeCount);
        const y = [...files];
        y.splice(removeIndex, removeCount);
        setFiles(y);
        setUploadedImages(x);
        saveImage(file1,
            file2 ? saveImage(file2,
                file3 ? saveImage(file3,
                    null) : null) : null)
    };

    const onSubmitReplacement = () => {
        const isMessageValid = replacementExplanation?.length > 0;
        const isReplacementReasonValid = replacementReason?.length > 0;
        const isImagesValid = files?.length > 1;
        setInvalidImages(!isImagesValid);
        setInvalidMessage(!isMessageValid);
        setInvalidReplacementReason(!isReplacementReasonValid);
        if (isMessageValid && isReplacementReasonValid && isImagesValid) {
            verifyProduct(productQty, false, true, true, 3);
        }
    };

    const saveImage = (file, callback) => {
        setFiles(prevState => ([...prevState, file]));
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setUploadedImages(prevState => [...prevState, reader.result.toString()]);
            callback && callback();
        }
    };

    const getDiff = () => {
        const r = moment(order.shop.replacement);
        const d = moment(new Date());
        const diff = r.diff(d, "days");
        return diff;
    };

    const getProductStatus = () => {
        if (product && (order.status === 6 || canShowProductStatus)) {
            const escalatedQty = product.escalated_qty;
            if (!escalatedQty)
                return
            switch (product.escalation_status) {
                case 1:
                    if (product.verify_status === 3) {
                        return `Replacement requested for ${escalatedQty} product(s)`
                    } else {
                        return `Undelivered requested for ${escalatedQty} product(s)`
                    }
                case 2:
                    if (product.verify_status === 3) {
                        return `Replacement request escalated by store for ${escalatedQty} product(s)`
                    } else {
                        return `Undelivered request escalated by store for ${escalatedQty} product(s)`
                    }
                case 3:
                    if (product.verify_status === 3) {
                        return `Replacement request resolved for ${escalatedQty} product(s)`
                    } else {
                        return `Undelivered request resolved for ${escalatedQty} product(s)`
                    }
                case 4:
                    if (product.verify_status === 3) {
                        return `Replacement request accepted for ${escalatedQty} product(s)`
                    } else {
                        return `Undelivered request accepted for ${escalatedQty} product(s)`
                    }
                case 5:
                    if (product.verify_status === 3) {
                        return `Refund requested for ${escalatedQty} product(s)`
                    } else {
                        return `Refund requested for ${escalatedQty} product(s)`
                    }
                case 6:
                    if (product.verify_status === 3) {
                        return `Refund initiated for ${escalatedQty} product(s)`
                    } else {
                        return `Refund initiated for ${escalatedQty} product(s)`
                    }
                case 7:
                    if (product.verify_status === 3) {
                        return `Escalation closed for ${escalatedQty} product(s)`
                    } else {
                        return `Escalation closed for ${escalatedQty} product(s)`
                    }
                default:
                    if (product.verify_status === 3) {
                        return `Replacement request for ${escalatedQty} product(s)`
                    } else {
                        return `Escalation/Undelivered request for ${escalatedQty} product(s)`
                    }
            }
        }
    };

    return (
        <Aux>
            <div className='d-flex py-2 px-3'>
                <div className='d-flex w-100'>
                    <div className='p-2 flex-shrink-0'>
                        {image ? <img src={image} alt="Test" className="track-product-img" /> :
                            <ImageLoader cssClass={'wh80px'} customSize={true} />}
                    </div>
                    <div className='d-flex flex-column px-1 track-product-info'>
                        <div className='font-size-3 font-weight-bold d-flex justify-content-between w-100'>
                            <span className='w-65 text-truncate product-name-color'>{product.product_name}</span>
                            {negativePrice ?
                                ((product.qty - productQty)) > 0 ?
                                    <span
                                        className='mr-5 track-order-blue'>₹ {(product.net_price * (product.qty - productQty)).toFixed(2)}</span>
                                    : <span
                                        className='mr-5 track-order-red'>₹ -{((product.net_price * product.qty) - ((product.qty - productQty) * product.net_price)).toFixed(2)}</span>
                                :
                                <span
                                    className='mr-5 track-order-blue'>₹ {(product.net_price * product.qty).toFixed(2)}</span>}
                        </div>
                        <div className='d-flex mt-1'>
                            <div
                                className='mr-2 d-flex justify-content-end silver-text flex-column font-size-2'>
                                <span className='height-25px justify-content-end d-flex align-items-center'>Unit:</span>
                                <span className='height-25px justify-content-end d-flex align-items-center'>Qty:</span>
                                <span
                                    className='height-25px justify-content-end d-flex align-items-center'>Expiry Date:</span>
                            </div>
                            <div className='silver-text d-flex flex-column font-size-2 flex-grow-1'>
                                <span
                                    className='height-25px d-flex align-items-center flex-grow-1 justify-content-between'>
                                    <span>{product.unit}</span>
                                    {(product.qty - productQty) > 0 ? <span className='font-weight-bold font-size-3'>
                                        <span
                                            className='mr-5 track-order-red'>₹ -{((product.net_price * product.qty) - ((product.qty - productQty) * product.net_price)).toFixed(2)}</span>
                                    </span> : null}
                                </span>
                                <span className='height-25px d-flex align-items-center'>
                                    {!productStatus || productStatus === 1 || canShowProductStatus ? product.qty :
                                        <div className="dropdown btn-small-50px position-relative qty-replacement">
                                            <button type="button" data-toggle="dropdown"
                                                className="btn btn-light font-size-2 cart-item-dropdown p-0 btn-small-50px dropdown-toggle h-25px quantity-btn">
                                                <span className='w-50 d-inherit text-left'>{productQty}</span>
                                            </button>
                                            <div className="dropdown-menu max-height-300px overflow-y-auto">
                                                {Array.from(Array(product.qty).keys()).map(q => (
                                                    <span className="dropdown-item hover-grey" key={q + 1}
                                                        onClick={() => changeQuantity(q + 1)}>{q + 1}</span>
                                                ))}
                                            </div>
                                            <div className='qty-tooltip'>
                                                Select the quantity for which you want replacement
                                            </div>
                                        </div>
                                    }
                                </span>
                                <div className='height-25px d-flex align-items-center'>
                                    <span className='mr-5'>
                                        {product?.mfd_exp?.dates?.length > 0 ?
                                            <span>{moment(product.mfd_exp.dates[0].exp_date).format('DD-MM-YYYY')}</span> :
                                            <span className='unknown-exp-date'>Unknown</span>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span
                            className='d-inline-block w-100 mt-3 font-size-3 replacement-requested-label'>{getProductStatus()}</span>
                        <div
                            className={`d-flex py-3 ${order.status === 6 ? 'justify-content-between' : 'justify-content-start'}`}>
                            {(order.status !== 6 && (!product.verify_status || product.verify_status === 1)) || order.status === 5 ?
                                <div className="form-check mr-3 d-flex align-items-center">
                                    <input className="form-check-input" type="radio" name={product.id}
                                        id={`${product.id}-1`}
                                        value="delivered" checked={productStatus === 1}
                                        onChange={() => {
                                            setProductStatus(1);
                                            setProductQty(product.qty);
                                            verifyProduct(0, true, false, false, 1);
                                        }}
                                        disabled={order.status === 7 || order.status === 9} />
                                    <label className="form-check-label" htmlFor={`${product.id}-1`}>
                                        Delivered
                                    </label>
                                </div> : null}
                            {(order.status !== 6 && (!product.verify_status || product.verify_status === 1)) || order.status === 5 ?
                                <div className="form-check mr-3 d-flex align-items-center">
                                    <input className="form-check-input" type="radio" name={product.id}
                                        id={`${product.id}-2`}
                                        value="undelivered" disabled={order.status === 7 || order.status === 9}
                                        onChange={() => {
                                            setProductStatus(2);
                                            verifyProduct(product.qty, false, false, true, 2);
                                        }}
                                        checked={productStatus === 2} />
                                    <label className="form-check-label" htmlFor={`${product.id}-2`}>
                                        Undelivered
                                    </label>
                                </div> : null}
                            {!product.escalation_status || (getDiff() && order.status === 5) ?
                                <div className="form-check d-flex align-items-center">
                                    <input className="form-check-input" type="radio" name={product.id}
                                        id={`${product.id}-3`}
                                        value="replacement"
                                        disabled={(order.status === 7 || order.status === 9 || product?.verify_status === 2) && order.status !== 5}
                                        onChange={() => setProductStatus(3)}
                                        checked={productStatus === 3} />
                                    <label className="form-check-label" htmlFor={`${product.id}-3`}>
                                        Replacement
                                    </label>
                                </div> : null}
                            {order.status === 6 && product.verify_status === 1 && getDiff() > 0 ?
                                <button className='btn btn-light product-review-btn'
                                    onClick={() => writeProductReview({ ...product, deliveredDate })}>
                                    Write Product Review</button> : null}
                        </div>
                        {productStatus === 3 && !isVerified ? <div className='replacement-info'>
                            <div className='d-flex flex-column px-4 position-relative'>
                                {replacementTitles?.map(title => (
                                    <div className="form-check mb-2 d-flex align-items-center" key={title}>
                                        <input className="form-check-input" type="radio" name={`replace-${product.id}`}
                                            id={title}
                                            value="delivered" checked={replacementReason === title}
                                            onChange={() => setReplacementReason(title)} />
                                        <label className="form-check-label" htmlFor={title}>
                                            {title}
                                        </label>
                                    </div>
                                ))}
                                {invalidReplacementReason ?
                                    <span
                                        className='font-size-2 text-danger invalid-field d-inline-block'>
                                        Please select a reason.
                                    </span> : null}
                                {productVerifying ? <div className='verifying-loader'>
                                    <div className="spinner-border text-dark" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div> : null}
                            </div>
                            <div className='d-flex flex-column font-size-3'>
                                <div className='position-relative'>
                                    <span
                                        className='w-100 text-right replacement-explanation-length'>{replacementExplanation.length}/150</span>
                                    <textarea rows="5" className='w-100 textarea-replacement'
                                        value={replacementExplanation}
                                        maxLength={150}
                                        onChange={e => setReplacementExplanation(e.target.value)} />
                                </div>
                                {invalidMessage ?
                                    <span
                                        className='font-size-2 text-danger invalid-field d-inline-block'>
                                        Message is required.
                                    </span> : null}
                            </div>
                            <div className='d-flex justify-content-between pb-1 pt-2'>
                                <div>
                                    <div className='d-flex'>
                                        <button className='btn btn-light p-0 px-2'
                                            disabled={uploadedImages.length === 3}
                                            onClick={() => {
                                                multiUploadImageRef.current.click()
                                            }}>
                                            <i className="fa fa-paperclip fa-rotate-90" aria-hidden="true" />
                                        </button>
                                        {
                                            Array.from(Array(3 - uploadedImages.length)).map((_, index) => (
                                                <button className='btn btn-light upload-single-image' key={index}
                                                    onClick={() => uploadImageRef.current.click()}>
                                                    <i className="fal fa-plus" />
                                                </button>
                                            ))
                                        }
                                        <input type="file" accept="image/*" ref={uploadImageRef} className='d-none'
                                            onChange={onImgUpload} />
                                        <input type="file" accept="image/*" ref={multiUploadImageRef} className='d-none'
                                            onChange={onMultipleImgUpload} multiple="multiple" />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary border-radius-0 h-30px py-0 d-flex
                                    align-items-center order-submit-btn-colors" onClick={onSubmitReplacement}>
                                    Submit
                                </button>
                            </div>
                            {invalidImages ?
                                <span
                                    className='font-size-2 text-danger invalid-field d-inline-block'>
                                    Please upload at least two images.
                                </span> : null}
                            <div className='d-flex'>
                                {uploadedImages.map((img, index) => (
                                    <div className='position-relative replacement-upload-holder' key={index}>
                                        <img src={img} alt="uploaded" className='replacement-upload' />
                                        <i className="fal fa-times cursor-pointer" onClick={() => {
                                            const imgs = [...uploadedImages];
                                            imgs.splice(index, 1);
                                            setUploadedImages(imgs);
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div> : null}
                    </div>
                </div>
            </div>
            <div className='divider-dashed divider-dashed-757575' />
        </Aux>
    );
};

export default PurchaseHistoryProductItem;
