import React, {useEffect, useState} from 'react';
import './ReportProductModal.scss';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";

const ReportProductModal = ({show, clickBackdrop, product, categoryId}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();

    const [reportTypes, setReportTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [additionalMessage, setAdditionalMessage] = useState('');

    useEffect(() => {
        if (show) {
            setAdditionalMessage('');
            fetchReportTypes();
        }
    }, [show]);

    useEffect(() => {
        setAdditionalMessage('');
    }, [selectedType]);

    const fetchReportTypes = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .products
                .fetchProductReportTypes();
        sendRequest(url, method, body, success, error, response => {
            if (response?.data?.type?.length > 0) {
                setReportTypes(response.data.type);
            }
        });
    };

    const reportProduct = () => {
        const productId = product.stores[0].product_details.id;
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .products
                .reportProduct(categoryId, productId, selectedType, additionalMessage);
        sendRequest(url, method, body, success, error, _s => {
            clickBackdrop();
        });
    };

    const renderReportTypes = () => {
        return reportTypes.length === 0 ? <div className='w-100 h-100px'/> :
            reportTypes.map(type => (
                <div className="form-check w-100 mb-2 d-flex" key={type}>
                    <input className="form-check-input cursor-pointer" type="radio" name="gridRadios" id={type}
                           checked={selectedType === type} onChange={() => setSelectedType(type)}/>
                    <label className="form-check-label ml-2 cursor-pointer" htmlFor={type}
                           onClick={() => setSelectedType(type)}>
                        {type}
                    </label>
                </div>
            ))
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Report- {product?.productInfo?.product_name}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        <div className='p-1'>
                            {renderReportTypes()}
                            <textarea rows="5"
                                      className={`w-100 mt-2 additional-message`}
                                      value={additionalMessage}
                                      onChange={e => setAdditionalMessage(e.target.value)}/>
                        </div>
                    </div>
                    <div className="modal-footer">

                        <button type="button" className="btn btn-light" data-dismiss="modal"
                                onClick={clickBackdrop}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={reportProduct}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            {isLoading && <RequestSpinner/>}
        </ModalWrapper>
    );
};

export default ReportProductModal;
