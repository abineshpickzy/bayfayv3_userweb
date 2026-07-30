import React, { useEffect, useState } from 'react';
import './StoreReviewDialog.scss';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import moment from "moment";
import { useSelector } from "react-redux";
import Aux from "../../utils/auxilary";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import { Utils } from "../../utils/Utils";

const StoreReviewDialog = ({ show, clickBackdrop, orderId, removeOrderFromList, showSuccessMessage, isPurchaseHistory, isEdit }) => {
    const { sendRequest, isLoading } = useHttp();
    const apiEndpoints = new ApiEndpoints();

    const [rating, setRating] = useState(1);
    const [titles, setTitles] = useState([]);
    const [message, setMessage] = useState('');

    const shopReviewTitles = useSelector(state => state.trackOrderReducer.shopReviewTitles);

    useEffect(() => {
        if (show) {
            if (shopReviewTitles?.order?.rating && isEdit) {
                setRating(shopReviewTitles.order.rating);
            } else {
                setRating(1);
            };
            if (shopReviewTitles?.order?.review && isEdit) {
                setMessage(shopReviewTitles.order.review.message);
                setTitles(shopReviewTitles.order.review.title);
                setTitles(shopReviewTitles.order.review.title);
            } else {
                setMessage('');
                setTitles([]);
            }
        }
    }, [shopReviewTitles, show]);

    const sendToMerchant = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .order
                .reviewShop(orderId, rating, titles, message, isPurchaseHistory);
        sendRequest(url, method, body, success, error, response => {
            if (response.success) {
                removeOrderFromList && removeOrderFromList();
                showSuccessMessage && showSuccessMessage(response.message);
                clickBackdrop();
            }
        });
    };

    const updateTitles = title => {
        setTitles(prevState => ([...prevState, title]));
    };

    const updateRating = rating => {
        setRating(rating);
    };

    return (
        <ModalWrapper show={show} clickBackdrop={() => {
            removeOrderFromList && removeOrderFromList();
            clickBackdrop();
        }} showFirst={true}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title w-100 ml-4" id="exampleModalLabel">
                            Store Feedback
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        {shopReviewTitles ? <Aux>
                            <div className='d-flex flex-column w-100 border-bottom-silver'>
                                <div className='d-flex mb-2 order-status-color'>
                                    <span className='width-150px mr-4 text-right'>Store name</span>
                                    <span>{shopReviewTitles?.shop}</span>
                                </div>
                                <div className='d-flex mb-2 cod-delivery-date'>
                                    <span className='width-150px mr-4 text-right'>Delivery date</span>
                                    <span>{moment(shopReviewTitles?.order?.delivered_at?.toString()).format('DD/MM/YYYY - hh:mm A')}</span>
                                </div>
                            </div>
                            <div>
                                <div
                                    className='p-3 d-flex justify-content-center align-items-center store-rating-stars'>
                                    {Array.from(Array(Math.floor(rating)).keys()).map(counter => (
                                        <i className="fas fa-star mx-3 yellow-star font-size-25 rating-1" key={counter}
                                            onClick={() => {
                                                setTitles([]);
                                                updateRating(counter + 1);
                                            }} />
                                    ))}
                                    {Array.from(Array(5 - Math.floor(rating)).keys()).map(counter => (
                                        <i className="far fa-star mx-3 yellow-star font-size-25 rating-2" key={counter}
                                            onClick={() => {
                                                setTitles([]);
                                                updateRating(counter + rating + 1);
                                            }} />
                                    ))}
                                </div>
                            </div>
                            <div className='d-flex flex-wrap pt-2 px-3'>
                                {shopReviewTitles?.titles.find(t => t.rating === rating).titles.map(a => (
                                    <div className="custom-control custom-checkbox w-50 d-flex mb-2" key={a}>
                                        <input type="checkbox" className="custom-control-input" id={a}
                                            checked={titles.includes(a)}
                                            onChange={() => updateTitles(a)} />
                                        <label className="custom-control-label" htmlFor={a}>
                                            {Utils.snakeCaseToUpperCase(a)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className='w-100 d-flex mt-2'>
                                <textarea rows="4" className='w-100' value={message}
                                    onChange={e => setMessage(e.target.value)} />
                            </div>
                        </Aux> :
                            <div className='height-300px d-flex justify-content-center align-items-center'>
                                <RequestSpinner />
                            </div>}
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                        <button type="button" className="btn btn-primary send-to-merchant-btn"
                            onClick={sendToMerchant}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            {isLoading ? <RequestSpinner /> : null}
        </ModalWrapper>
    );
};

export default StoreReviewDialog;
