import React from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import './ProductAvailabilityModal.scss';
import Aux from "../../utils/auxilary";

const ProductAvailabilityModal = ({ productId, show, clickBackdrop, cartItems }) => {

    const renderStores = () => {
        if (cartItems.get(productId)) {
            const cartItem = cartItems.get(productId);
            return cartItem.item.stores.map((store, index) =>
                <Aux key={store.store_id}>
                    <div className='d-flex flex-row'>
                        <div className='w-30 d-flex flex-column align-items-end pr-2'>
                            <span className='font-weight-bold'>Seller Name:</span>
                            <span className='font-weight-bold'>Price:</span>
                            <span className='font-weight-bold'>Qty:</span>
                            {(store.product_details.offer && store.product_details.offer > 0) ?
                                <span className='font-weight-bold'>Offer:</span> : null
                            }
                        </div>
                        <div className='w-45 d-flex flex-column align-items-start pl-1'>
                            <span>Store {index + 1}</span>
                            <span>
                                {
                                    (store.product_details.offer && store.product_details.offer > 0) ?
                                        <s>₹ {(store.product_details.qty * store.product_details.selling_price).toFixed(2)}</s> :
                                        <span>₹ {(store.product_details.qty * store.product_details.selling_price).toFixed(2)}</span>
                                }
                            </span>
                            <span>{store.product_details.qty}</span>
                            {(store.product_details.offer && store.product_details.offer > 0) ?
                                <span className='offer'>{store.product_details.offer.toFixed(1)}%</span> : null
                            }
                        </div>
                        <div className='w-25 d-flex align-items-center'>
                            {store.product_details.offer && (store.product_details.offer > 0) ?
                                <h5>₹ {(store.product_details.qty * store.product_details.offer_selling_price).toFixed(2)}</h5> : null
                            }
                        </div>
                    </div>
                    {(index < cartItem.item.stores.length - 1) &&
                        <div className='divider my-2' />
                    }
                </Aux>
            )
        }

        return null;
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Product Availability</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        <div className='p-1 text-black'>
                            {renderStores()}
                        </div>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ProductAvailabilityModal;
