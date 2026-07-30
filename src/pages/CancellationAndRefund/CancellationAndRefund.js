import React, { useEffect } from 'react';
import Aux from "../../utils/auxilary";
import CustomHeader from "../../components/CustomHeader/CustomHeader";

const CancellationAndRefund = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <Aux>
            <CustomHeader title={'Cancellation & Refund'} />
            <div className='d-flex justify-content-center static-page-bg'>
                <div className='max-width-1000px w-100 font-size-3-lg py-2 d-flex flex-column'>
                    <div className='font-size-1-4rem font-weight-bold py-2'>Customer Cancellation:</div>
                    <p className='mb-0'>
                        <ol>
                            <li>You can cancel your order before it is accepted by the Shop.</li>
                            <li>Once the order is accepted, you can cancel it by contacting the BayFay Support team, and
                                charges may apply based upon the product category for such cancellations.
                            </li>
                            <li>BayFay have the right to cancel your orders in case of below circumstances
                                <ul>
                                    <li>Wrong delivery address</li>
                                    <li>If the delivery person couldn't reach you by phone or email at the time of
                                        delivery.
                                    </li>
                                    <li>Unavailability of proper information or direction for the delivery location from
                                        you.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                In case of COD orders, if the order has been canceled after acceptance any cancellation
                                charges will be deducted from the subsequent orders.
                            </li>
                        </ol>
                    </p>
                    <div className='font-size-1-4rem font-weight-bold py-2'>Refund:</div>
                    <p>
                        <ol>
                            <li>BayFay has the right to charge the total order value or any percentage of the order
                                value in case of cancellation after order acceptance or other factors attributable to
                                you.
                            </li>
                            <li>If the cancellation is by factors attributable to Shop or delivery person, then you will
                                not be charged any cancellation Fee. i.e. unavailability of ordered items or
                                unavailability of delivery after receiving the order and a 100% refund shall be
                                provided.
                            </li>
                            <li>Your entitled refund, post-cancellation fee will be credited to the source or BayFay
                                Cash according to your preference and the timeline for the amount to be reflected in
                                your Bank Account are detailed below;
                            </li>
                        </ol>
                    </p>
                    <div className='w-80 align-self-center'>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Payment Method</th>
                                    <th scope="col">Refund Source</th>
                                    <th scope="col">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>BFCash</td>
                                    <td>Source</td>
                                    <td>Immediate</td>
                                </tr>
                                <tr>
                                    <td>Debit/Credit Cards</td>
                                    <td>Source</td>
                                    <td>4-7 Business Days</td>
                                </tr>
                                <tr>
                                    <td>Net Banking</td>
                                    <td>Source</td>
                                    <td>5-7 Business Days</td>
                                </tr>
                                <tr>
                                    <td>UPI</td>
                                    <td>Source</td>
                                    <td>5 Business Days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default CancellationAndRefund;
