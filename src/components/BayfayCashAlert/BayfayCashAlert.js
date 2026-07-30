import React from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";

const BayfayCashAlert = ({show, clickBackdrop, onConfirm, mode}) => {
    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog min-width-400px" role="document">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h5 className="modal-title text-center flex-grow-1">BayFay</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-400px py-0">
                        <div className='mx-2 border p-2'>
                            {title[mode]}
                        </div>
                    </div>
                    <div
                        className={`modal-footer d-flex border-0 mx-2 ${mode === 2 || mode === 1 ? 'justify-content-between' : 'justify-content-center'}`}>
                        {mode === 2 || mode === 1 ? <button type="button"
                                                            className='btn btn-light width-150px border'
                                                            onClick={clickBackdrop}>
                            Cancel
                        </button> : null}
                        <button type="button"
                                className={`btn btn-light width-150px border ${mode === 2 ? 'text-danger' : ''}`}
                                data-dismiss="modal"
                                onClick={onConfirm}>
                            {mode === 1 ? 'Place Order' : 'Ok'}
                        </button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

const title = {
    1: 'Do you want to continue with BayFay cash to place order?',
    2: 'Do you want to continue with BayFay cash to place order?',
    3: 'Promo code is not applicable for COD order!',
    4: 'Promo code is not applicable if you want to pay only with BayFay cash!'
};

export default BayfayCashAlert;
