import React from 'react';
import './CODPaymentDialog.scss';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import moment from "moment";

const CodPaymentDialog = ({show, clickBackdrop, order}) => {

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop} showFirst={true}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title w-100 ml-4" id="exampleModalLabel">
                            Make payment
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500">
                        <div className='d-flex flex-column w-100 border-bottom-silver'>
                            <div className='d-flex mb-2 order-status-color'>
                                <span className='width-150px mr-4 text-right'>Store name:</span>
                                <span>{order?.shop.display_name}</span>
                            </div>
                            <div className='d-flex mb-2 cod-delivery-date'>
                                <span className='width-150px mr-4 text-right'>Delivery date:</span>
                                <span>{moment(order?.delivered?.at.toString()).format('DD/MM/YYYY - hh:mm A')}</span>
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-center py-4 cod-make-payment'>
                            <span className='mb-4'>Kindly make payment of</span>
                            <span className='cod-net-price'>₹ {order?.amount?.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                        <button type="button" className="btn btn-light cod-done-btn" onClick={clickBackdrop}>
                            Done
                        </button>
                        <button type="button" className="btn btn-primary cod-already-paid-btn" onClick={clickBackdrop}>
                            Already Paid
                        </button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CodPaymentDialog;
