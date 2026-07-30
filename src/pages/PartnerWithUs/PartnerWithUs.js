import React, { useEffect, useState } from 'react';
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import Aux from "../../utils/auxilary";
import './PartnerWithUs.scss';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import Select from 'react-select';
import { Helmet } from "react-helmet";

const PartnerWithUs = () => {
    const apiEndpoints = new ApiEndpoints();
    const { sendRequest, isLoading } = useHttp();

    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isCityInvalid, setIsCityInvalid] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCategoryInvalid, setIsCategoryInvalid] = useState(false);
    const [businessName, setBusinessName] = useState('');
    const [isBusinessNameInvalid, setIsBusinessNameInvalid] = useState(false);
    const [ownerName, setOwnerName] = useState('');
    const [isOwnerNameInvalid, setIsOwnerNameInvalid] = useState(false);
    const [ownerContactNumber, setOwnerContactNumber] = useState('');
    const [isOwnerContactNumberInvalid, setIsOwnerContactNumberInvalid] = useState(false);
    const [ownerEmail, setOwnerEmail] = useState('');
    const [isOwnerEmailInvalid, setIsOwnerEmailInvalid] = useState(false);
    const [reCaptcha, setReCaptcha] = useState('');
    const [isReCaptchaInvalid, setIsReCaptchaInvalid] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [activeImage, setActiveImage] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        getCategories();
        getCities();
    }, []);

    const getCategories = () => {
        axios.get('https://merchant-api.bayfay.com/merchant/api/category/1')
            .then(response => setCategories(response.data.categories.map(c => ({
                value: c.display_name,
                label: c.display_name
            }))));
    };

    const getCities = () => {
        axios.get('https://merchant-api.bayfay.com/merchant/api/loclist?country=India')
            .then(response => setCities(response.data.location.map(c => ({
                value: c.name,
                label: `${c.name}, ${c.state}`
            }))));
    };

    const contactMe = () => {
        const cityInvalid = !selectedCity;
        setIsCityInvalid(cityInvalid);
        const categoryInvalid = !selectedCategory;
        setIsCategoryInvalid(categoryInvalid);
        const ownerNameInvalid = !(ownerName?.length > 0);
        setIsOwnerNameInvalid(ownerNameInvalid);
        const ownerEmailInvalid = !(ownerEmail?.length > 0);
        setIsOwnerEmailInvalid(ownerEmailInvalid);
        const businessNameInvalid = !(businessName?.length > 0);
        setIsBusinessNameInvalid(businessNameInvalid);
        const contactNumberInvalid = !(ownerContactNumber?.toString()?.length > 0);
        setIsOwnerContactNumberInvalid(contactNumberInvalid);
        const reCaptchaInvalid = !(reCaptcha?.length > 0);
        setIsReCaptchaInvalid(reCaptchaInvalid);
        const isInvalid = categoryInvalid || cityInvalid || contactNumberInvalid ||
            ownerEmailInvalid || ownerNameInvalid || businessNameInvalid || reCaptchaInvalid;
        if (!isInvalid) {
            enquiry();
        }
    };

    const enquiry = () => {
        const apiBody = {
            "business_name": businessName,
            "name": ownerName,
            "contact_num": ownerContactNumber,
            "email_id": ownerEmail,
            "shop_category": selectedCategory.label,
            "city": selectedCity.label,
            "capthca_key": reCaptcha
        };
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .global
                .enquiry(apiBody);
        sendRequest(url, method, body, success, error, response => {
            if (response.success) {
                setResponseMessage(response.message);
                setShowAlert(true);
                setSelectedCategory(null);
                setSelectedCity(null);
                setOwnerEmail('');
                setOwnerContactNumber('');
                setOwnerName('');
                setBusinessName('');
                setReCaptcha('');
            }
        });
    };

    const renderMetadata = () => {
        return (
            <Helmet>
                <title id={'homepage-title'}>Best e-commerce store for retailers, sell nearby and other locations</title>
                <meta name="description" id={'description1'}
                    content="The first premium online store / dukaan for your retail business. Serving in Bangalore, Hyderabad, Delhi, Gurgaon, Nagpur, Jaipur, Coimbatore, Chandigarh, Ahemdabad, Visakhapatnam, Lucknow, Noida, Mumbai, Pune, Indore, Kochi, Kolkata, Nagercoil and Chennai. Order Pizzas, Burgers, Biryanis, Desserts." />
                <meta name="keywords" id={'keywords1'}
                    content="restaurants, order food, order Groceries, order Meat, order online, order food online, food, delivery, food delivery, home delivery, fast, hungry, quickly, offer, discount, takeaway, cuisine, pizza, burger, biryani, dessert, juice, dosa, bangalore, visakhapatnam, nagpur, bengaluru, delhi, gurgaon, ncr, noida, lucknow, hyderabad, mumbai, jaipur, bombay, chennai, pune, kolkata, ahemdabad, kochi, coimbatore, nagercoil, pizza hut, mcd, mcdonalds, dominos, haagen dazs, baskin robbins, papa johns, kfc, haldiram, breakfast, lunch, dinner, snacks, restaurants near me, Aashirvaad, Saffola, Fortune, Nestle, Amul, Mother Dairy, Coke, Pepsi, Bisleri, Colgate, Patanjali, Dabur, Surf Excel, Maggi, Vim, Haldiram's, Kellogg’s, Nescafe, Pampers" />
                <meta httpEquiv="X-UA-Compatible" content="IE=Edge,chrome=1" id={'X-UA-Compatible1'} />
                <meta name="robots" content="index, follow" id={'robots1'} />
                <meta name="og_site_name" id="og_site_name1" property='og:site_name' content="bayfay.com" />
                <meta name="og_title" id="og_title1" property="og:title"
                    content="Order Food, Groceries, Meat on BayFay, best home delivery service. Order from restaurants and nearby shops" />
                <meta property="og:type" id="property1" content="website" />
                <meta property="og:description" id='property2'
                    content="Order food online from restaurants and get it delivered. Serving in Bangalore, Hyderabad, Delhi, Gurgaon, Nagpur, Jaipur, Coimbatore, Chandigarh, Ahemdabad, Visakhapatnam, Lucknow, Noida, Mumbai, Pune, Indore, Kochi, Kolkata, Nagercoil and Chennai. Order Pizzas, Burgers, Biryanis, Desserts." />
                <meta name="og_url" id="property3" property="og:url" content={`${window.location.origin}/home`} />
                <meta property="og:image" id="property4" content='../assets/images/bayfay-logo.png' />
                <link rel="icon" id={'icon192x192'} sizes="192x192"
                    href={`${window.location.origin}/icons/images/icon-192x192.png`} />
                <link rel="apple-touch-icon" id='apple-touch-icon192x192' sizes="192x192"
                    href={`${window.location.origin}/icons/images/icon-192x192.png`} />
                <meta name="msapplication-TileColor" id="msapplication-TileColor1" content="#1d9bf6" />
                <meta name="msapplication-TileImage" id="msapplication-TileImage1"
                    content={`${window.location.origin}/icons/images/mstile-150x150.png`} />
                <link rel="icon" id='iconimage/x-icon' type="image/x-icon"
                    href={`${window.location.origin}/icons/images/favicon-16x16.ico`} />
                <link rel="shortcut icon" id={'shortcut iconimage/x-icon'} type="image/x-icon"
                    href={`${window.location.origin}/icons/images/favicon-32x32.ico`} />
                <link rel="icon" type="image/png" id={'icon123'}
                    href={`${window.location.origin}/icons/images/favicon-96x96.png`} />
                <link rel="apple-touch-icon-precomposed" sizes="72x72" id={'apple-touch-icon-precomposed12'}
                    href={`${window.location.origin}/icons/images/apple-touch-icon-72x72.png`} />
            </Helmet>
        )
    };

    return (
        <Aux>
            {renderMetadata()}
            <CustomHeader title={'Call us: +91 9361450340'} />
            <div className='d-flex justify-content-center static-page-bg'>
                <div className='max-width-1000px w-100 font-size-3 py-2 d-flex flex-column'>
                    <div className='w-100 d-flex'>
                        <div className='partner-image-holder'>
                            <img src={require('../../assets/images/partner.jpg')} className='partner-img' alt='' />
                        </div>
                        <div className='px-4 partner-form'>
                            <span>
                                <span className='partner-label mr-2'>Partner with us</span>
                                <small className='text-secondary'>and Start your virtual shop today</small>
                            </span>
                            <div className="form-group mt-3">
                                <label className='partner-label'>Shop / Business name:</label>
                                <input type="text" className="form-control" placeholder="Enter business name"
                                    onChange={e => setBusinessName(e?.target?.value)} value={businessName} />
                                {isBusinessNameInvalid ?
                                    <small className="form-text ml-2 text-danger">Shop / Business name is
                                        required.</small> : null}
                            </div>
                            <div className="form-group mt-3">
                                <label className='partner-label'>Owner name:</label>
                                <input type="text" className="form-control" placeholder="Enter Owner name"
                                    onChange={e => setOwnerName(e?.target?.value)} value={ownerName} />
                                {isOwnerNameInvalid ? <small className="form-text ml-2 text-danger">Owner name is
                                    required.</small> : null}
                            </div>
                            <div className="form-group mt-3">
                                <label className='partner-label'>Owner Contact Number:</label>
                                <input type="number" className="form-control" placeholder="Enter Owner Contact Number"
                                    onChange={e => setOwnerContactNumber(e?.target?.value)}
                                    value={ownerContactNumber} />
                                {isOwnerContactNumberInvalid ?
                                    <small className="form-text ml-2 text-danger">Owner Contact Number is
                                        required.</small> : null}
                            </div>
                            <div className="form-group mt-3">
                                <label className='partner-label'>Owner Email Id:</label>
                                <input type="email" className="form-control" placeholder="Enter Owner Email Id"
                                    onChange={e => setOwnerEmail(e?.target?.value)} value={ownerEmail} />
                                {isOwnerEmailInvalid ? <small className="form-text ml-2 text-danger">Owner Email Id is
                                    required.</small> : null}
                            </div>

                            <div className='w-80'>
                                <label className='partner-label mt-2'>Shop Category</label>
                                <Select
                                    className='font-size-1rem'
                                    placeholder={'Select Shop Category'}
                                    value={selectedCategory}
                                    onChange={c => setSelectedCategory(c)}
                                    options={categories}
                                />
                                {isCategoryInvalid ?
                                    <small className="form-text ml-2 text-danger">Shop category is
                                        required.</small> : null}
                            </div>
                            <div className='w-80'>
                                <label className='partner-label mt-3'>City</label>
                                <Select
                                    className='font-size-1rem'
                                    placeholder={'Select City'}
                                    value={selectedCity}
                                    onChange={c => setSelectedCity(c)}
                                    options={cities}
                                />
                                {isCityInvalid ?
                                    <small className="form-text ml-2 text-danger">City is required.</small> : null}
                            </div>
                            <div className='mt-4'>
                                <ReCAPTCHA
                                    sitekey="6LfkxeoUAAAAACIg5aZxpobaHPVLvzGmZOd11X81"
                                    onChange={setReCaptcha}
                                />
                            </div>
                            <button className='btn btn-primary my-4 px-5 d-flex align-items-center' onClick={contactMe}
                                disabled={isLoading}>
                                <span>Contact me</span>
                                {isLoading ? <span className="spinner-border spinner-border-sm ml-2" role="status">
                                    <span className="sr-only">Loading...</span>
                                </span> : null}
                            </button>
                        </div>
                    </div>
                    <div className='w-100 d-flex justify-content-center'>
                        <img src={require('../../assets/images/Merchant Enrollment2.jpg')}
                            className='enrolment-process-img' alt="" />
                    </div>
                    <div className="w-100 d-flex justify-content-center flow-img-container">
                        <i className="fal fa-chevron-left review-nav left"
                            onClick={() => {
                                if (activeImage > 1) {
                                    setActiveImage(prevState => prevState - 1);
                                } else {
                                    setActiveImage(3);
                                }
                            }} />
                        {activeImage === 1 ? <img src={require('../../assets/images/Merchant Flow 1 (2).jpg')}
                            className='enrolment-process-img' alt="" /> : activeImage === 2 ?
                            <img src={require('../../assets/images/Merchant Review - Babu.jpg')}
                                className='enrolment-process-img' alt="" /> : activeImage === 3 ?
                                <img src={require('../../assets/images/Merchant Review - Vins.jpg')}
                                    className='enrolment-process-img' alt="" /> : null
                        }
                        <i className="fal fa-chevron-right review-nav right"
                            onClick={() => {
                                if (activeImage < 3) {
                                    setActiveImage(prevState => prevState + 1);
                                } else {
                                    setActiveImage(1);
                                }
                            }} />
                    </div>
                </div>
            </div>
            <AlertDialog show={showAlert} clickBackdrop={() => setShowAlert(false)}
                confirmButtonText={'Ok'} hideRejectButton={true} title={'Enquiry'}
                message={responseMessage} onConfirm={() => setShowAlert(false)} />
        </Aux>
    );
};

export default PartnerWithUs;
