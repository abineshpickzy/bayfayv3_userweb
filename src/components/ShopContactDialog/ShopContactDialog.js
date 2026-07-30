import React from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import './ShopContactDialog.scss';

const ShopContactDialog = ({show, content, clickBackdrop}) => {
    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop} showFirst={true}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Shop Contact
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='dialog-content' dangerouslySetInnerHTML={{__html: content}}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={clickBackdrop}>OK</button>
                    </div>
                </div>a
            </div>
        </ModalWrapper>
    );
};

export default ShopContactDialog;
