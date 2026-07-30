import React from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import Auxiliary from "../../utils/auxilary";

const AlertDialog = ({ isLoading, show, clickBackdrop, hideRejectButton, title, message, onConfirm, onReject, hideHeader,
    confirmButtonText, rejectButtonText, revertButtons }) => {

    const onRejectClicked = () => {
        onReject ? onReject() : clickBackdrop();
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    {!hideHeader && <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>}
                    <div className="modal-body w-500px">
                        <div className='text-secondary p-1'>
                            {message}
                        </div>
                    </div>
                    <div className="modal-footer">
                        {revertButtons ?
                            <Auxiliary>
                                <button type="button" className="btn btn-primary" onClick={onConfirm}>
                                    {confirmButtonText ? confirmButtonText : 'OK'}
                                </button>
                                {hideRejectButton ? null :
                                    <button type="button" className="btn btn-light" data-dismiss="modal"
                                        onClick={onRejectClicked}>
                                        {rejectButtonText ? rejectButtonText : 'Cancel'}
                                    </button>}
                            </Auxiliary> :
                            <Auxiliary>
                                {hideRejectButton ? null :
                                    <button type="button" className="btn btn-light" data-dismiss="modal"
                                        onClick={onRejectClicked}>
                                        {rejectButtonText ? rejectButtonText : 'Cancel'}
                                    </button>}
                                <button type="button" className="btn btn-primary" onClick={onConfirm}>
                                    {confirmButtonText ? confirmButtonText : 'OK'}
                                </button>
                            </Auxiliary>}
                    </div>
                </div>
            </div>
            {isLoading && <RequestSpinner />}
        </ModalWrapper>
    );
};

export default AlertDialog;
