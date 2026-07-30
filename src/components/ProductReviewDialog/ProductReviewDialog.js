import React, { useEffect, useState } from 'react';
import './ProductReviewDialog.scss';
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import Aux from "../../utils/auxilary";
import moment from "moment";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { useSelector } from "react-redux";

const ProductReviewDialog = ({ show, clickBackdrop, showSuccessMessage, product, order, isEdit }) => {
    const { sendRequest, isLoading } = useHttp();
    const apiEndpoints = new ApiEndpoints();

    const [rating, setRating] = useState(1);
    const [titles, setTitles] = useState([]);
    const [message, setMessage] = useState('');

    const productReviewTitles = useSelector(state => state.ordersHistoryReducer.productReviewTitles);

    useEffect(() => {
        if (show) {
            if (productReviewTitles?.product?.rating && isEdit) {
                setRating(productReviewTitles.product.rating);
            } else {
                setRating(1);
            }
            ;
            if (productReviewTitles?.product?.review && isEdit) {
                setMessage(productReviewTitles.product.review.message);
                setTitles(productReviewTitles.product.review.title);
                setTitles(productReviewTitles.product.review.title);
            } else {
                setMessage('');
                setTitles([]);
            }
        }
    }, [productReviewTitles, show]);

    const onSubmit = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .ordersHistory
                .reviewProduct(order.category_id, order._id, product.id, rating, titles, message);
        sendRequest(url, method, body, success, error, response => {
            if (response.success) {
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
        <ModalWrapper show={show} clickBackdrop={clickBackdrop} showFirst={true}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title w-100 ml-4" id="exampleModalLabel">
                            Product Review
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        <Aux>
                            <div className='d-flex flex-column w-100 border-bottom-silver'>
                                <div className='d-flex mb-2 order-status-color'>
                                    <span className='width-150px mr-4 text-right'>Product name:</span>
                                    <span>{product?.product_name}</span>
                                </div>
                                <div className='d-flex mb-2 cod-delivery-date'>
                                    <span className='width-150px mr-4 text-right'>Delivery date:</span>
                                    <span>{moment(product?.deliveredDate?.toString()).format('DD/MM/YYYY - hh:mm A')}</span>
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
                            <div className='w-100 d-flex mt-2'>
                                <textarea rows="4" className='w-100' value={message}
                                    onChange={e => setMessage(e.target.value)} />
                            </div>
                        </Aux>
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                        <button type="button" className="btn btn-primary send-to-merchant-btn"
                            onClick={onSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            {isLoading ? <RequestSpinner /> : null}
        </ModalWrapper>
    );
};

export default ProductReviewDialog;
