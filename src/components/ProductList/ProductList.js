import React, { useEffect, useRef, useState } from 'react';
import Product from "../Product/Product";
import "./ProductList.scss";
import { CANCEL_DRAGGING, START_DRAGGING_PRODUCT } from "../../store/actionTypes/cart-actions";
import useSyncDispatch from "../../hooks/dispatch";
import Aux from "../../utils/auxilary";

const ProductList = ({
    loadNextPage, products, loading, showLocationAlert, selectedCategory, loadProductsBySearch,
    canAddToCart, showWarning, privateStoresWarning, hideWarning, categoryId, shopsIds, isPrivate,
    storeUniqueId, setProductAndShowProductAvailabilityModal, setProductAndShowReportProductModal,
    deliveryLocationAddress, deliveryLocationCoordinates, productSearchLocationCoordinates,
    productSearchLocation, loadPreviousPage, loadingPreviousPage
}) => {

    const { sendDispatch } = useSyncDispatch();
    const searchInputRef = useRef(null);

    const [dragObjectId, setDragObjectId] = useState(-1);
    const [timeoutId, setTimeoutId] = useState(-1);
    const [searchedTerm, setSearchedTerm] = useState('');

    useEffect(() => {
        document.addEventListener('dragend', onDragEnd, false);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('dragend', onDragEnd);
            document.removeEventListener('scroll', handleScroll);
            document.body.classList.remove('remove-scroll');
            document.body.classList.add('scroll-y-auto');
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            document.body.classList.remove('remove-scroll');
            document.body.classList.add('scroll-y-auto');
        } else {
            document.body.classList.remove('scroll-y-auto');
            document.body.classList.add('remove-scroll');
        }
    }, [loading]);

    const handleScroll = () => {
        if (window.scrollY < 120) {
            loadPreviousPage();
        }
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 700) {
            loadNextPage();
        }
    };

    const onDragStart = (e, product) => {
        const id = product.stores[0].product_details.id;
        setDragObjectId(id);
        sendDispatch(START_DRAGGING_PRODUCT, product);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.parentNode.parentNode);
        const x = e.target.parentNode.parentElement.clientWidth ? e.target.parentNode.parentElement.clientWidth / 2 : 0;
        const y = e.target.parentNode.parentElement.clientHeight ? e.target.parentNode.parentElement.clientHeight / 2 : 0;
        e.dataTransfer.setDragImage(e.target.parentNode.parentNode, x, y);
    };

    const onDragEnd = (e) => {
        sendDispatch(CANCEL_DRAGGING);
        setDragObjectId(-1);
    };

    const clearInput = () => {
        searchInputRef.current.value = '';
        searchProducts(null);
    };

    const searchProducts = e => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const timeout = setTimeout(() => {
            if (timeout !== -1 && searchInputRef.current.value) {
                setSearchedTerm(searchInputRef.current.value);
                loadProductsBySearch(searchInputRef.current.value);
            } else {
                setSearchedTerm('');
                loadProductsBySearch('');
            }
            setTimeoutId(-1);
        }, 500);
        setTimeoutId(timeout);
    };

    const renderProducts = () => {
        const shouldShowSelectedCategory = selectedCategory !== 'All' && products.size === 1;
        return Array.from(products).map(([categoryName, cat]) => (
            <Aux key={cat._id}>
                <div className="product-category h6 px-3 py-2 mb-0 font-weight-bold" id={categoryName}>
                    {shouldShowSelectedCategory ? selectedCategory :
                        categoryName.split('>').map((c, idx) => <Aux key={c}>
                            <span
                                className={`${idx === categoryName.split('>').length - 1 ? 'silver-text' : ''}`}>{c}</span>
                            {idx < categoryName.split('>').length - 1 ?
                                <i className="far fa-chevron-right mx-2" /> : null}
                        </Aux>)}
                </div>
                <div className='flex-grow-1 d-flex flex-wrap px-1 product-list'>
                    {cat?.category && cat.category.map((product, index) => {
                        const id = product.stores[0].product_details.id;
                        return <Product product={product}
                            shopsIds={shopsIds}
                            setProductAndShowProductAvailabilityModal={setProductAndShowProductAvailabilityModal}
                            setProductAndShowReportProductModal={setProductAndShowReportProductModal}
                            storeUniqueId={storeUniqueId}
                            showLocationAlert={showLocationAlert}
                            categoryId={categoryId}
                            deliveryLocationAddress={deliveryLocationAddress}
                            productSearchLocation={productSearchLocation}
                            productSearchLocationCoordinates={productSearchLocationCoordinates}
                            deliveryLocationCoordinates={deliveryLocationCoordinates}
                            isPrivate={isPrivate}
                            canAddToCart={canAddToCart}
                            key={product.stores[0].product_details.id.toString().concat(index)}
                            _id={id}
                            draggedObjectId={dragObjectId}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd} />
                    })}
                </div>
            </Aux>
        ));
    };

    return (
        <div className='p-1 pt-2 products'>
            <div className='d-flex align-items-center justify-content-center mb-2'>
                <span className='mr-2'>Search: </span>
                <div className="input-group position-relative w-75 custom-rounded">
                    <i className="fas fa-search grey position-absolute search-icon" />
                    <input className='form-control form-control pl-5 custom-rounded search-product'
                        onChange={searchProducts} ref={searchInputRef} />
                    {searchedTerm?.length > 0 ? <i className="fal fa-times clear-search-input cursor-pointer"
                        onClick={clearInput} /> : null}
                </div>
            </div>
            {
                showWarning &&
                <div className='delivery-warning mb-2 mx-2'>
                    <span className='delivery-warning-message text-left'>
                        <span className='font-weight-bold mr-2'>Warning!</span>
                        <span>{privateStoresWarning}</span>
                    </span>
                    <span
                        className='fal fa-times close-circle d-flex align-items-center justify-content-center cursor-pointer bg-transparent
                            close-delivery-warning'
                        onClick={hideWarning} />
                </div>
            }
            {loadingPreviousPage ? <div className='next-page-loader'>
                <div className="spinner-border text-dark" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div> : null}
            {(!loading && Array.from(products).length > 0) && <div className='products-list-container'>
                {renderProducts()}
            </div>}
            <div>{Array.from(products).length === 0 && !loading &&
                <div className='d-flex justify-content-center no-products'>
                    <h3 className='text-center text-secondary'>No Products Available!</h3>
                </div>
            }</div>
        </div>

    );
};

export default ProductList;
