import React, { useEffect, useState } from 'react';
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import './CustomizeOrderModal.scss';
import Aux from "../../utils/auxilary";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import { fetchImage } from "../../utils/imageUtils";
import ImageLoader from "../ImageLoader/ImageLoader";

const NO_IMAGE = 'NO_IMAGE';

const CustomizeOrderModal = ({ show, clickBackdrop, categoryId, stores }) => {
    const apiEndpoints = new ApiEndpoints();
    const { sendRequest, error } = useHttp();
    const [customShops, setCustomShops] = useState([]);
    const [autoSelectedShops, setAutoSelectedShops] = useState([]);
    const [autoSelectedShopsIds, setAutoSelectedShopsIds] = useState([]);
    const [counter, setCounter] = useState(0);
    const [images, setImages] = useState({});
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [writingToCartRequest, setWritingToCartRequest] = useState(false);

    useEffect(() => {
        if (show) {
            setCounter(0);
            setCustomShops([]);
            setAutoSelectedShopsIds([]);
            setCustomShops([]);
            setWritingToCartRequest(false);
            setSelectedStoreId(false);
        }
    }, [show]);

    useEffect(() => {
        let isCanceled = false;
        if (show && stores && categoryId) {
            getAutoSelectedStores(isCanceled);
        }

        return () => {
            isCanceled = true;
        }
    }, [show, categoryId, stores]);

    const getAutoSelectedStores = (isCanceled) => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .custom
                .viewAutoSelect(categoryId);
        sendRequest(url, method, body, success, error, response => {
            !isCanceled && setCounter(prevState => prevState + 1);
            !isCanceled && setAutoSelectedShops(response.data);
            if (response.data) {
                const shopsIds = response.data.map(t => t._id);
                !isCanceled && setAutoSelectedShopsIds(shopsIds);
                const customStoresIds = stores.filter(id => !shopsIds.includes(id));
                if (customStoresIds.length > 0) {
                    getCustomShop(isCanceled, customStoresIds);
                } else {
                    !isCanceled && setCounter(prevState => prevState + 1);
                }
            }
            response.data.forEach(store => {
                store.shop.image = getShopImage(store.shop.private.icon, isCanceled, store._id);
            })
        });
    };

    const getShopImage = (imageName, isCanceled, storeId) => {
        if (!imageName) {
            if (!isCanceled) {
                setImages(prevState => {
                    prevState[storeId] = NO_IMAGE;
                    return { ...prevState };
                });
            }
            return;
        }

        fetchImage(`/category/view/img?img=${imageName}&format=jpeg&width=300&height=300`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '', images
                    ),
                );
                if (!isCanceled && (!images[storeId] || images[storeId] === NO_IMAGE)) {
                    const imageBase64 = "data:;base64," + base64;
                    setImages(prevState => {
                        prevState[storeId] = imageBase64;
                        return { ...prevState };
                    });
                }
            })
            .catch(err => console.log(err));
    };

    const getCustomShop = (isCanceled, storesIds) => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .custom
                .viewCustomShop(categoryId, storesIds);
        sendRequest(url, method, body, success, error, response => {
            !isCanceled && setCounter(prevState => prevState + 1);
            !isCanceled && setCustomShops(response.data);

            response.data.forEach(store => {
                store.shop.image = getShopImage(store.shop.private.icon, isCanceled, store._id);
            })
        });
    };

    const writeToCart = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .custom
                .writeToCart(categoryId, selectedStoreId);
        sendRequest(url, method, body, success, error, () => {
            clickBackdrop(true);
        });
    };

    const onSelect = () => {
        if (selectedStoreId) {
            setWritingToCartRequest(true);
            writeToCart();
        } else {
            clickBackdrop();
        }
    };

    const productTemplate = (p) => {
        return (
            <div className='d-flex align-items-center product-border-bottom py-2' key={p.id}>
                <div className='green-circle mr-2 mt-0' />
                <span className='flex-grow-1 d-flex align-items-center product-name-qty'>
                    <span
                        className='flex-grow-1 text-truncate product-name'>{p.product_name}</span>
                    <span
                        className='qty-width text-center d-inline-block'>x {p.qty}</span>
                </span>
                <span className='price-width text-right'>
                    ₹{p.selling_price.toFixed(2)}
                </span>
            </div>
        )
    };

    const renderProducts = () => {
        return autoSelectedShops.flatMap(a => a.products)
            .map(p => {
                return productTemplate(p);
            })
    };

    const priceTemplate = (grossPrice, taxes, delivery, netPrice, onlyTax, packagingPrice) => {
        return (
            <Aux>
                <div className='py-1 d-flex'>
                    <span className='font-italic label-width'>Item Total</span>
                    <span className='price-width'>₹{grossPrice.toFixed(2)}</span>
                </div>
                <div className='py-1 d-flex'>
                    <span className='font-italic label-width'>Delivery</span>
                    <span className='price-width'>₹{delivery.toFixed(2)}</span>
                </div>
                <div className='py-1 d-flex'>
                    <span className='label-width'>
                        <span className='font-italic'>Tax and Charges</span>
                        <div className="btn-group dropup">
                            <button type="button" className="btn btn-light bg-white p-0 ml-3"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fal fa-question-circle text-secondary align-self-center cursor-pointer" />
                            </button>
                            <div className="dropdown-menu width-150px px-2 font-size-2">
                                <span className='d-flex flex-column text-secondary'>
                                    <span className='mb-1 d-flex justify-content-between'>
                                        <span className='flex-grow-1 line-height-initial'>Shop Packaging charge:</span>
                                        <span
                                            className='flex-shrink-0 text-right'>₹{packagingPrice?.toFixed(2)}</span>
                                    </span>
                                    <span className='d-flex justify-content-between'>
                                        <span className='flex-grow-1'>Tax: </span>
                                        <span
                                            className='flex-shrink-0 text-right'>₹{onlyTax?.toFixed(2)}</span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </span>
                    <span className='price-width'>₹{taxes.toFixed(2)}</span>
                </div>
                <div className='py-1 d-flex total-top-border'>
                    <span className='font-weight-bold label-width'>Total</span>
                    <span className='price-width font-weight-bold'>₹{netPrice.toFixed(2)}</span>
                </div>
            </Aux>
        )
    };

    const renderPrices = () => {
        let grossPrice = 0;
        let taxes = 0;
        let delivery = 0;
        let netPrice = 0;
        let onlyTax = 0;
        let packagingPrice = 0;
        autoSelectedShops.flatMap(a => a.prices).forEach(prices => {
            grossPrice += prices.gross_price;
            taxes += prices.taxes;
            delivery += prices.delivery;
            netPrice += prices.net_price;
            onlyTax += prices.onlyTaxes;
            packagingPrice += prices.packaging_price;
        });
        return priceTemplate(grossPrice, taxes, delivery, netPrice, onlyTax, packagingPrice);
    };

    const shopRow = (storeName, storeRating, totalPrice, qty, withBtn, storeId, prices, products) => {
        const { gross_price, taxes, delivery, net_price, onlyTaxes, packaging_price } = prices;
        return (
            <Aux key={storeId}>
                <div className='p-2 d-flex align-items-center'>
                    <button className='shop-image-holder' data-toggle="collapse"
                        data-target={`#collapse${storeId}`} aria-expanded="false"
                        aria-controls="collapse">
                        {
                            images[storeId] ?
                                <Aux>
                                    {images[storeId] === NO_IMAGE ?
                                        <img src={require('../../assets/images/100x100.png')}
                                            className='shop-image rounded-10px'
                                            alt="img" /> :
                                        <img src={images[storeId]} className='shop-image rounded-10px' alt="img" />}
                                </Aux> : <ImageLoader cssClass={'co-shop-image'} customSize={true} />
                        }
                    </button>
                    <div
                        className='d-flex align-items-center shop-bottom-border flex-grow-1 pl-2 ml-1 font-size-3 h-100px'>
                        <div className='d-flex flex-column align-items-start justify-content-center flex-grow-1'>
                            <span className='font-weight-bold mb-2 text-left store-name'>{storeName}</span>
                            <span className='font-italic'>Total price: ₹{totalPrice}</span>
                        </div>
                        <div className='rating-container'>
                            {storeRating && <Aux>
                                <span className='font-italic px-4 d-flex justify-content-between mb-2'>
                                    <span>Rating:</span>
                                    <span>{storeRating.toFixed(1)}</span>
                                </span>
                                <span>
                                    {Array.from(Array(Math.floor(storeRating)).keys()).map(counter => (
                                        <i className="fas fa-star mx-1 yellow-star font-size-1rem" key={counter} />
                                    ))}
                                    {Array.from(Array(5 - Math.floor(storeRating)).keys()).map(counter => (
                                        <i className="far fa-star mx-1 font-size-1rem" key={counter} />
                                    ))}
                                </span>
                            </Aux>}
                        </div>
                        <div className='quantity'>
                            {
                                withBtn ?
                                    <div className="form-check d-flex align-items-center">
                                        <input className="form-check-input wh-20px mt-0" type="radio"
                                            onChange={() => {
                                                setSelectedStoreId(storeId)
                                            }}
                                            name="selectedShop"
                                            value="1" />
                                    </div> :
                                    <span>{qty}</span>
                            }
                        </div>
                    </div>
                </div>
                <div id={`collapse${storeId}`} className="collapse font-size-3 px-4">
                    {products.map(p => productTemplate(p))}
                    {priceTemplate(gross_price, taxes, delivery, net_price, onlyTaxes, packaging_price)}
                </div>
            </Aux>
        )
    };

    const renderAutoSelectedShops = () => {
        return autoSelectedShops.map(t => {
            const { prices, shop, products } = t;
            const qty = products.reduce((acc, product) => {
                return acc + product.qty
            }, 0);
            return shopRow(shop.display_name, shop.rating, prices.net_price, qty, false, t._id, prices, products);
        });
    };

    const renderCustomShops = () => {
        return customShops
            .filter(t => !autoSelectedShopsIds.includes(t._id))
            .map(t => {
                const { prices, shop, products } = t;
                const qty = products.reduce((acc, product) => {
                    return acc + product.qty
                }, 0);
                return shopRow(shop.display_name, shop.rating, prices.net_price, qty, true, t._id, prices, products);
            });
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog customize-order-modal" role="document">
                <div className="modal-content">
                    <div className="modal-header border-0 py-2">
                        <h5 className="modal-title">Customize Order</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px p-0 customize-order">
                        {counter < 2 && !error ?
                            <div className={'cor-spinner-container'}><RequestSpinner /></div> :
                            <Aux>
                                <div className='product-selected-shops'>
                                    <span>
                                        Product Selected Shops
                                    </span>
                                    <div className='width-60px d-flex justify-content-center align-items-center'>
                                        <div className="form-check d-flex align-items-center">
                                            <input className="form-check-input wh-20px mt-0" type="radio"
                                                checked={!selectedStoreId}
                                                onChange={() => {
                                                    setSelectedStoreId(null);
                                                }}
                                                name="selectedShop"
                                                value="1" />
                                        </div>
                                    </div>
                                </div>
                                {renderAutoSelectedShops()}
                                <Aux>
                                    <button className="details-btn" type="button" data-toggle="collapse"
                                        data-target="#collapseExample" aria-expanded="false"
                                        aria-controls="collapseExample">
                                        <span>Details</span>
                                        <i className="far fa-chevron-down details-down-icon" />
                                    </button>
                                    <div className="collapse font-size-3" id="collapseExample">
                                        <div className='d-flex flex-column px-4'>
                                            {renderProducts()}
                                            {renderPrices()}
                                        </div>
                                    </div>
                                </Aux>
                                {renderCustomShops()}
                            </Aux>
                        }
                    </div>
                    <div className="modal-footer d-flex justify-content-around align-items-center">
                        <button type="button" className="btn cancel-select-btn" data-dismiss="modal"
                            onClick={clickBackdrop}>
                            Cancel
                        </button>
                        <button type="button" className="btn select-btn" onClick={onSelect}>
                            Select
                        </button>
                    </div>
                </div>
            </div>
            {writingToCartRequest && <RequestSpinner />}
        </ModalWrapper>
    );
};

export default CustomizeOrderModal;
