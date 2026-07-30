import React, { useEffect, useState } from 'react';
import NavigationMenu from "../components/NavigationMenu/NavigationMenu";
import './PaymentPage.scss';
import { useSelector } from "react-redux";
import useHttp from "../hooks/http";
import ApiEndpoints from "../utils/ApiEndpoints";
import RequestSpinner from "../components/RequestSpinner/RequestSpinner";
import useSyncDispatch from "../hooks/dispatch";
import AlertDialog from "../components/AlertDialog/AlertDialog";
import CreditCardDialog from "../components/CreditCardDialog/CreditCardDialog";
import { getNewCardData, getUpiData } from "../utils/RazozrPayUtils";
import Aux from "../utils/auxilary";
import { API_ERROR } from "../store/actionTypes/global-actions";
import UpiDialog from "../components/UPIDialog/UPIDialog";

const PaymentsPage = () => {
    const { sendRequest, isLoading } = useHttp();
    const { sendDispatch } = useSyncDispatch();
    const apiEndpoints = new ApiEndpoints();

    const bayFayCashAmount = useSelector(state => state.orderReducer.bayFayCashAmount);

    const [loader, setLoader] = useState(false);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [tokenToDelete, setTokenToDelete] = useState('');
    const [tokenType, setTokenType] = useState(0);
    const [showCreditCardModal, setShowCreditCardModal] = useState(false);
    const [showUPIModal, setShowUPIModal] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [totalRazorAmount, setTotalRazorAmount] = useState(0);
    const [razorpayCustomerId, setRazorpayCustomerId] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [razorpay, setRazorPay] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({
        txnid: '',
        hash: ''
    });
    const [savedCards, setSavedCards] = useState([]);
    const [savedUpis, setSavedUpis] = useState([]);


    const userProfile = useSelector(state => state.authReducer.userProfile);

    const { razorCustomerId, razorPreferredCard, razorPreferredUpi } = useSelector(state => {
        return {
            razorCustomerId: state.razorReducer.savedSettings?.raz_customer_id,
            razorPreferredCard: state.razorReducer.savedSettings?.raz_pref_Token,
            razorPreferredUpi: state.razorReducer.savedSettings?.raz_pref_upiToken
        }
    });

    useEffect(() => {
        getRazorOrder();
        getBayFayCash();
    }, []);

    useEffect(() => {
        if (razorCustomerId) {
            fetchSavedTokens();
        }
    }, [razorCustomerId]);

    const initRazorpay = key => {
        const razorpay = new window.Razorpay({
            key: key,
            image: `${window.location.origin}/icons/images/icon-192x192.png`,
        });
        setRazorPay(razorpay);
    };

    const getBayFayCash = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .order
                .getBayFayCash();
        sendRequest(url, method, body, success, error);
    };

    const fetchSavedTokens = () => {
        const customerId = razorpayCustomerId ? razorpayCustomerId : razorCustomerId;
        if (!customerId) {
            return
        }
        setLoader(true);

        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().razor.fetchSavedCards(customerId);
        sendRequest(url, method, body, success, error, response => {
            setSavedUpis(response.data?.items?.filter(c => c.vpa) || []);
            setSavedCards(response.data?.items?.filter(c => c.card) || []);
            setLoader(false);
        }, err => setLoader(false));
    };

    const refundOrder = () => {
        setLoader(true);
        const apiBody = {
            amount_paid: totalAmount,
            payment: { ...paymentInfo }
        };
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .order
                .refundOrder(apiBody);
        sendRequest(url, method, body, success, error, response => {
            setLoader(false);
            if (response.success) {
                const payload = {
                    response: {
                        data: {
                            message: response.message
                        }
                    }
                };
                sendDispatch(API_ERROR, payload);
            }
        }, err => setLoader(false))
    };

    const getRazorOrder = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .razor
                .order(null, true, false, null);
        sendRequest(url, method, body, success, error, response => {
            initRazorpay(response.data.rzy_pay_key);
            setPaymentInfo({
                txnid: response.data.transaction_id,
                hash: response.data.hash
            });
            setOrderId(response.data.order.order_id);
            setTotalAmount(response.data.amount);
            setTotalRazorAmount(response.data.order.amount);
            setRazorpayCustomerId(response.data.rzy_customer_Id);
        });
    };

    const savePreferredCard = (cardId) => {
        savePreferredToken(cardId, 1);
    };

    const getRazorSettings = () => {
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().razor.getRazorSettings();
        sendRequest(url, method, body, success, error);
    };

    const savePreferredToken = (tokenId, tokenType) => {
        setLoader(true);
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().razor.savePreferredCard(tokenId, tokenType);
        sendRequest(url, method, body, success, error, _ => {
            fetchSavedTokens();
            getRazorSettings();
        }, err => setLoader(false));
    };

    const savePreferredUpi = (upiId) => {
        savePreferredToken(upiId, 2);
    };

    const deleteSavedToken = () => {
        setShowAlertDialog(false);
        setLoader(true);
        const { url, method, body, success, error } = apiEndpoints
            .getApiEndpoints()
            .razor
            .deleteSavedCard(razorCustomerId, tokenToDelete, tokenType);
        sendRequest(url, method, body, success, error, _ => {
            fetchSavedTokens();
        }, err => setLoader(false));
    };

    const setDataAndMakePaymentWithCard = (cardNum, cardExp, cardCvv, cardSave) => {
        setShowCreditCardModal(false);
        makePaymentWithNewCard(cardNum, cardExp, cardCvv, cardSave);
    };

    const makePaymentWithNewCard = (cardNum, cardExp, cardCvv, cardSave) => {
        const expirationMonth = cardExp.split('\/')[0];
        const expirationYear = cardExp.split('\/')[1];
        const data = getNewCardData(totalRazorAmount,
            razorpayCustomerId,
            orderId,
            cardNum,
            cardCvv,
            expirationMonth,
            expirationYear,
            cardSave,
            userProfile);
        razorpay.createPayment(data);
        razorpay.on('payment.success', fetchSavedTokens);
        razorpay.on('payment.error', refundOrder);
    };

    const closeAlert = () => {
        setTokenToDelete('');
        setTokenType(0);
        setShowAlertDialog(false);
    };

    const onDeleteCard = cardId => {
        setTokenToDelete(cardId);
        setTokenType(1);
        setShowAlertDialog(true);
    };

    const onDeleteUpi = upiID => {
        setTokenToDelete(upiID);
        setTokenType(2);
        setShowAlertDialog(true);
    };

    const setUpiIdAndMakePayment = upiId => {
        const data = getUpiData(totalRazorAmount, orderId, upiId, userProfile, true, razorpayCustomerId);
        razorpay.createPayment(data);
        razorpay.on('payment.success', fetchSavedTokens);
        razorpay.on('payment.error', refundOrder);
    };

    const renderCardImage = item => {
        switch (item.card.network.toString().toLowerCase()) {
            case 'visa':
                return (
                    <img src={require(`../assets/images/visa.png`)}
                        className='card-type-img flex-shrink-0' alt="card" />
                );
            case 'mastercard':
                return (
                    <img src={require(`../assets/images/master-card.png`)}
                        className='card-type-img flex-shrink-0' alt="card" />
                );
            case 'maestro':
                return (
                    <img src={require(`../assets/images/maestro.png`)}
                        className='card-type-img flex-shrink-0' alt="card" />
                );
            default:
                return (
                    <span className='default-card-icon'>
                        <i className="fab fa-cc-mastercard color-red mastercard-icon flex-shrink-0" />
                    </span>
                )
        }
    };

    return (
        <div className='payment-page-container'>
            <NavigationMenu selectedMenuItem={3} />
            <div className='d-flex p-2 flex-column w-100'>
                <span className='font-size-1-4rem my-3 font-weight-bold'>Payment Methods</span>
                {savedCards?.length > 0 ?
                    <span className='font-size-1rem my-2 font-weight-bold'>Saved Cards</span> : null}
                <div className='saved-cards-container'>
                    {savedCards.map(savedCard => (
                        <div className='saved-card' key={savedCard.id}>
                            <div className='card-image-container'>
                                {renderCardImage(savedCard)}
                            </div>
                            <div className='d-flex flex-column pl-2 pr-5 font-size-3 justify-content-center py-3'>
                                <span className='card-number'>XXXX-XXXX-XXXX-{savedCard.card.last4}</span>
                                <span className='expiry-date'>
                                    Valid tll {savedCard.card.expiry_month}/{savedCard.card.expiry_year}
                                </span>
                            </div>
                            <div className='d-flex flex-column justify-content-between p-1 align-items-center ml-2'>
                                <span className='delete-btn' onClick={() => onDeleteCard(savedCard.id)}>
                                    <i className="far fa-trash-alt" />
                                </span>
                                <i className={`fas fa-check-circle font-size-1-4rem cursor-pointer 
                                ${razorPreferredCard === savedCard.id ? 'selected-card' : 'non-selected-card'}`}
                                    onClick={() => savePreferredCard(savedCard.id)} />
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <button className='btn btn-light add-payment-method-btn'
                        onClick={() => setShowCreditCardModal(true)}>
                        Add Payment Method
                    </button>
                </div>
                <div className='my-3 divider-dashed' />
                <div className='saved-cards-container mt-2'>
                    {savedUpis.map(upi => (
                        <div className='saved-upi' key={upi.id}>
                            <div className='card-image-container'>
                                <img src={require('../assets/images/upipay.png')}
                                    alt="menuImage"
                                    className='upi-pay-img flex-shrink-0' />
                                <div className='d-flex flex-column pl-2 pr-5 font-size-3 justify-content-center py-3'>
                                    <span className='card-number mb-2'>{upi?.vpa.username}@{upi?.vpa.handle}</span>
                                </div>
                                <div
                                    className='d-flex flex-column justify-content-between p-1 align-items-center h-100'>
                                    <span className='delete-btn' onClick={() => onDeleteUpi(upi.id)}>
                                        <i className="far fa-trash-alt" />
                                    </span>
                                    <i className={`fas fa-check-circle font-size-1-4rem cursor-pointer 
                                ${razorPreferredUpi === upi.id ? 'selected-card' : 'non-selected-card'}`}
                                        onClick={() => savePreferredUpi(upi.id)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <button className='btn btn-light add-payment-method-btn' onClick={() => setShowUPIModal(true)}>
                        Add New UPI ID
                    </button>
                </div>
                {bayFayCashAmount >= 0 ?
                    <Aux>
                        <div className='divider-dashed my-3' />
                        <span className='font-size-1rem mb-3 font-weight-bold'>Wallets</span>
                        <div className='wallets-container'>
                            <div className='wallet'>
                                <div className='flex-grow-1'>
                                    <img src={require('../assets/images/logo-1024.png')} alt="logo"
                                        className='wallet-img' />
                                    <span className='ml-3'>BayFay Cash</span>
                                </div>
                                <span>₹ {bayFayCashAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </Aux> : null}
            </div>
            {loader ? <RequestSpinner /> : null}
            <AlertDialog show={showAlertDialog} clickBackdrop={closeAlert} onConfirm={deleteSavedToken}
                onReject={closeAlert} confirmButtonText={'Yes'}
                title={`${tokenType === 1 ? 'Delete Card' : 'Delete Upi'}`}
                message={`Are you sure you want to delete the ${tokenType === 1 ? 'Saved Card' : 'Saved Upi'}?`} />
            <CreditCardDialog clickBackdrop={() => setShowCreditCardModal(false)} onlySaveCard={true}
                show={showCreditCardModal} setDataAndMakePayment={setDataAndMakePaymentWithCard} />
            <UpiDialog clickBackdrop={() => setShowUPIModal(false)} show={showUPIModal} onlySaveUpi={true}
                setUpiIdAndMakePayment={setUpiIdAndMakePayment} />
        </div>
    );
};

export default PaymentsPage;
