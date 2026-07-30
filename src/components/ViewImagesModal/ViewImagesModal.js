import React from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import Loader from "../Loader/Loader";
import './ViewImagesModal.scss';

const ViewImagesModal = ({imagesLoading, show, clickBackdrop, imageBase64, onNext, onPrev}) => {

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop} showFirst={true}>
            <div className="modal-dialog images-viewer" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close close-custom" data-dismiss="modal" aria-label="Close"
                                onClick={clickBackdrop}>
                            <span aria-hidden="true" className='custom-border'>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='full-image-container d-flex flex-row align-items-center justify-content-between px-4'>
                            <i className="fal fa-chevron-left image-viewer-nav-btn cursor-pointer"
                               onClick={onPrev}/>
                            <img src={imageBase64} alt="image" className='image-lg'/>
                            <i className="fal fa-chevron-right font-size-lg image-viewer-nav-btn cursor-pointer"
                               onClick={onNext}/>
                        </div>
                    </div>
                </div>
            </div>
            {imagesLoading && <Loader/>}
        </ModalWrapper>
    );
};

export default ViewImagesModal;
