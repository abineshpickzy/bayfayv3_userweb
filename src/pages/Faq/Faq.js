import React, { useEffect, useState } from 'react';
import './Faq.scss';
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import Aux from "../../utils/auxilary";

const Faq = () => {

    const [selectedNav, setSelectedNav] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <Aux>
            <CustomHeader title={'FAQ'} />
            <div className='d-flex justify-content-center static-page-bg'>
                <div className='max-width-1000px w-100 font-size-3 py-2 faq-container'>
                    <div className="row d-flex align-items-start">
                        <div className="col-4 faq-container-left">
                            <div className='faq-nav'>
                                <div className={`faq-nav-item ${selectedNav === 1 ? 'faq-nav-active' : ''}`}
                                    onClick={() => setSelectedNav(1)}>
                                    Customer / Bayer
                                </div>
                                <div className={`faq-nav-item ${selectedNav === 2 ? 'faq-nav-active' : ''}`}
                                    onClick={() => setSelectedNav(2)}>
                                    Merchant / Seller
                                </div>
                            </div>
                            <img src={require('../../assets/images/Faq.png')} alt="faq" className='faq-image' />
                        </div>
                        <div className="col-8 faq-container-right">
                            {selectedNav === 1 ?
                                <div className="tab-content" id="v-pills-tabContent">
                                    <div className="tab-pane fade active show" id="v-pills-home" role="tabpanel"
                                        aria-labelledby="v-pills-home-tab">
                                        <h3 className="mb-4 mt-3">Customer / Buyer</h3>
                                        <div className="tabAccorion">
                                            <div className="accordion" id="accordionExample">
                                                <div className="card">
                                                    <div className="card-header" id="headingOne">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapseOne">
                                                            How can I create an account in BayFay Customer app?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseOne" className="collapse"
                                                        aria-labelledby="headingOne" data-parent="#accordionExample">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Please visit <a href="#">www.bayfay.com/app</a> and
                                                                    follow the steps to Signup.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="headingTwo">
                                                        <h5 className="mb-0 collapsed" data-toggle="collapse"
                                                            data-target="#collapseTwo" aria-expanded="false">
                                                            How can I place an order?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseTwo" className="collapse"
                                                        aria-labelledby="headingTwo" data-parent="#accordionExample"
                                                    >
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Visit your nearby shop (Public Shop/Private Shop) or
                                                                    Other location shops of your preferred category. Add
                                                                    the product to the cart which you wish to buy and
                                                                    proceed for the payment.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="headingThree">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapseThree">
                                                            How can I track my order?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseThree" className="collapse"
                                                        aria-labelledby="headingThree" data-parent="#accordionExample">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Customers can track each stage of the order in the
                                                                    app.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="headingFour">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapseFour">
                                                            My Favourite shop is not listed in your app?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseFour" className="collapse"
                                                        aria-labelledby="headingFour" data-parent="#accordionExample">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>On such occasions, you can invite your Favourite
                                                                    shop on the successful onboard. We will reward
                                                                    BayFay points.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="headingFive">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapseFive">
                                                            Why does the price in the product screen vary from the cart?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseFive" className="collapse"
                                                        aria-labelledby="headingFive" data-parent="#accordionExample">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Different sellers provide the same product at
                                                                    different prices. If you choose multiple quantities
                                                                    of the same product, there are possibilities for
                                                                    multiple sellers to fulfill the order. So, the
                                                                    prices of a certain quantity of the same product may
                                                                    vary.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="headingSix">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapseSix">
                                                            What should I do if the product is damaged in delivery?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseSix" className="collapse"
                                                        aria-labelledby="headingSix" data-parent="#accordionExample">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Our Merchant has carefully packed the product for
                                                                    delivery. However, we do realize that delivery
                                                                    damage may occur in spite of these precautions. If
                                                                    any damage occurs please mark the product status as
                                                                    “Replacement” with the reason.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="headingSeven">
                                                        <h5 className="mb-0 collapsed" data-toggle="collapse"
                                                            data-target="#collapseSeven" aria-expanded="false">
                                                            Can I place an order online and pick it up in a Retail
                                                            Store, rather than having it delivered to the desired
                                                            location?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseSeven" className="collapse"
                                                        aria-labelledby="headingSeven" data-parent="#accordionExample"
                                                    >
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Yes, you can. In the Cart screen, select the
                                                                    delivery mode as “Self-Pickup”. There will be no
                                                                    delivery charges for the Self-Pickup option.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="headingEight">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapseEight">
                                                            Is BayFay Accountable for the quality/quantity of the
                                                            products delivered?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapseEight" className="collapse"
                                                        aria-labelledby="headingEight" data-parent="#accordionExample">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>No, Shops are responsible for the quality/quantity
                                                                    of any product being sold through BayFay. In such
                                                                    cases, you can send Feedback/Message to us which we
                                                                    will convey to the Merchants.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="v-pills-profile" role="tabpanel"
                                        aria-labelledby="v-pills-profile-tab">
                                        <h3 className="mb-4 mt-3">Merchant / Seller</h3>
                                        <div className="tabAccorion">
                                            <div className="accordion" id="accordionExample2">
                                                <div className="card">
                                                    <div className="card-header" id="heading-1">
                                                        <h5 className="mb-0 collapsed" data-toggle="collapse"
                                                            data-target="#collapse-1" aria-expanded="false">
                                                            Who can sell on BayFay?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-1" className="collapse"
                                                        aria-labelledby="heading-1" data-parent="#accordionExample2"
                                                    >
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>BayFay is a Business-to-Consumer shopping platform.
                                                                    If you are a Manufacturer, a Brand Owner, a
                                                                    Retailer/Reseller, a Distributor you can sell your
                                                                    product on BayFay.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-2">
                                                        <h5 className="mb-0 collapsed" data-toggle="collapse"
                                                            data-target="#collapse-2" aria-expanded="false">
                                                            How can I Sign up/Register my Virtual Shop in BayFay Seller
                                                            App?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-2" className="collapse"
                                                        aria-labelledby="heading-2" data-parent="#accordionExample2"
                                                    >
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Please visit <a
                                                                    href="#">www.bayfay.com/mapp/</a> and follow the
                                                                    steps to sign up.Once your shop verification process
                                                                    is completed, then only you can start selling
                                                                    through your online store on BayFay.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-3">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-3">
                                                            What do you mean by Online Virtual Store on BayFay?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-3" className="collapse"
                                                        aria-labelledby="heading-3" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>It’s a great opportunity for Store Owners to extend
                                                                    their Business through BayFay by creating an online
                                                                    Virtual Shop for your Physical Retail Shop. It
                                                                    allows you to manage your Business with ease.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-4">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-4">
                                                            How can I manage my Online Virtual Store at BayFay?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-4" className="collapse"
                                                        aria-labelledby="heading-4" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>You will have complete access to your online virtual
                                                                    store in the app. You can manage Inventory, Orders,
                                                                    Offers, Promo Code, User, Roles, Customers, Bank
                                                                    Account Details, Subscription and many other
                                                                    benefits.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="card">
                                                    <div className="card-header" id="heading-5">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-5">
                                                            How can I upload/add my products?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-5" className="collapse"
                                                        aria-labelledby="heading-5" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>You can update/add products in 4 simple way:
                                                                    <ol>
                                                                        <li>Bulk Upload(.csv File)</li>
                                                                        <li>By Scan Product Barcode.</li>
                                                                        <li>By Search Product Name.</li>
                                                                        <li>Add New Product.</li>
                                                                    </ol>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-6">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-6">
                                                            What payment options BayFay offers?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-6" className="collapse"
                                                        aria-labelledby="heading-6" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>BayFay offers all the popular online payment options
                                                                    such as:
                                                                    <ol>
                                                                        <li>Credit Card.</li>
                                                                        <li>Debit Card.</li>
                                                                        <li>Cash On Delivery(COD).</li>
                                                                        <li>Net Banking.</li>
                                                                        <li>UPI Payment.</li>
                                                                    </ol>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-7">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-7">
                                                            How will Merchant receive Payment from BayFay?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-7" className="collapse"
                                                        aria-labelledby="heading-7" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Merchant can request for payment using manual
                                                                    options or auto schedule (Request will generate
                                                                    automatically based upon scheduled plan). Once
                                                                    BayFay approves Payment requests the Amount will be
                                                                    credited to the Merchant Bank account within 2 - 3
                                                                    business days.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-8">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-8">
                                                            How does Merchant Rating impact?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-8" className="collapse"
                                                        aria-labelledby="heading-8" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Average rating will appear for the Private Shop on
                                                                    BayFay Customer Application.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="card">
                                                    <div className="card-header" id="heading-9">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-9">
                                                            How do I avoid getting a Lower Rating from Buyers/Customers?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-9" className="collapse"
                                                        aria-labelledby="heading-9" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Assure that you always provide the best quality
                                                                    products to buyers/customers.Communicate with your
                                                                    customer as soon as you receive a Complaint.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-10">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-10">
                                                            How will BayFay Customer service help?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-10" className="collapse"
                                                        aria-labelledby="heading-10" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>BayFay Customer Service Team will help to guide both
                                                                    Customer and Merchant for the Best service and will
                                                                    help to use new Technologies introduced in the App.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-11">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-11">
                                                            Is there an opportunity to promote Virtual Shops?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-11" className="collapse"
                                                        aria-labelledby="heading-11" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Yes, Merchant can promote his/her Virtual Shop
                                                                    through SMS/Notification/Email/Banner/Scratch Card.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card">
                                                    <div className="card-header" id="heading-12">
                                                        <h5 className="mb-0" data-toggle="collapse"
                                                            data-target="#collapse-12">
                                                            BayFay providers any Technology for Physical Shops?
                                                            <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                        </h5>
                                                    </div>
                                                    <div id="collapse-12" className="collapse"
                                                        aria-labelledby="heading-12" data-parent="#accordionExample2">
                                                        <div className="card-body">
                                                            <ul>
                                                                <li>Yes, BayFay gives ERP/POS free for their Merchants
                                                                    who have their Rental Virtual Shop in BayFay, where
                                                                    they can easily connect their Physical Shop with
                                                                    their Virtual Shop.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                <div className="tab-pane fade active show" id="v-pills-profile" role="tabpanel"
                                    aria-labelledby="v-pills-profile-tab">
                                    <h3 className="mb-4 mt-3">Merchant / Seller</h3>
                                    <div className="tabAccorion">
                                        <div className="accordion" id="accordionExample2">
                                            <div className="card">
                                                <div className="card-header" id="heading-1">
                                                    <h5 className="mb-0 collapsed" data-toggle="collapse"
                                                        data-target="#collapse-1" aria-expanded="false">
                                                        Who can sell on BayFay?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-1" className="collapse" aria-labelledby="heading-1"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>BayFay is a Business-to-Consumer shopping platform. If
                                                                you
                                                                are a Manufacturer, a Brand Owner, a Retailer/Reseller,
                                                                a
                                                                Distributor you can sell your product on BayFay.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header" id="heading-2">
                                                    <h5 className="mb-0 collapsed" data-toggle="collapse"
                                                        data-target="#collapse-2" aria-expanded="false">
                                                        How can I Sign up/Register my Virtual Shop in BayFay Seller App?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-2" className="collapse" aria-labelledby="heading-2"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>Please visit <a href="#">www.bayfay.com/mapp/</a> and
                                                                follow
                                                                the steps to sign up.Once your shop verification process
                                                                is
                                                                completed, then only you can start selling through your
                                                                online store on BayFay.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="heading-3">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-3">
                                                        What do you mean by Online Virtual Store on BayFay?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-3" className="collapse" aria-labelledby="heading-3"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>It’s a great opportunity for Store Owners to extend
                                                                their
                                                                Business through BayFay by creating an online Virtual
                                                                Shop
                                                                for your Physical Retail Shop. It allows you to manage
                                                                your
                                                                Business with ease.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="heading-4">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-4">
                                                        How can I manage my Online Virtual Store at BayFay?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-4" className="collapse" aria-labelledby="heading-4"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>You will have complete access to your online virtual
                                                                store
                                                                in the app. You can manage Inventory, Orders, Offers,
                                                                Promo
                                                                Code, User, Roles, Customers, Bank Account Details,
                                                                Subscription and many other benefits.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="heading-5">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-5">
                                                        How can I upload/add my products?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-5" className="collapse" aria-labelledby="heading-5"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>You can update/add products in 4 simple way:
                                                                <ol>
                                                                    <li>Bulk Upload(.csv File)</li>
                                                                    <li>By Scan Product Barcode.</li>
                                                                    <li>By Search Product Name.</li>
                                                                    <li>Add New Product.</li>
                                                                </ol>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="heading-6">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-6">
                                                        What payment options BayFay offers?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-6" className="collapse" aria-labelledby="heading-6"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>BayFay offers all the popular online payment options
                                                                such
                                                                as:
                                                                <ol>
                                                                    <li>Credit Card.</li>
                                                                    <li>Debit Card.</li>
                                                                    <li>Cash On Delivery(COD).</li>
                                                                    <li>Net Banking.</li>
                                                                    <li>UPI Payment.</li>
                                                                </ol>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header" id="heading-7">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-7">
                                                        How will Merchant receive Payment from BayFay?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-7" className="collapse" aria-labelledby="heading-7"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>Merchant can request for payment using manual options or
                                                                auto schedule (Request will generate automatically based
                                                                upon scheduled plan). Once BayFay approves Payment
                                                                requests
                                                                the Amount will be credited to the Merchant Bank account
                                                                within 2 - 3 business days.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header" id="heading-8">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-8">
                                                        How does Merchant Rating impact?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-8" className="collapse" aria-labelledby="heading-8"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>Average rating will appear for the Private Shop on
                                                                BayFay
                                                                Customer Application.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="card">
                                                <div className="card-header" id="heading-9">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-9">
                                                        How do I avoid getting a Lower Rating from Buyers/Customers?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-9" className="collapse" aria-labelledby="heading-9"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>Assure that you always provide the best quality products
                                                                to
                                                                buyers/customers.Communicate with your customer as soon
                                                                as
                                                                you receive a Complaint.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header" id="heading-10">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-10">
                                                        How will BayFay Customer service help?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-10" className="collapse" aria-labelledby="heading-10"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>BayFay Customer Service Team will help to guide both
                                                                Customer and Merchant for the Best service and will help
                                                                to
                                                                use new Technologies introduced in the App.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header" id="heading-11">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-11">
                                                        Is there an opportunity to promote Virtual Shops?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-11" className="collapse" aria-labelledby="heading-11"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>Yes, Merchant can promote his/her Virtual Shop through
                                                                SMS/Notification/Email/Banner/Scratch Card.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header" id="heading-12">
                                                    <h5 className="mb-0" data-toggle="collapse"
                                                        data-target="#collapse-12">
                                                        BayFay providers any Technology for Physical Shops?
                                                        <i className="fa fa-plus" /><i className="fa fa-minus" />
                                                    </h5>
                                                </div>
                                                <div id="collapse-12" className="collapse" aria-labelledby="heading-12"
                                                    data-parent="#accordionExample2">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li>Yes, BayFay gives ERP/POS free for their Merchants who
                                                                have
                                                                their Rental Virtual Shop in BayFay, where they can
                                                                easily
                                                                connect their Physical Shop with their Virtual Shop.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default Faq;
