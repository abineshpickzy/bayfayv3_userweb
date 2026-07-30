import React, { useEffect, useState } from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import './ProductDetailsModal.scss';
import { getProductOfferPrices, getProductPrice } from "../../utils/productUtils";
import Aux from "../../utils/auxilary";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import { useSelector } from "react-redux";
import useSyncDispatch from "../../hooks/dispatch";
import { REVIEW_FETCH_SUCCESS } from "../../store/actionTypes/products-actions";
import moment from 'moment'
import Loader from "../Loader/Loader";
import ViewImagesModal from "../ViewImagesModal/ViewImagesModal";

const PRODUCT_DETAIL = 'PRODUCT_DETAIL';
const REVIEWS = 'REVIEWS';

const ProductDetailsModal = ({
    _id, show, clickBackdrop, product, templates, loading, itemInCart, categoryId, storesIds,
    imagesLoading, addToCart, removeFromCart, openProductAvailabilityModal,
    openReportProductModal, images, imagesCount
}) => {

    const apiEndpoints = new ApiEndpoints();
    const { sendRequest } = useHttp();
    const { sendDispatch } = useSyncDispatch();

    const [activeTab, setActiveTab] = useState(PRODUCT_DETAIL);
    const [activeImage, setActiveImage] = useState(null);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [productAttributes, setProductAttributes] = useState({});

    const productsReviews = useSelector(state => state.productsReducer.reviews);

    const currentProductReviews = productsReviews.get(_id);

    useEffect(() => {
        if (show && images) {
            const image = images.find(img => img.index === 1);
            setActiveImage(image);
        }
    }, [show, images]);

    useEffect(() => {
        if (show) {
            const id = product.stores[0].product_details.id;
            const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().products.viewProductAttributes(categoryId, storesIds, id);
            sendRequest(url, method, body, success, error, response => {
                saveStocks(response.data);
                setProductAttributes(prevState => ({ ...prevState, ...response.data.productInfo }));
            });
        }
    }, [show]);

    const saveStocks = data => {
        const stock = data.stores.reduce((acc, store) => {
            return acc + store.product_details.stock
        }, 0);
        setProductAttributes(prevState => ({ ...prevState, stock }));
    };

    const { selling_price, offer_selling_price, offer_price, isWithOffer } = getProductOfferPrices(product);

    useEffect(() => {
        if (show && categoryId && storesIds && product?.stores?.length > 0) {
            const id = product.stores[0].product_details.id;
            const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().products.getProductReviews(categoryId, storesIds, id);
            sendRequest(url, method, body, success, error, response => {
                sendDispatch(REVIEW_FETCH_SUCCESS, { productId: _id, review: response.data });
            });
        }
    }, [show]);

    const renderButtons = () => {
        if (!itemInCart) {
            return (
                <button className='btn btn-success btn-sm btn-rounded btn-small align-self-center add-btn'
                    onClick={addToCart}>
                    ADD
                </button>
            );
        }
        return (
            <div className="d-flex justify-content-start w-100 align-items-center">
                <button className='btn btn-sm btn-danger rounded-circle icon-button' onClick={removeFromCart}>
                    <i className="fas fa-minus" />
                </button>
                <span className='px-3 product-qty'>{itemInCart.quantity}</span>
                <button className='btn btn-sm btn-success rounded-circle icon-button' onClick={addToCart}>
                    <i className="fas fa-plus" />
                </button>
                <button className='btn btn-more btn-more-2 h-30px w-60px' onClick={openProductAvailabilityModal}>
                    More
                </button>
            </div>
        )
    };

    const nextImage = () => {
        setActiveImage(prevState => {
            if (prevState.index === images.length) {
                const firstImage = images.find(img => img.index === 1);
                return { ...firstImage };
            }
            const nextImage = images.find(img => img.index === (prevState.index + 1));
            return { ...nextImage };
        })
    };

    const previousImage = () => {
        setActiveImage(prevState => {
            if (prevState.index === 1) {
                const lastIndex = images.length;
                const lastImage = images.find(img => img.index === lastIndex);
                return { ...lastImage };
            }
            const previousImage = images.find(img => img.index === (prevState.index - 1));
            return { ...previousImage };
        })

    };

    let reviewsCount = 0;
    if (currentProductReviews?.total) {
        reviewsCount = currentProductReviews.total;
    }

    const renderReviews = () => {
        if (reviewsCount === 0) {
            return (
                <div className='p-2 d-flex justify-content-center'>
                    <span>No reviews!</span>
                </div>
            )
        }
        return currentProductReviews.customer.map((c, i) =>
            <Aux key={i}>
                <div className='d-flex flex-column mb-1 p-2'>
                    <div className='d-flex flex-row mb-1'>
                        <span className='font-weight-bold'>{c.name}</span>
                        <span className='px-4'>
                            {Array.from(Array(c.rating).keys()).map(counter => (
                                <i className="fas fa-star mx-1 yellow-star" key={counter} />
                            ))}
                            {Array.from(Array(5 - c.rating).keys()).map(counter => (
                                <i className="far fa-star mx-1" key={counter} />
                            ))}
                        </span>
                        <span>{moment(c.at).format('MM/DD/YYYY')}</span>
                    </div>
                    <div className='text-left'>{c.message}</div>
                </div>
                <div className='divider' />
            </Aux>
        )
    };

    const renderProductInfo = () => {
        if (templates && templates.length > 0) {
            return templates[0].template.map(t => {
                if (!productAttributes[`${t.key_name}`]) {
                    return null;
                }
                return (
                    <Aux key={t.key_name}>
                        <span className='font-weight-bold mb-1 pl-2 text-left product-label'>{t.display_name}</span>
                        <span
                            className='mb-1 text-left pl-2 product-value'>{productAttributes[`${t.key_name}`]}</span>
                        <div className='divider mb-1 light-silver-bg' />
                    </Aux>
                )
            })
        }
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog product-details-modal" role="document">
                <div className="modal-content border-radius-0">
                    <div className="modal-header">
                        <h5 className="modal-title text-truncate product-details-title">{product.productInfo.product_name}</h5>
                        <button type="button" className="close close-custom" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                            <span aria-hidden="true" className='product-details-close-btn'>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px product-detail">
                        <div
                            className='image-container d-flex flex-row align-items-center justify-content-between px-4'>
                            <i className={`fal fa-chevron-left image-nav-btn cursor-pointer ${images?.length > 1 ? 'visible' : 'hidden'}`}
                                onClick={previousImage} />
                            <div className='image-lg-holder'>
                                <img src={activeImage?.base64} alt="image" className='image-large mx-auto' />
                            </div>
                            <i className={`fal fa-chevron-right font-size-lg image-nav-btn cursor-pointer ${images?.length > 1 ? 'visible' : 'hidden'}`}
                                onClick={nextImage} />
                        </div>
                        <div className='mt-2 d-flex flex-row align-items-center justify-content-center'>
                            <i className="fal fa-exclamation-square mr-5 font-size-lg report-btn cursor-pointer"
                                onClick={openReportProductModal} />
                            <i className="far fa-search-plus ml-5 font-size-lg zoom-btn cursor-pointer show-image-viewer-btn"
                                onClick={() => setShowImageViewer(true)} />
                        </div>
                        <div
                            className='row text-center bg-light-silver mx-0 product-info mt-2 py-2 justify-content-center'>
                            <div className='text-right pr-3 d-flex flex-column'>
                                <span className='h-25px'>Unit:</span>
                                <span className='h-25px'>Price:</span>
                                <span className='h-25px'>Qty:</span>
                            </div>
                            <div className='text-left pl-3 d-flex flex-column'>
                                <span className='h-25px'>{product.productInfo.unit}</span>
                                {
                                    isWithOffer ?
                                        <span className='h-25px'>
                                            <s className='mr-3'>₹ {selling_price}</s>
                                            <span className='mr-3'>₹ {offer_selling_price}</span>
                                            <span className='offer-price'>
                                                Save: ₹
                                                {(itemInCart?.quantity > 1 ? offer_price * itemInCart.quantity : offer_price).toFixed(2)}
                                            </span>
                                        </span> :
                                        <span className='h-25px'>₹ {getProductPrice(product)}</span>
                                }
                                <span className='h-25px'>
                                    {renderButtons()}
                                </span>
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className='row mx-0'>
                                <div
                                    className={`col-6 tab py-1 cursor-pointer ${activeTab === PRODUCT_DETAIL ? 'active-tab' : ''}`}
                                    onClick={() => setActiveTab(PRODUCT_DETAIL)}>
                                    Product Detail
                                </div>
                                <div
                                    className={`col-6 tab py-1 cursor-pointer ${activeTab === REVIEWS ? 'active-tab' : ''}`}
                                    onClick={() => setActiveTab(REVIEWS)}>
                                    Reviews({reviewsCount})
                                </div>
                            </div>
                            <div>
                                {activeTab === PRODUCT_DETAIL ?
                                    <div className='mt-2 d-flex flex-column font-size-3'>
                                        {renderProductInfo()}
                                    </div> :
                                    <div className='mt-2 d-flex flex-column font-size-3'>
                                        {renderReviews()}
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {(imagesLoading || loading || (images?.length !== imagesCount)) && <Loader />}
            <ViewImagesModal imagesLoading={imagesLoading} show={showImageViewer}
                clickBackdrop={() => setShowImageViewer(false)}
                onNext={nextImage} imageBase64={activeImage?.base64}
                onPrev={previousImage} />
        </ModalWrapper>
    );
};

export default ProductDetailsModal;
