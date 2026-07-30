import React, { useEffect } from 'react';
import './Help.scss';
import Aux from "../../utils/auxilary";
import CustomHeader from "../../components/CustomHeader/CustomHeader";

const Help = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <Aux>
            <CustomHeader title={'HELP'} />
            <div className='d-flex justify-content-center static-page-bg'>
                <div className='max-width-1000px w-100 font-size-3 py-2'>
                    <h2 className='help-title'>Help</h2>
                    <div className='help-description'>Here are the solutions for the general queries!</div>
                    <div className='help-container'>
                        <div className="tabAccorion">
                            <div className="accordion" id="accordionExample">
                                <div className="faq-head mt-2">
                                    <h2 className="color-white">Customer</h2>
                                </div>


                                <div className="card">
                                    <div className="card-header" id="heading24">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse24"
                                            aria-expanded="false">
                                            How to make reorder?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse24" className="collapse" aria-labelledby="heading24"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>To make reorder go to Purchase History.</p></li>
                                                <li><p>Find the order and go to order details screen.</p></li>
                                                <li><p>Now you can proceed for the reorder by tapping ‘Reorder’
                                                    button.</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading25">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse25"
                                            aria-expanded="false">
                                            How to check daily Rewards?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse25" className="collapse" aria-labelledby="heading25"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to the home screen.</p></li>
                                                <li><p>Click on reward button at the top of the screen.</p></li>
                                                <li><p>Scratch the card and check your reward.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading26">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse26"
                                            aria-expanded="false">
                                            How to make order?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse26" className="collapse" aria-labelledby="heading26"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li>Visit BayFay ‘Home page’ via sign in. Purchase can be made on
                                                    Public/Private/Branded shops.
                                                </li>
                                                <li>Click and enter into the shop of your choice. Public shop will list
                                                    out
                                                    a wide range of Products by compiling all the shops in the
                                                    competitive
                                                    market . You can surf through all the listed products or choose
                                                    “categories”in Menu for a specific products.
                                                </li>
                                                <li>You can also narrow down your search through search bar tab.</li>
                                                <li>In order to buy specific product from your nearby shop or any other
                                                    shop
                                                    of your preference, enter into Private shop.
                                                </li>
                                                <li>Branded products can be purchased through Branded shop.</li>
                                                <li>Give a Long press and drag the Products you wish to buy to the cart
                                                    (or)
                                                    select the Product, specify the quantity and click Add to cart.
                                                </li>
                                                <li>Complete adding products to the cart, verify your placed orders. If
                                                    you
                                                    would like to purchase certain product later add it to Saved for
                                                    Later
                                                    by removing the tick mark.
                                                </li>
                                                <li>Choose Delivery method Self delivery collection or Delivery by Shop.
                                                </li>
                                                <li>Then click Proceed to checkout.</li>
                                                <li>Finalize it by verifying the Delivery address (selecting preferred
                                                    delivery Date &amp; Time is optional) followed by Payment.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading27">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse27"
                                            aria-expanded="false">
                                            How To Track Order?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse27" className="collapse" aria-labelledby="heading27"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li>Depending upon the timing and proximity of the shop ordered items
                                                    can be
                                                    delivered as much early as possible.
                                                </li>
                                                <li>Once the order is placed SMS, email and push notifications will be
                                                    sent
                                                    to the concerned customer.
                                                </li>
                                                <li>Click On Menu then Track Order, where the status of your order will
                                                    be
                                                    shown in 5 different phases Ordered, Accepted, Ready to Ship,
                                                    Shipping
                                                    and Delivered. Respective phases will indicate the concerned status
                                                    of
                                                    delivery process.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading28">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse28"
                                            aria-expanded="false">
                                            How To Return/Replace Product?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse28" className="collapse" aria-labelledby="heading28"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li>Go to Menu then Track Orders and select Order. If a Product is not
                                                    delivered mark Undelivered and if the Product is
                                                    defective/damaged/dissatisfied mark Replacement.
                                                </li>
                                                <li>Defective/Dissatisfied Product image can also be uploaded through
                                                    Replacement tab.
                                                </li>
                                                <li>You can raise the Replacement request through Purchase History if
                                                    the
                                                    order moved to Purchase history.
                                                </li>
                                                <li>As soon as you fill out the return tab, you will receive an
                                                    email/SMS/push notification.
                                                </li>
                                                <li>Return /Replacement request should be raised within 5-6 days from
                                                    the
                                                    date of delivery.
                                                </li>
                                                <li>Replacement product will be inspected and verified whether it falls
                                                    under eligible criteria. If it is approved and cleared .Your order
                                                    will
                                                    be replaced with the same new identical product.
                                                </li>
                                                <li>Maintain the invoice of purchase for return and replacement of
                                                    product.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading29">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse29"
                                            aria-expanded="false">
                                            How To Add New Payment Method?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse29" className="collapse" aria-labelledby="heading29"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li>Click on Profile Menu and select 'Payments'.
                                                </li>
                                                <li>There you can find the options to save your Card Details and UPI id.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading30">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse30"
                                            aria-expanded="false">
                                            How To Cancel Order?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse30" className="collapse" aria-labelledby="heading30"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li>Go to Track Order and click on Order then Cancel Order.</li>
                                                <li>You can cancel your order only before it reaches Shipping phase in
                                                    Track
                                                    Order
                                                </li>
                                                <li>Your order will be cancelled by us ,when your designated address
                                                    falls
                                                    out of our delivery zone or unable to reach your registered phone
                                                    number
                                                    during the process of delivery.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading31">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse31"
                                            aria-expanded="false">
                                            Shipping &amp; Delivery<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse31" className="collapse" aria-labelledby="heading31"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li>Delivering the Products from your preferred neighborhood Private
                                                    shops
                                                    will be as much early as possible based upon the shops timing slots
                                                    and
                                                    proximity.
                                                </li>
                                                <li>You can also choose the Date &amp; Time of your convenience.</li>
                                                <li>Kindly verify the products immediately after delivery, reach our
                                                    Help
                                                    desk for further more assistance.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading32">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse32"
                                            aria-expanded="false">
                                            Return/Refund Policy<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse32" className="collapse" aria-labelledby="heading32"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul className="mail-ol">
                                                <li>You may return a Purchased Product in the following condition:
                                                    <ol>
                                                        <li>Defective/Damaged.</li>
                                                        <li>Missing accessories (or) parts.</li>
                                                        <li>Poor quality.</li>
                                                    </ol>
                                                </li>
                                                <li>The product should be of same condition as they were when delivered.
                                                    Pick-up personnel will inspect the product regarding its eligibility
                                                    to
                                                    return.
                                                </li>
                                                <li>Maintain the invoice of purchase, freebies, price tag of the
                                                    product.
                                                </li>
                                                <li>We reserve the sole right to cancel your order and the amount will
                                                    be
                                                    refunded, if the designated address falls out of our delivery zone
                                                    or
                                                    unable to reach your registered phone number during the process of
                                                    delivery.
                                                </li>
                                                <li>Refund request can be raised with in 5-6 days from the date of
                                                    delivery.
                                                </li>
                                                <li>Refund can be initiated either through Help Desk or you can request
                                                    through the Replacement column in Track Order or Purchase History.
                                                </li>
                                                <li>Our verification team will verify the cause and nature of product to
                                                    be
                                                    returned. When it is approved for refund , you will receive a SMS to
                                                    your registered mobile number. Your money will be refunded within
                                                    2-3
                                                    days.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default Help;
