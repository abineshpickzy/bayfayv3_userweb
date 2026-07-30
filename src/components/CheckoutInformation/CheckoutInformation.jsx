import React, { useEffect, useRef, useState } from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import './CheckoutInformation.scss';
import { useSelector } from "react-redux";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import moment from 'moment';
import history from "../../utils/history";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import EditDeliveryAddressModal from "../EditDeliveryAddressModal/EditDeliveryAddressModal";
import ApplyPromoCode from "../ApplyPromoCode/ApplyPromoCode";
import DatePicker from "react-datepicker";
import { LocationUtils } from "../../utils/LocationUtils";
import Aux from "../../utils/auxilary";
import { NUMBER_REGEX } from "../../utils/regEx";
import CreditCardDialog from "../CreditCardDialog/CreditCardDialog";
import BayfayCashAlert from "../BayfayCashAlert/BayfayCashAlert";
import { PaymentUtils, UNKNOWN_CARD_TYPE, validateCardExpirationDate } from "../../utils/PaymentUtils";
import {
    get_COD_delivery_body,
    get_COD_takeaway_body,
    getNetBankingData,
    getNewCardData,
    getSavedCardData,
    getSavedUpiData,
    getShopData,
    getTakeAwayData,
    getUpiData,
    payWithBayFayCashBody
} from "../../utils/RazozrPayUtils";
import CartUtils from "../../utils/CartUtils";
import AlertDialog from "../AlertDialog/AlertDialog";
import { API_ERROR } from "../../store/actionTypes/global-actions";
import useSyncDispatch from "../../hooks/dispatch";
import UpiDialog from "../UPIDialog/UPIDialog";

const ORDER_CONFIRMATION = 'ORDER_CONFIRMATION';
const PAYMENT = 'PAYMENT';
const PAYMENT_SUCCESS = 'PAYMENT_SUCCESS';

const timeValues = [
    "7 AM - 10 AM", "10 AM - 1 PM", "1 PM - 4 PM", "4 PM - 7 PM", "7 PM - 10 PM"
];

const displayedBanks = ['UTIB', 'ICIC', 'KOTAC', 'SBIN', 'HDFC'];

const CheckoutInformation = ({ show, clickBackdrop, categoryId, clearCart, isPrivate }) => {
    const { sendRequest } = useHttp();
    const apiEndpoints = new ApiEndpoints();
    const { sendDispatch } = useSyncDispatch();

    const { savedUserAddress, savedUserZipcode, savedUserLandmark } = LocationUtils.getSavedAddress();
    const bankList = useSelector(state => state.razorReducer.bankList);
    const { deliveryLocationCoordinates, deliveryAddress } = useSelector(state => ({
        deliveryAddress: state.globalReducer.deliveryLocationAddress,
        deliveryLocationCoordinates: state.globalReducer.deliveryLocationCoordinates
    }));
    const deliveryTypes = useSelector(state => state.orderReducer.deliveryTypes);
    const shop = useSelector(state => state.shopsReducer?.openedShop?.shop);
    const bayFayCashAmount = useSelector(state => state.orderReducer.bayFayCashAmount);
    const preferredCard = useSelector(state => state.razorReducer.savedSettings?.raz_pref_Token);
    const preferredUpi = useSelector(state => state.razorReducer.savedSettings?.raz_pref_upiToken);
    const userProfile = useSelector(state => state.authReducer.userProfile);

    const uploadImageRef = useRef(null);

    const [view, setView] = useState(ORDER_CONFIRMATION);
    const [deliveryType, setDeliveryType] = useState('');
    const [stockVerified, setStockVerified] = useState(false);
    const [shopVerifying, setShopVerifying] = useState(false);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [showEditDeliveryAddressModal, setShowEditDeliveryAddressModal] = useState(false);
    const [preferredDateTime, setPreferredDateTime] = useState(false);
    const [isBayFayCash, setIsBayFayCash] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(timeValues[0]);
    const [promoCode, setPromoCode] = useState({ id: null, code: '' });
    const [selectedMenuItem, setSelectedMenuItem] = useState(1);
    const [saveCard, setSaveCard] = useState(true);
    const [saveUPI, setSaveUPI] = useState(true);
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState(UNKNOWN_CARD_TYPE);
    const [cvv, setCvv] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalRazorAmount, setTotalRazorAmount] = useState(0);
    const [razorpayOrderId, setRazorpayOrderId] = useState('');
    const [razorpayCustomerId, setRazorpayCustomerId] = useState('');
    const [paymentInfo, setPaymentInfo] = useState({
        txnid: '',
        hash: ''
    });
    const [billing, setBilling] = useState({});
    const [fetchingRazorpayOrder, setFetchingRazorpayOrder] = useState(false);
    const [showCreditCardModal, setShowCreditCardModal] = useState(false);
    const [showBayFayCashAlert, setShowBayFayCashAlert] = useState(false);
    const [savedCard, setSavedCard] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageFile, setUploadedImageFile] = useState(null);
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [razorpay, setRazorPay] = useState(null);
    const [bayFayCashAlertMode, setBayFayCashAlertMode] = useState(-1);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [invalidAddress, setInvalidAddress] = useState(false);
    const [invalidZipcode, setInvalidZipcode] = useState(false);
    const [allCards, setAllCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState('');
    const [selectedCardCVV, setSelectedCardCVV] = useState('');
    const [isCardInfoValid, setIsCardInfoValid] = useState(true);
    const [showButtonShadow, setShowButtonShadow] = useState(false);
    const [showAlertCODDialog, setShowAlertCODDialog] = useState(false);
    const [invalidInput, setInvalidInput] = useState(false);
    const [codEnabled, setCodEnabled] = useState(false);
    const [savedUpis, setSavedUpis] = useState([]);
    const [shops, setShops] = useState([]);
    const [selectedUpi, setSelectedUpi] = useState('');
    const [invalidUpiSelection, setInvalidUpiSelection] = useState(false);
    const [showUPIModal, setShowUPIModal] = useState(false);
    const [invalidPreferredSelection, setInvalidPreferredSelection] = useState(false);
    const [note, setNote] = useState('');
    let timeout = null;

    useEffect(() => {
        document.body.classList.remove('scroll-y-auto');
        document.body.classList.add('remove-scroll');

        return () => {
            document.body.classList.remove('remove-scroll');
            document.body.classList.add('scroll-y-auto');
        }
    }, [show]);

    useEffect(() => {
        checkCOD();
    }, [totalAmount]);

    useEffect(() => {
        setSaveCard(true);
        setCardNumber('');
        setCvv('');
        setExpirationDate('');
        setIsCardInfoValid(true);
        setInvalidInput(false);
        setSelectedUpi('');
        setInvalidUpiSelection(false);
        setSelectedCard(null);
        if (selectedMenuItem === 5) {
            if (isBayFayCash || promoCode) {
                setIsBayFayCash(false);
                setPromoCode(null);
                getRazorpayOrder(categoryId, false, false, null, false);
            }
        }
    }, [selectedMenuItem]);

    useEffect(() => {
        if (selectedBank?.toString().trim().length > 0 && invalidInput) {
            setInvalidInput(false);
        }
    }, [selectedBank]);

    useEffect(() => {
        const ct = PaymentUtils.getCardType(cardNumber);
        if (cardNumber?.length > 0 && cardType !== ct) {
            setCardType(ct);
        } else if (cardNumber?.length === 0 && cardType !== UNKNOWN_CARD_TYPE) {
            setCardType(UNKNOWN_CARD_TYPE);
        }
    }, [cardNumber]);

    useEffect(() => {
        if (show) {
            const deliveryTypeId = deliveryTypes.delivery_type;
            const type = deliveryTypes.type.find(t => t._id === deliveryTypeId);
            if (!type) {
                setDeliveryType(deliveryTypes.type[0].name);
            } else {
                setDeliveryType(type.name);
            }
        }
    }, [deliveryType, show]);

    useEffect(() => {
        if (show) {
            verifyStock();
            fetchBanksList();
            getRazorpayOrder(categoryId, false, false, null, true);
        }
    }, [show]);

    useEffect(() => {
        setCvv('');
        setSelectedCardCVV('');
        setIsCardInfoValid(true);
    }, [selectedCard]);

    const checkCOD = () => {
        let is_cod;
        let is_cod_limit;
        let is_cod_limit_type;
        if (CartUtils.getIsOtherLocationShop()?.toString() === 'true' && !isPrivate) {
            is_cod = shop?.settings?.general?.delivery?.other?.is_cod;
            is_cod_limit = shop?.settings?.general?.delivery?.other?.is_cod_limit;
            is_cod_limit_type = shop?.settings?.general?.delivery?.other?.is_cod_limit_type;
        } else {
            is_cod = shop?.is_cod || shop?.settings?.general?.delivery?.local?.is_cod;
            is_cod_limit = shop?.is_cod_limit || shop?.settings?.general?.delivery?.local?.is_cod_limit;
            is_cod_limit_type = shop?.is_cod_limit_type || shop?.settings?.general?.delivery?.local?.is_cod_limit_type;
        }
        if (!is_cod) {
            return setCodEnabled(false);
        }
        if (is_cod_limit_type && is_cod_limit_type === 'limit' && is_cod_limit) {
            setCodEnabled(totalAmount <= parseInt(is_cod_limit).toFixed(2));
        } else {
            setCodEnabled(true)
        }
    };

    const fetchBanksList = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .razor
                .fetchBanksList();
        sendRequest(url, method, body, success, error);
    };

    const getBayFayCash = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .order
                .getBayFayCash();
        sendRequest(url, method, body, success, error);
    };

    const getRazorpayOrder = (categoryId, isSaveCard, isBayFayCash, promoId, shouldFetchSavedCards) => {
        setFetchingRazorpayOrder(true);
        getRazorOrder(categoryId, isSaveCard, isBayFayCash, promoId, response => {
            setFetchingRazorpayOrder(false);
            if (razorpay === null) {
                const razorpay = new window.Razorpay({
                    key: response.data.rzy_pay_key,
                    image: `${window.location.origin}/icons/images/icon-192x192.png`,
                });
                setRazorPay(razorpay);
            }
            setBilling(response.data.billing);
            setPaymentInfo({
                txnid: response.data.transaction_id,
                hash: response.data.hash
            });
            console.log('Razor order response:', response.data.order);
            setRazorpayOrderId(response.data.order.id);
            setTotalAmount(response.data.amount);
            setTotalRazorAmount(response.data.order.amount);
            setRazorpayCustomerId(response.data.rzy_customer_Id);
            setPaymentProcessing(false);
            shouldFetchSavedCards && fetchSavedCards(response.data.rzy_customer_Id);
        }, error => {
            setPaymentProcessing(false);
            setFetchingRazorpayOrder(false);
        });
    };

    const addShadow = () => {
        clearTimeout(timeout);
        setShowButtonShadow(true);
        timeout = setTimeout(() => {
            setShowButtonShadow(false);
        }, 500)
    };

    const listSavedCards = () => {
        return allCards?.map(card => (
            <div
                className={`cred-card saved-credit-card ${selectedCard === card.id ? 'saved-credit-card-selected' : ''}
                ${selectedMenuItem === 2 && selectedCard === card.id && !isCardInfoValid ? 'invalid-card' : ''}`}
                key={card.id} onClick={() => setSelectedCard(card.id)}>
                {
                    renderCardImage(card)
                }
                <div className='d-flex flex-column w-75 px-2 py-3 align-items-start'>
                    <span className='mb-2'>Credit / Debit Card</span>
                    <span
                        className={`${selectedCard === card.id} ? 'mb-2' : ''`}>XXXXXXXXXXXX-{card?.card?.last4}</span>
                    {selectedCard === card.id ?
                        <div className='d-flex justify-content-between align-items-center w-80 pt-2'>
                            <span>** / {card?.card?.expiry_year.toString().substring(2, 4)}</span>
                            <input className='cvv' placeholder='CVV' maxLength={3}
                                onChange={e => setSelectedCardCVV(e.target.value)} value={selectedCardCVV} />
                        </div> : null}
                </div>
            </div>
        ))
    };

    const listSavedUpis = () => {
        return savedUpis.map(upi => (
            <div className={`saved-upi saved-upi-id ${selectedUpi === upi.token ? 'selected-upi' : ''}`}
                key={upi.id}
                onClick={() => setSelectedUpi(upi.token)}>
                <div className='card-image-container'>
                    <img src={require('../../assets/images/upipay.png')}
                        alt="menuImage"
                        className='upi-pay-img flex-shrink-0' />
                    <div className='d-flex flex-column pl-2 pr-5 font-size-3 justify-content-center py-3'>
                        <span className='card-number mb-2'>{upi?.vpa.username}@{upi?.vpa.handle}</span>
                    </div>
                </div>
            </div>
        ))
    };

    const fetchSavedCards = (customer_id) => {

        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .razor
                .fetchSavedCards(customer_id);
        sendRequest(url, method, body, success, error, response => {
            if (response.data?.items?.length > 0) {
                const pc = response.data.items.find(item => item.id === preferredCard);
                const cards = response.data.items.filter(c => c.card);
                const upis = response.data.items.filter(c => c.vpa);
                setSavedUpis(upis);
                setAllCards(cards);
                if (pc) {
                    setSavedCard(pc);
                }
            }
        });
    };

    const verifyStock = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .verifyStock(categoryId);
        sendRequest(url, method, body, success, error, (response) => {
            if (response.success) {
                setStockVerified(true);
            } else {
                clickBackdrop();
            }
        }, error => setStockVerified(true));
    };

    const constructConfirmationAddressBody = () => {
        let zip = deliveryAddress.zipcode;
        if (!zip) {
            zip = savedUserZipcode;
        }
        return {
            _id: categoryId,
            deliveryType: deliveryTypes?.delivery_type,
            deliveryLocation: {
                type: "Point",
                coordinates: [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
            },
            deliveryAddress: {
                street: deliveryAddress.address,
                area: deliveryAddress.area,
                zipcode: zip
            }
        }
    };

    const getPromoList = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .promo
                .getPromos(categoryId);
        sendRequest(url, method, body, success, error);
    };

    const confirmAddress = () => {
        setInvalidAddress(false);
        setInvalidZipcode(false);
        if (!deliveryAddress.address || deliveryAddress.address.toString().trim().length === 0) {
            setInvalidAddress(true);
            return;
        }
        if (!deliveryAddress.zipcode || deliveryAddress.zipcode.toString().trim().length === 0) {
            setInvalidZipcode(true);
            return;
        }
        setShopVerifying(true);
        getBayFayCash();
        getPromoList();
        const apiBody = constructConfirmationAddressBody();
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .verifyShop(apiBody);
        sendRequest(url, method, body, success, error, response => {
            if (response.success) {
                setShopVerifying(false);
                setView(PAYMENT);
            }
        }, error => setShopVerifying(false));
    };

    const getRazorOrder = (categoryId, isSaveCard, isBayFayCash, promoId, callback, errorCallback) => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .razor
                .order(categoryId, isSaveCard, isBayFayCash, promoId);
        sendRequest(url, method, body, success, error, callback, errorCallback);
    };

    const clearPromoCodeAndFetchOrder = () => {
        setPromoCode(null);
        getRazorpayOrder(categoryId, false, isBayFayCash, null, false);
    };

    const cardInputsValid = (cardNum, cardExp, cardCvv) => {
        const cvvValid = cardCvv?.length === 3;
        const expirationDateValid = validateCardExpirationDate(cardExp);
        const cardNumberValid = cardNum?.length === 16;
        setIsCardInfoValid(cvvValid && expirationDateValid && cardNumberValid);
        return cvvValid && expirationDateValid && cardNumberValid;
    };

    const refundOrder = () => {
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
            setPaymentProcessing(false);
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
        }, error => setPaymentProcessing(false))
    };

    const makePaymentWithPreferredOption = () => {
        setInvalidPreferredSelection(false);
        if (!selectedCard && !selectedUpi) {
            setInvalidPreferredSelection(true);
            return;
        }
        if (selectedUpi) {
            makePaymentWithSavedUpi();
        } else {
            makePaymentWithSavedCard(savedCard.token, selectedCardCVV);
        }
    };

    const makePaymentWithSavedCard = (token, cvv) => {
        if (cvv?.length !== 3) {
            setIsCardInfoValid(false);
            return;
        }
        setIsCardInfoValid(true);
        setPaymentProcessing(true);
        const data = getSavedCardData(totalRazorAmount, razorpayOrderId, razorpayCustomerId, token, cvv, userProfile);
        razorpay.createPayment(data);
        if (isShopDelivery()) {
            razorpayCallbacks(razorpay, shopSuccessCallback, errorCallback);
        } else {
            razorpayCallbacks(razorpay, takeAwaySuccessCallback, errorCallback);
        }
    };

    const makePaymentWithUPI = newUpiId => {
        if (savedUpis.length > 0 && !newUpiId) {
            if (selectedUpi?.length === 0) {
                setInvalidUpiSelection(true);
                return;
            } else {
                setInvalidUpiSelection(false);
                makePaymentWithSavedUpi();
                return;
            }
        }
        setInvalidUpiSelection(false);
        if (!newUpiId && upiId?.toString().trim().length === 0) {
            setInvalidInput(true);
            return;
        }
        setPaymentProcessing(true);
        console.log("FINAL ORDER ID SENT (UPI):", razorpayOrderId); 
        let upi = newUpiId ? newUpiId : upiId;
        const data = getUpiData(totalRazorAmount, razorpayOrderId, upi, userProfile, saveUPI, razorpayCustomerId);
        console.log("PAYLOAD:", data);
        razorpay.createPayment(data);
        if (isShopDelivery()) {
            razorpayCallbacks(razorpay, shopSuccessCallback, errorCallback);
        } else {
            razorpayCallbacks(razorpay, takeAwaySuccessCallback, errorCallback);
        }
    };

    const makePaymentWithSavedUpi = () => {
        setPaymentProcessing(true);
        const data = getSavedUpiData(totalRazorAmount, razorpayOrderId, selectedUpi, userProfile, razorpayCustomerId);
        razorpay.createPayment(data);
        if (isShopDelivery()) {
            razorpayCallbacks(razorpay, shopSuccessCallback, errorCallback);
        } else {
            razorpayCallbacks(razorpay, takeAwaySuccessCallback, errorCallback);
        }
    };

    const makePaymentWithNetBanking = () => {
        if (selectedBank?.toString().trim().length === 0) {
            setInvalidInput(true);
            return;
        }
        setPaymentProcessing(true);
        const data = getNetBankingData(totalRazorAmount, selectedBank, razorpayOrderId, userProfile);
        razorpay.createPayment(data);
        if (isShopDelivery()) {
            razorpayCallbacks(razorpay, shopSuccessCallback, errorCallback);
        } else {
            razorpayCallbacks(razorpay, takeAwaySuccessCallback, errorCallback);
        }
    };

    const CODDeliveryPaymentConfirmation = () => {
        setPaymentProcessing(true);
        let customTime = getPreferredTime();
        const apiBody = get_COD_delivery_body(categoryId, deliveryLocationCoordinates, deliveryAddress, customTime, note, uploadedImageFile);
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .confirmPayments
                .confirmCODWithDelivery(apiBody);
        sendRequest(url, method, body, success, error, response => {
            setShops(response.data.shops);
            setPaymentProcessing(false);
            setView(PAYMENT_SUCCESS);
            clearCart();
        }, error => setPaymentProcessing(false));
    };

    const CODTakeawayPaymentConfirmation = () => {
        setPaymentProcessing(true);
        let customTime = getPreferredTime();
        const apiBody = get_COD_takeaway_body(categoryId, promoCode?.id, customTime, note, uploadedImageFile);
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .confirmPayments
                .confirmCODTakeaway(apiBody);
        sendRequest(url, method, body, success, error, response => {
            setShops(response.data.shops);
            setPaymentProcessing(false);
            setView(PAYMENT_SUCCESS);
            clearCart();
        }, error => setPaymentProcessing(false));
    };

    const makePaymentWithCOD = () => {
        setShowAlertCODDialog(false);
        if (isShopDelivery()) {
            // with delivery
            CODDeliveryPaymentConfirmation();
        } else {
            // self-pickup
            CODTakeawayPaymentConfirmation();
        }
    };

    const setUpiIdAndMakePayment = (upiId, saveUpiId) => {
        setUpiId(upiId);
        setSaveUPI(saveUpiId);
        makePaymentWithUPI(upiId);
    };

    const setDataAndMakePaymentWithCard = (cardNum, cardExp, cardCvv, cardSave) => {
        setShowCreditCardModal(false);
        setCardNumber(cardNum);
        setExpirationDate(cardExp);
        setCvv(cardCvv);
        setSaveCard(cardSave);
        makePaymentWithNewCard(cardNum, cardExp, cardCvv, cardSave);
    };

    const makePayment = () => {
        if (!selectedCard || selectedCard?.toString().trim().length === 0) return;
        if (selectedCard === 'new') {
            makePaymentWithNewCard(cardNumber, expirationDate, cvv, saveCard);
        } else {
            const card = allCards.find(c => c.id === selectedCard);
            makePaymentWithSavedCard(card.token, selectedCardCVV);
        }
    };

    const makePaymentWithNewCard = (cardNum, cardExp, cardCvv, cardSave) => {
        if (!cardInputsValid(cardNum, cardExp, cardCvv)) return false;
        setPaymentProcessing(true);
        const expirationMonth = cardExp.split('\/')[0];
        const expirationYear = cardExp.split('\/')[1];
        const data = getNewCardData(totalRazorAmount,
            razorpayCustomerId,
            razorpayOrderId,
            cardNum,
            cardCvv,
            expirationMonth,
            expirationYear,
            cardSave,
            userProfile);

        razorpay.createPayment(data);
        if (isShopDelivery()) {
            razorpayCallbacks(razorpay, shopSuccessCallback, errorCallback);
        } else {
            razorpayCallbacks(razorpay, takeAwaySuccessCallback, errorCallback);
        }
    };

    const razorpayCallbacks = (razorpay, successCallback, errorCallback) => {
        razorpay.on('payment.success', successCallback);
        razorpay.on('payment.error', errorCallback);// will pass payment ID, order ID, and Razorpay signature to success handler.
    };

    const shopSuccessCallback = (response) => {
        const paymentId = response.razorpay_payment_id;
        const payment = {
            ...paymentInfo,
            rzy_pay_txnid: paymentId
        };
        let customTime = getPreferredTime();
        const data = getShopData(categoryId, isBayFayCash, promoCode?.id, payment, customTime, deliveryLocationCoordinates, deliveryAddress, note, uploadedImageFile);
        const { url, method, body } = apiEndpoints.getApiEndpoints().confirmPayments.confirmSuccessShopPayment(data);
        sendRequest(url, method, body, null, null, response => {
            setShops(response.data.shops);
            setPaymentProcessing(false);
            clearCart();
            setView(PAYMENT_SUCCESS);
        }, error => setPaymentProcessing(false));
    };

    const takeAwaySuccessCallback = (response) => {
        const paymentId = response.razorpay_payment_id;
        const payment = {
            ...paymentInfo,
            rzy_pay_txnid: paymentId
        };
        let customTime = getPreferredTime();
        const data = getTakeAwayData(categoryId, isBayFayCash, promoCode?.id, payment, customTime, note, uploadedImageFile);
        const { url, method, body } = apiEndpoints.getApiEndpoints().confirmPayments.confirmSuccessTakeawayPayment(data);
        sendRequest(url, method, body, null, null, response => {
            setShops(response.data.shops);
            setPaymentProcessing(false);
            clearCart();
            setView(PAYMENT_SUCCESS);
        }, error => setPaymentProcessing(false));
    };

    const errorCallback = e => {
        console.error('Razorpay Payment Error:', JSON.stringify(e));
        refundOrder();
    };

    const openPromoModal = () => {
        !(promoCode?.code?.length > 0) && setShowPromoModal(true);
    };

    const applyPromoCode = promo => {
        if (selectedMenuItem === 5) {
            setBayFayCashAlertMode(3);
            setShowBayFayCashAlert(true);
            setPromoCode(null);
        } else {
            getRazorpayOrder(categoryId, false, isBayFayCash, promo.id, false);
            setPromoCode(promo);
            setShowPromoModal(false);
        }
    };

    const onExpirationDateChange = e => {
        if (e?.target.value?.toString().length === 2) {
            const isNumber = NUMBER_REGEX.test(e.target.value);
            if (isNumber) {
                setExpirationDate(e.target.value + '/');
            } else {
                setExpirationDate(e.target.value);
            }
        } else {
            setExpirationDate(e.target.value);
        }
    };

    const onCvvChange = e => {
        setCvv(e.target.value);
    };

    const onCardNumberChange = e => {
        setCardNumber(e.target.value);
    };

    const onUpiIdChange = e => {
        setUpiId(e.target.value);
    };

    const resetIsBayFayCashAndCloseModal = () => {
        setShowBayFayCashAlert(false);
        setIsBayFayCash(false);
    };

    const closeBayFayAlert = () => {
        setShowBayFayCashAlert(false);
    };

    const onBayFayCashCheckboxChange = () => {
        if (selectedMenuItem === 5) {
            const x = +bayFayCashAmount.toFixed(2);
            const y = +(+totalAmount).toFixed(2);
            if (x >= y) {
                setBayFayCashAlertMode(1);
                setShowBayFayCashAlert(true);
            } else {
                setBayFayCashAlertMode(2);
                setShowBayFayCashAlert(true);
            }
        } else {
            setIsBayFayCash(prevState => {
                if (!prevState) {
                    const x = +bayFayCashAmount.toFixed(2);
                    const y = +(+totalAmount).toFixed(2);
                    if (bayFayCashAmount && x >= y) {
                        if (promoCode !== null && promoCode.id !== null) {
                            setBayFayCashAlertMode(4);
                            setShowBayFayCashAlert(true);
                        } else {
                            setBayFayCashAlertMode(1);
                            setShowBayFayCashAlert(true);
                        }
                    } else {
                        setPaymentProcessing(true);
                        getRazorpayOrder(categoryId, false, !isBayFayCash, promoCode?.id, false);
                    }
                } else {
                    setPaymentProcessing(true);
                    getRazorpayOrder(categoryId, false, !isBayFayCash, promoCode?.id, false);
                }
                return !prevState;
            });
        }
    };

    const isShopDelivery = () => {
        const type = deliveryTypes.type.find(t => t.name === deliveryType);
        return type._id === 1;
    };

    const getPreferredTime = () => {
        if (preferredDateTime) {
            const timeFromTo = time.split(' - ');
            const time_from = moment(timeFromTo[0], 'hh A').format('hh:mm:ss:SSS');
            const time_to = moment(timeFromTo[1], 'hh A').format('hh:mm:ss:SSS');
            const date_ = moment(date).format('YYYY-MM-DD');
            return {
                from: `${date_} ${time_from}`,
                to: `${date_} ${time_to}`,
            };
        } else {
            return null;
        }
    };

    const payWithBayFayCash = () => {
        setPaymentProcessing(true);
        let customTime = getPreferredTime();
        const apiBody = payWithBayFayCashBody(categoryId, isShopDelivery(), promoCode?.id, deliveryLocationCoordinates, deliveryAddress, customTime, paymentInfo.txnid, note, uploadedImageFile);
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .order
                .payWithBayFayCash(apiBody);
        sendRequest(url, method, body, success, error, response => {
            setShops(response.data.shops);
            setPaymentProcessing(false);
            setView(PAYMENT_SUCCESS);
            clearCart();
        }, error => setPaymentProcessing(false));
    };

    const payWithBayFayCashAndCloseDialog = () => {
        payWithBayFayCash();
        closeBayFayAlert();
    };

    const onBayFayAlertSuccess = () => {
        setPaymentProcessing(false);
        if (bayFayCashAlertMode === 1) {
            payWithBayFayCashAndCloseDialog();
        } else if (bayFayCashAlertMode === 2 || bayFayCashAlertMode === 4) {
            resetIsBayFayCashAndCloseModal();
        } else {
            closeBayFayAlert();
            setShowPromoModal(false);
        }
    };

    const onBayFayAlertReject = () => {
        setPaymentProcessing(false);
        if (bayFayCashAlertMode === 1 || bayFayCashAlertMode === 2 || bayFayCashAlertMode === 4) {
            resetIsBayFayCashAndCloseModal();
        } else {
            setShowBayFayCashAlert(false);
        }
    };

    const isDisabledTime = t => {
        if (date > new Date()) {
            return false;
        }
        const times = t.split(' - ');
        const bottomRangeTimeParts = times[1].split(' ');
        const timeNowParts = moment(new Date()).format('h A').split(' ');
        if (timeNowParts[1] === 'AM' && bottomRangeTimeParts[1] === 'PM') return false;
        else if (timeNowParts[1] === 'PM' && bottomRangeTimeParts[1] === 'AM') return true;
        else {
            return +bottomRangeTimeParts[0] <= +timeNowParts[0];
        }
    };

    const onImgUpload = e => {
        const file = e.target.files[0];
        setUploadedImageFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setUploadedImage(reader.result.toString());
        }
    };

    const onCashMenuItemClicked = () => {
        setSelectedMenuItem(5);
    };

    const renderCardImage = item => {
        if (!item) return;
        switch (item.card.network.toString().toLowerCase()) {
            case 'visa':
                return (
                    <img src={require(`../../assets/images/visa.png`)}
                        className='card-type-img img mx-2 mt-3 flex-shrink-0' alt="card" />
                );
            case 'mastercard':
                return (
                    <img src={require(`../../assets/images/master-card.png`)}
                        className='card-type-img img mx-2 mt-3 flex-shrink-0' alt="card" />
                );
            case 'master-card':
                return (
                    <img src={require(`../../assets/images/master-card.png`)}
                        className='card-type-img img mx-2 mt-3 flex-shrink-0' alt="card" />
                );
            case 'maestro':
                return (
                    <img src={require(`../../assets/images/maestro.png`)}
                        className='card-type-img img mx-2 mt-3 flex-shrink-0' alt="card" />
                );
            default:
                return (
                    <span className='default-card-icon img mx-2 mt-3'>
                        <i className="fab fa-cc-mastercard color-red mastercard-icon flex-shrink-0" />
                    </span>
                )
        }
    };

    const navigateToTrackOrder = () => {
        CartUtils.removeMostRecentShop();
        CartUtils.removeShopsIds();
        CartUtils.removeMostRecentAddresses();
        history.push('/track-order');
    };

    const clearDataAndNavigateToHome = () => {
        CartUtils.removeMostRecentShop();
        CartUtils.removeShopsIds();
        CartUtils.removeMostRecentAddresses();
        history.push('/home');
    };

    const preferredCardContent = () => {
        if (!savedCard && !preferredUpi) return (
            <div className='d-flex py-5 justify-content-center w-100'>
                <span className='font-size-1rem'>No Preferred Option</span>
            </div>
        );
        return (
            <div
                className="d-flex align-items-start flex-grow-1 h-100 pl-4 pb-0 flex-column">
                <div
                    className={`cred-card saved-credit-card ${selectedCard === savedCard?.id ? 'saved-credit-card-selected' : ''}
                ${selectedMenuItem === 2 && selectedCard === savedCard?.id && !isCardInfoValid ? 'invalid-card' : ''}`}
                    key={savedCard?.id} onClick={() => {
                        setSelectedCard(savedCard?.id);
                        setSelectedUpi('');
                    }}>
                    {
                        renderCardImage(savedCard)
                    }
                    <div className='d-flex flex-column w-75 px-2 py-3 align-items-start'>
                        <span className='mb-2'>Credit / Debit Card</span>
                        <span
                            className={`${selectedCard === savedCard?.id} ? 'mb-2' : ''`}>XXXXXXXXXXXX-{savedCard?.card?.last4}</span>
                        {selectedCard === savedCard?.id ?
                            <div className='d-flex justify-content-between align-items-center w-80 pt-2'>
                                <span>** / {savedCard?.card?.expiry_year.toString().substring(2, 4)}</span>
                                <input className='cvv' placeholder='CVV' maxLength={3}
                                    onChange={e => setSelectedCardCVV(e.target.value)} value={selectedCardCVV} />
                            </div> : null}
                    </div>
                </div>
                {
                    savedUpis.filter(upi => upi.id === preferredUpi).map(upi => (
                        <div
                            className={`saved-upi saved-upi-id width-320px ${selectedUpi === upi.token ? 'selected-upi' : ''}`}
                            key={upi.id}
                            onClick={() => {
                                setSelectedUpi(upi.token);
                                setSelectedCard(null);
                            }}>
                            <div className='card-image-container'>
                                <img src={require('../../assets/images/upipay.png')}
                                    alt="menuImage"
                                    className='upi-pay-img flex-shrink-0' />
                                <div className='d-flex flex-column pl-2 pr-5 font-size-3 justify-content-center py-3'>
                                    <span className='card-number mb-2'>{upi?.vpa.username}@{upi?.vpa.handle}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {invalidPreferredSelection ?
                    <div className='font-size-2 text-danger text-left'>Please select an option!</div> : null}
                <div className='payment-btn-container'>
                    <button className="btn btn-light make-payment-btn height-32px align-self-start mt-5"
                        onClick={() => {
                            makePaymentWithPreferredOption()
                        }}> Make Payment of ₹ {totalAmount}
                    </button>
                </div>
            </div>
        )
    };

    const addCreditOrDebitCard = () => {
        return (
            <div
                className="d-flex align-items-start flex-grow-1 h-100 px-4 pb-0 flex-column">
                {listSavedCards()}
                {(!allCards || allCards.length === 0) ? <div
                    className={`cred-card mt-3 saved-credit-card ${selectedCard === 'new' ? 'saved-credit-card-selected' : ''}
                     ${selectedMenuItem === 2 && selectedCard === 'new' && !isCardInfoValid ? 'invalid-card' : ''}`}
                    onClick={() => setSelectedCard('new')}>
                    {
                        (!cardType || cardType === UNKNOWN_CARD_TYPE) ?
                            <i className="fab fa-cc-mastercard color-red mastercard-icon mx-3 mt-4 flex-shrink-0" /> :
                            <img src={require(`../../assets/images/${cardType.toLowerCase()}.png`)}
                                className='card-type-img mx-2 mt-3 flex-shrink-0' alt="card" />
                    }
                    <div className='d-flex flex-column w-75 px-2 py-3 align-items-start'>
                        <span className='mb-2'>Credit / Debit Card</span>
                        <input type="text" className='card-number-input mb-1' placeholder='Card Number'
                            value={cardNumber} onChange={onCardNumberChange} maxLength={16} />
                        <div className='d-flex justify-content-between align-items-center exp-date-cvv-container pt-2'>
                            <input type="text" className='expiration-date-input' placeholder='Exp. date'
                                value={expirationDate} onChange={onExpirationDateChange} maxLength={5} />
                            <div className='d-flex align-self-center'>
                                <input className='cvv' placeholder='CVV' maxLength={3}
                                    onChange={onCvvChange} value={cvv} />
                                <div className="btn-group dropup">
                                    <button type="button" className="btn btn-light p-0 ml-3"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fal fa-question-circle align-self-center cursor-pointer" />
                                    </button>
                                    <div className="dropdown-menu width-200px px-2 font-size-2">
                                        <span>
                                            Your CVV is 3 digit no at your card's back side
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null}
                <div className='add-payment-method' onClick={() => setShowCreditCardModal(true)}>
                    Add Payment Method
                </div>
                {(!allCards || allCards.length === 0) ? <div className='pt-4'>
                    <div className="form-check cursor-pointer">
                        <input className="form-check-input" type="checkbox" checked={saveCard}
                            onChange={() => setSaveCard(prevState => !prevState)} id="defaultCheck1" />
                        <label className="form-check-label" htmlFor="defaultCheck1">
                            Secure save this card to order faster next time.
                        </label>
                    </div>
                </div> : null}
                <button className="btn btn-light make-payment-btn height-32px align-self-center mt-4"
                    onClick={() => {
                        makePayment(cardNumber, expirationDate, cvv, saveCard);
                    }}> Make Payment of ₹ {totalAmount}
                </button>
            </div>
        )
    };

    const upiPay = () => {
        return (
            <div className='d-flex flex-column'>
                <div className='d-flex flex-row align-items-center'>
                    <span className='d-flex mr-2 flex-shrink-0'>We Accept:</span>
                    <div className='flex-grow-1 d-flex'>
                        <img src={require('../../assets/images/google-pay.png')} alt="googlePay"
                            className='w-15 mr-3 height-20px' />
                        <img src={require('../../assets/images/phone_pe.jpg')} alt="phonepe"
                            className='w-20 mr-3 height-20px' />
                        <img src={require('../../assets/images/bhim.jpeg')} alt="bhim"
                            className='w-15 mr-3 height-20px' />
                        <img src={require('../../assets/images/pockets.png')} alt="pockets"
                            className='w-15 mr-3 height-20px' />
                    </div>
                </div>
                {savedUpis?.length > 0 ?
                    <div className='d-flex flex-column'>
                        {listSavedUpis()}
                        {invalidUpiSelection ?
                            <div className='font-size-2 text-danger text-left'>Please select UPI ID</div> : null}
                        <div className='add-upi-id' onClick={() => {
                            setShowUPIModal(true);
                            setSelectedUpi('');
                        }}>
                            Add New UPI ID
                        </div>
                    </div> : null}
                {savedUpis?.length === 0 ? <Aux>
                    <div className={`upi-pay-card`}>
                        <div className='mr-4'>
                            <img src={require('../../assets/images/upipay.png')} alt="upipay" className='upi-pay-img' />
                        </div>
                        <div className='d-flex flex-column upi-input-wrapper'>
                            <span className='mb-3 text-left'>Enter your UPI ID</span>
                            <input type="text" className='upi-id-input' placeholder='Enter your UPI ID' value={upiId}
                                onChange={onUpiIdChange} />
                        </div>
                    </div>
                    {invalidInput ?
                        <div className='font-size-2 text-danger text-left'>Please enter your UPI ID</div> : null}
                    <div className="form-check cursor-pointer mt-2">
                        <input className="form-check-input" type="checkbox" checked={saveUPI}
                            onChange={() => setSaveUPI(prevState => !prevState)} id="saveUpiId" />
                        <label className="form-check-label" htmlFor="saveUpiId">
                            Secure save this UPI ID in order faster next time.
                        </label>
                    </div>
                </Aux> : null}
                <button className="btn btn-light make-payment-btn height-32px align-self-center mt-5"
                    onClick={() => {
                        makePaymentWithUPI()
                    }}> Make Payment of ₹ {totalAmount}
                </button>
            </div>
        )
    };

    const netBanking = () => {
        return (
            <div className='d-flex flex-column'>
                <div className='d-flex flex-wrap height-max-content mb-5'>
                    <div className='bank-container' onClick={() => setSelectedBank('HDFC')}>
                        <div className='bank-img-container hdfc-bank'>
                            <img src={require('../../assets/images/hdfc-bank.jpg')} alt="hdfcBank"
                                className='bank-logo' />
                        </div>
                        <span className='bank-name'>HDFC</span>
                        <i className={`fal fa-check-circle font-size-lg ${selectedBank === 'HDFC' ? 'selected-bank' : 'non-selected-bank'}`} />
                    </div>
                    <div className='bank-container' onClick={() => setSelectedBank('UTIB')}>
                        <div className='bank-img-container axis-bank'>
                            <img src={require('../../assets/images/axis-bank.png')} alt="axisBank"
                                className='bank-logo' />
                        </div>
                        <span className='bank-name'>AXIS</span>
                        <i className={`fal fa-check-circle font-size-lg ${selectedBank === 'UTIB' ? 'selected-bank' : 'non-selected-bank'}`} />
                    </div>
                    <div className='bank-container' onClick={() => setSelectedBank('ICIC')}>
                        <div className='bank-img-container'>
                            <img src={require('../../assets/images/icici-bank.jpg')} alt="iciciBank"
                                className='bank-logo icici-img' />
                        </div>
                        <span className='bank-name'>ICICI</span>
                        <i className={`fal fa-check-circle font-size-lg ${selectedBank === 'ICIC' ? 'selected-bank' : 'non-selected-bank'}`} />
                    </div>
                    <div className='bank-container' onClick={() => setSelectedBank('KOTAC')}>
                        <div className='bank-img-container kotac-bank'>
                            <img src={require('../../assets/images/kotac-bank.png')} alt="kotacBank"
                                className='bank-logo' />
                        </div>
                        <span className='bank-name'>KOTAC</span>
                        <i className={`fal fa-check-circle font-size-lg ${selectedBank === 'KOTAC' ? 'selected-bank' : 'non-selected-bank'}`} />
                    </div>
                    <div className='bank-container' onClick={() => setSelectedBank('SBIN')}>
                        <div className='bank-img-container'>
                            <img src={require('../../assets/images/sbi-bank.png')} alt="sbiBank"
                                className='bank-logo sbi-bank-img' />
                        </div>
                        <span className='bank-name'>SBI</span>
                        <i className={`fal fa-check-circle font-size-lg ${selectedBank === 'SBIN' ? 'selected-bank' : 'non-selected-bank'}`} />
                    </div>
                    <div className='bank-container hidden' />
                </div>
                <div className='d-flex justify-content-center'>
                    <div className="dropdown">
                        <button className="btn other-banks-btn dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className='other-banks-label text-truncate'>
                                {selectedBank?.length === 0 || displayedBanks.includes(selectedBank) ? 'Other banks' :
                                    bankList[selectedBank]}
                            </span>
                        </button>
                        <div className="dropdown-menu banks-list" aria-labelledby="dropdownMenuButton">
                            {Object.keys(bankList).filter(bKey => !displayedBanks.includes(bKey))
                                .map(bKey => (
                                    <span className="dropdown-item bank-item hover-grey text-truncate" key={bKey}
                                        onClick={() => setSelectedBank(bKey)}>
                                        {bankList[bKey]}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
                {invalidInput ?
                    <div className='font-size-2 text-danger text-left mt-1'>Please select a Bank</div> : null}
                <button className="btn btn-light make-payment-btn height-32px align-self-center mt-5"
                    onClick={() => {
                        makePaymentWithNetBanking();
                    }}> Make Payment of ₹ {totalAmount}
                </button>
            </div>

        )
    };

    const codOrder = () => {
        return (
            <div className='d-flex pt-5 justify-content-center w-100 h-25'>
                <button className="btn btn-light make-payment-btn height-32px align-self-center mt-3"
                    disabled={fetchingRazorpayOrder}
                    onClick={() => {
                        setShowAlertCODDialog(true);
                    }}> Make Payment of ₹ {totalAmount}
                </button>
            </div>
        )
    };

    return (
        <ModalWrapper show={show} transparentBackground={true} headerClickable={true}>
            <div className="modal-dialog checkout-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body checkout-dialog">
                        {view !== PAYMENT_SUCCESS ? <div className="close-icon">
                            <i className="fal fa-times font-size-16 checkout-close-btn"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={clickBackdrop}>
                            </i>
                        </div> : null}
                        {view === ORDER_CONFIRMATION && <Aux>
                            <div
                                className="container d-flex bg-white flex-column align-items-center checkout-container page-1"
                                onScroll={addShadow}>
                                <div className="py-1 px-2 h6 shops-group w-85 text-left checkout-title-color">
                                    Selected Delivery Method
                                </div>
                                <div className="d-flex justify-content-center p-2 w-500px">
                                    <div className="d-flex flex-column pr-4">
                                        <span className='text-right mb-2'>Local Delivery:</span>
                                        <span className='text-right'>Other location Delivery:</span>
                                    </div>
                                    <div className="d-flex flex-column pl-4">
                                        <span
                                            className='text-left mb-2'>Within {shop?.delivery_local_duration} {shop?.delivery_local_duration_unit}</span>
                                        <span
                                            className='text-left'>Within {shop?.delivery_other_duration} {shop?.delivery_other_duration_unit}</span>
                                    </div>
                                </div>

                                <div className='divider w-70 checkout-divider' />

                                <div
                                    className="d-flex justify-content-center pb-2 pt-3 delivery-type-container w-500px mb-2">
                                    <div className="d-flex align-items-start">
                                        {deliveryType === 'By Shop' ?
                                            <i className="fas fa-truck text-primary large-icon" /> : null}
                                        {deliveryType !== 'By Shop' ?
                                            <i className="fas fa-user text-purple large-icon" /> : null}
                                    </div>
                                    <div
                                        className={`d-flex flex-grow-1 ${(shop?.delivery_local_from && shop?.delivery_local_to) ? 'px-3 px-lg-3' : 'px-5 px-lg-5'}`}>
                                        <div className="d-flex flex-column align-items-start mr-2">
                                            <span className=''>{deliveryType}</span>
                                            {(shop?.delivery_local_from && shop?.delivery_local_to) ?
                                                <span>Shop delivery time:</span> : null}
                                        </div>
                                        {(shop?.delivery_local_from && shop?.delivery_local_to) ?
                                            <div className='d-flex align-items-end ml-2'>
                                                <span className='text-danger'>
                                                    {moment(shop?.delivery_local_from).subtract(+330, 'm').format('hh:mm A')}-{moment(shop?.delivery_local_to).subtract(+330, 'm').format('hh:mm A')}</span>
                                            </div> : null}
                                    </div>
                                    <div className="d-flex align-items-start">
                                        <i className="fal fa-check-circle color-green font-size-lg" />
                                    </div>
                                </div>

                                <div className="py-1 px-2 h6 shops-group w-85 text-left checkout-title-color">Confirm
                                    delivery address:
                                </div>

                                <div className="d-flex align-items-start justify-content-between p-2 w-500px">
                                    <div className="">
                                        Address:
                                    </div>
                                    <div className="d-flex flex-column align-items-start px-5 px-lg-5">
                                        <span
                                            className='text-left'>{savedUserAddress ? savedUserAddress : deliveryAddress.address}</span>
                                        <span className='text-left'>{deliveryAddress.area}</span>
                                        <span
                                            className='text-left'>{savedUserZipcode ? savedUserZipcode : deliveryAddress.zipcode}</span>
                                        <span
                                            className='text-left'>{savedUserLandmark ? savedUserLandmark : deliveryAddress.landmark}</span>
                                    </div>
                                    <div className="my-auto">
                                        <button className="btn btn-light bg-transparent"
                                            onClick={() => setShowEditDeliveryAddressModal(true)}>
                                            <span className="color-light-blue">
                                                <i className="fa fa-pen" /> Edit </span>
                                        </button>
                                    </div>
                                </div>
                                {invalidAddress ?
                                    <span
                                        className='font-size-2 text-danger my-1 invalid-address'>House no, Flat, Address is required</span> : null}
                                {invalidZipcode ?
                                    <span
                                        className='font-size-2 text-danger my-1 invalid-address'>Zipcode is required</span> : null}
                                <div className='divider w-70 checkout-divider' />

                                <div className="d-flex align-items-start justify-content-between w-500px py-3 px-2">
                                    <div className="">
                                        Choose preferred delivery date & time
                                    </div>
                                    <div className="pr-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input preferred-delivery-checkbox cursor-pointer"
                                                type="checkbox"
                                                checked={preferredDateTime}
                                                onChange={() => {
                                                    setPreferredDateTime(prevState => !prevState)
                                                }} id="defaultCheck1" />
                                        </div>
                                    </div>
                                </div>

                                {preferredDateTime ? <div className='d-flex justify-content-center w-500px px-2 pb-3'>
                                    <DatePicker
                                        className='preferred-date-picker'
                                        showPopperArrow={false}
                                        dateFormat={'yyyy-MM-d'}
                                        minDate={new Date()}
                                        selected={date}
                                        onChange={date => setDate(date)}
                                    />
                                    <div className="dropdown">
                                        <button className="btn btn-time dropdown-toggle" type="button"
                                            id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false">
                                            {time}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                            {timeValues.map(t => (
                                                <span
                                                    className={`dropdown-item ${isDisabledTime(t) ? 'disabled-time' : 'hover-grey'}`}
                                                    key={t}
                                                    onClick={() => setTime(t)}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div> : null}

                                <div className='divider w-70 checkout-divider' />

                                {shop?.features?.notes ? <div className="d-flex flex-column p-2 w-500px">
                                    <span className='text-left mb-2'>
                                        Enter delivery notes:
                                    </span>
                                    <textarea className='checkout-note-area' name="notes" id="notes" cols="50"
                                        rows="5" onChange={e => setNote(e.target.value)} />
                                </div> : null}

                                {shop?.features?.upload && !uploadedImage ? <div className='d-flex w-500px'>
                                    <button className='btn btn-small btn-light'
                                        onClick={() => uploadImageRef.current.click()}>
                                        <i className="fa fa-paperclip fa-rotate-90" aria-hidden="true" />
                                        <input type="file" accept="image/*" ref={uploadImageRef} className='d-none'
                                            onChange={onImgUpload} />
                                    </button>
                                </div> : null}
                                {uploadedImage ? <div className='d-flex w-500px p-2 position-relative'>
                                    <i className="fal fa-times-circle remove-img-btn"
                                        onClick={() => {
                                            setUploadedImage(null);
                                            setUploadedImageFile(null);
                                        }} />
                                    <img src={uploadedImage} alt="uploadedImage" className='uploaded-image' />
                                </div> : null}

                            </div>

                            <div className='confirm-address-fixed-container'>
                                <div
                                    className={`d-flex justify-content-center confirm-address-btn-container ${showButtonShadow ? 'confirm-address-shadow' : ''}`}>
                                    <button className="btn payment-btn" onClick={confirmAddress}>
                                        Confirm Address
                                    </button>
                                </div>
                            </div>
                        </Aux>}

                        {view === PAYMENT &&
                            <div
                                className="container d-flex align-items-start checkout-container justify-content-center">
                                <div
                                    className='payment-menu-container bg-white custom-payment-height flex-column d-flex align-items-center justify-content-start pt-2 pl-4'>
                                    <div className='d-flex justify-content-start w-100 p-3 align-items-center'>
                                        <i className="fal fa-long-arrow-left font-size-25 cursor-pointer"
                                            onClick={() => setView(ORDER_CONFIRMATION)} />
                                        <span className='select-payment-method-label'>Select payment method</span>
                                    </div>
                                    <div className='d-flex w-100 h-100'>
                                        <div className='flex-shrink-0 mr-4 payment-menu h-100 py-4 pl-2'>
                                            <div
                                                className={`payment-menu-item ${selectedMenuItem === 1 ? 'payment-menu-item-selected' : ''}`}
                                                onClick={() => setSelectedMenuItem(1)}>
                                                <img src={require('../../assets/images/Preferred.png')}
                                                    alt="menuImage"
                                                    className='menu-image mr-2' />
                                                <span>Preferred Option</span>
                                            </div>
                                            <div
                                                className={`payment-menu-item ${selectedMenuItem === 2 ? 'payment-menu-item-selected' : ''}`}
                                                onClick={() => setSelectedMenuItem(2)}>
                                                <img src={require('../../assets/images/Card.png')}
                                                    alt="menuImage"
                                                    className='menu-image mr-2' />
                                                <span>Credit / Debit Card</span>
                                            </div>
                                            <div
                                                className={`payment-menu-item ${selectedMenuItem === 3 ? 'payment-menu-item-selected' : ''}`}
                                                onClick={() => setSelectedMenuItem(3)}>
                                                <img src={require('../../assets/images/UPI.png')}
                                                    alt="menuImage"
                                                    className='menu-image mr-2' />
                                                <span>UPI</span>
                                            </div>
                                            <div
                                                className={`payment-menu-item ${selectedMenuItem === 4 ? 'payment-menu-item-selected' : ''}`}
                                                onClick={() => setSelectedMenuItem(4)}>
                                                <img src={require('../../assets/images/Net Banking.png')}
                                                    alt="menuImage"
                                                    className='menu-image mr-2' />
                                                <span>Net Banking</span>
                                            </div>
                                            {codEnabled ? <div
                                                className={`payment-menu-item ${selectedMenuItem === 5 ? 'payment-menu-item-selected' : ''}`}
                                                onClick={onCashMenuItemClicked}>
                                                <img src={require('../../assets/images/Cash.png')} alt="menuImage"
                                                    className='menu-image mr-2' />
                                                <span>Cash</span>
                                            </div> : null}
                                        </div>
                                        {
                                            selectedMenuItem === 1 ? preferredCardContent() : null
                                        }
                                        {
                                            selectedMenuItem === 2 ? addCreditOrDebitCard() : null
                                        }
                                        {
                                            selectedMenuItem === 3 ? upiPay() : null
                                        }
                                        {
                                            selectedMenuItem === 4 ? netBanking() : null
                                        }
                                        {
                                            selectedMenuItem === 5 ? codOrder() : null
                                        }
                                    </div>
                                </div>
                                <div
                                    className='w-30 max-width-500px bg-white d-flex flex-column align-items-center px-4 py-2 custom-payment-height font-size-3'>
                                    <div className="py-1 px-2 h6 shops-group w-100 text-left checkout-title-color">
                                        Select payment option:
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-3 px-1 w-100">
                                        <div className="d-flex align-items-center">
                                            <img src={require('../../assets/images/BayFay Cash.png')} alt="cost"
                                                className='cost-image' />
                                            <span>BayFay Cash</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span>₹ {bayFayCashAmount?.toFixed(2).toString() === '-0.00' ? '0.00' : bayFayCashAmount?.toFixed(2)}</span>
                                            <input type="checkbox"
                                                className="ml-4 preferred-delivery-checkbox cursor-pointer"
                                                checked={isBayFayCash}
                                                onChange={onBayFayCashCheckboxChange} />
                                        </div>
                                    </div>

                                    <div className='divider w-100 checkout-divider' />

                                    <div className="d-flex justify-content-between align-items-center py-3 px-1 w-100">
                                        <div className="d-flex align-items-center">
                                            <img src={require('../../assets/images/Offer.png')} alt="cost"
                                                className='cost-image' />
                                            <span> Promo code </span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            {promoCode?.code?.length > 0 ?
                                                <i className="fal fa-times-circle font-size-15 mr-2 cursor-pointer text-danger"
                                                    onClick={clearPromoCodeAndFetchOrder} /> : null}
                                            <button
                                                className={`btn button-border border-radius-0 ${promoCode?.code?.length > 0 ? 'btn-outline-success solid-border' : 'promo-btn'}`}
                                                onClick={openPromoModal}>
                                                {promoCode?.code?.length > 0 ?
                                                    <Aux>
                                                        <span className='mr-2'>Code Applied</span>
                                                        <i className="fal fa-check-circle" />
                                                    </Aux>
                                                    :
                                                    <Aux>
                                                        <span className='mr-2'>Apply Code</span>
                                                        <i className="far fa-circle" />
                                                    </Aux>}
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className="py-1 px-2 mt-1 h6 shops-group w-100 d-flex justify-content-between checkout-title-color">
                                        <span>Total amount to pay:</span>
                                        <span>₹ {totalAmount}</span>
                                    </div>
                                    <div className='d-flex flex-column w-100 px-2'>
                                        <div className='d-flex justify-content-between mb-3 mt-2 w-100 billing-black-color'>
                                            <span>Item total</span>
                                            <span>₹ {billing.gross_price}</span>
                                        </div>
                                        <div
                                            className='d-flex justify-content-between mb-3 text-secondary w-100 billing-silver-text'>
                                            <span>Delivery Fee</span>
                                            <span>₹ {billing.delivery}</span>
                                        </div>
                                        <div
                                            className='d-flex justify-content-between mb-3 text-secondary w-100 billing-silver-text'>
                                            <span>
                                                <span>Taxes & Charges</span>
                                                <div className="btn-group dropup">
                                                    <button type="button" className="btn btn-light bg-white p-0 ml-3"
                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fal fa-question-circle text-secondary align-self-center cursor-pointer" />
                                                    </button>
                                                    <div className="dropdown-menu width-150px px-2 font-size-2">
                                                        <span className='d-flex flex-column text-secondary'>
                                                            <span className='mb-1 d-flex justify-content-between'>
                                                                <span className='flex-grow-1 line-height-initial'>Shop Packaging charge:</span>
                                                                <span
                                                                    className='flex-shrink-0 text-right'>₹{billing.packaging_price?.toFixed(2)}</span>
                                                            </span>
                                                            <span className='d-flex justify-content-between'>
                                                                <span className='flex-grow-1'>Tax: </span>
                                                                <span
                                                                    className='flex-shrink-0 text-right'>₹{billing.onlyTax?.toFixed(2)}</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </span>
                                            <span>₹ {billing.taxes?.toFixed(2)}</span>
                                        </div>
                                        <div className='divider billing-black-bg w-100 mb-3' />
                                        {((isBayFayCash && +bayFayCashAmount > 0) || promoCode?.id) ?
                                            <Aux>
                                                <div
                                                    className='d-flex justify-content-between mb-3 w-100 font-weight-bold billing-grey-text'>
                                                    <span>Total Amount</span>
                                                    {promoCode?.code_pro_obj?.offer_type === 2 ?
                                                        promoCode.code_pro_obj.value_type === 1 ?
                                                            <span>₹ {(billing.promo_info.offerAmount ? (billing.net_price + billing.promo_info.offerAmount) : billing.net_price)}</span> :
                                                            <span>₹ {(billing.promo_info.offerAmount ? (billing.net_price + billing.promo_info.offerAmount) : billing.net_price)}</span> :
                                                        <span>₹ {billing.net_price?.toFixed(2)}</span>}
                                                </div>
                                                <div className='divider billing-black-bg w-100 mb-3' />
                                            </Aux> : null}
                                        {isBayFayCash && +bayFayCashAmount > 0 ?
                                            <div
                                                className='d-flex justify-content-between mb-3 text-secondary w-100 billing-silver-text'>
                                                <span>BayFay Cash</span>
                                                <span>- ₹ {bayFayCashAmount?.toFixed(2)}</span>
                                            </div> : null}
                                        {promoCode?.id ?
                                            <div
                                                className='d-flex justify-content-between mb-3 text-secondary w-100 billing-silver-text'>
                                                <span>Promo Code (
                                                    {promoCode.code_pro_obj.offer_type === 1 ? 'Cashback' : null}
                                                    {promoCode.code_pro_obj.offer_type === 2 ? 'Discount' : null}
                                                    )</span>
                                                <span>
                                                    {promoCode.code_pro_obj.value_type === 1 ? `₹ ${promoCode.code_pro_obj.code_value}` : ''}
                                                    {promoCode.code_pro_obj.value_type === 2 ? `- ₹ ${billing.promo_info.offerAmount ? billing.promo_info.offerAmount : '0'}` : ''}
                                                </span>
                                            </div> : null}
                                        {((isBayFayCash && +bayFayCashAmount > 0) || promoCode?.id) ?
                                            <div className='divider billing-black-bg w-100 mb-3' /> : null}
                                        <div
                                            className='d-flex justify-content-between mb-3 w-100 font-weight-bold text-black'>
                                            <span>Amount to Pay</span>
                                            <span>₹ {totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                        {view === PAYMENT_SUCCESS &&
                            <div className="payment-success-container">
                                <div className="py-1 px-2 h6 shops-group w-100 text-center checkout-title-color">Order
                                    placed:
                                </div>
                                <div
                                    className="d-flex flex-column align-items-center justify-content-center pt-3 w-100">
                                    <span
                                        className='font-size-3 payment-message'> Thank you for shopping with us, your <br />
                                        order is successfully placed on the shop. <br />
                                        We will keep you update the status on the way.
                                    </span>
                                    <i className="fal fa-check-circle check-payment-icon font-size-50 mt-3" />
                                    <span className="mt-3 font-size-3"> Amount paid: ₹{totalAmount} </span>
                                    <span
                                        className='my-2 font-size-3'>To track the order download the mobile app from store
                                    </span>
                                    <div className='d-flex justify-content-between stores-imgs-container'>
                                        <a href="https://play.google.com/store/apps/details?id=com.bayfay.customer"
                                            target='_blank' rel="noopener noreferrer">
                                            <img src={require('../../assets/images/download_from_play_store.png')}
                                                alt="playStore" className='store-img' />
                                        </a>
                                        <a href="https://apps.apple.com/in/app/bayfay-shop-from-any-shops/id1463215060"
                                            target='_blank' rel="noopener noreferrer">
                                            <img src={require('../../assets/images/download_from_app_store.png')}
                                                alt="appStore"
                                                className='store-img' />
                                        </a>
                                    </div>
                                    <button className="btn order-btn continue-shopping-btn mt-2"
                                        onClick={clearDataAndNavigateToHome}>
                                        Continue shopping
                                    </button>
                                    <button className="btn order-btn track-order-btn mt-3"
                                        onClick={navigateToTrackOrder}>Track order
                                    </button>
                                </div>
                                <div
                                    className="py-1 px-2 h6 shops-group text-left w-100 mt-3 checkout-title-color">
                                    Shop address:
                                </div>
                                {shops.map(shop => (
                                    <div
                                        className="d-flex flex-column align-items-start justify-content-start pl-5 w-100 font-size-3"
                                        key={shop._id}>
                                        {shop.display_name ?
                                            <span className='mb-2 font-weight-bold'>{shop.display_name}:</span> : null}
                                        {shop?.address?.street ?
                                            <span className='mb-2'>{shop.address.street}</span> : null}
                                        {shop?.address?.zipcode && (!shop?.address?.street.includes(shop.address.zipcode)) ?
                                            <span className='mb-2'>{shop.address.zipcode}</span> : null}
                                        {shop?.address?.state && (!shop?.address?.street.includes(shop.address.state)) ?
                                            <span className='mb-2'>{shop.address.state}</span> : null}
                                        {shop?.address?.city && (!shop?.address?.street.includes(shop.address.city)) ?
                                            <span className='mb-2'>{shop.address.city}</span> : null}
                                        {shop?.address?.country && (!shop?.address?.street.includes(shop.address.country)) ?
                                            <span className='mb-2'>{shop.address.country}</span> : null}
                                    </div>
                                ))}
                                <hr />
                            </div>}
                    </div>
                </div>
            </div>
            {(stockVerified !== true || shopVerifying || paymentProcessing) && <RequestSpinner />}
            <EditDeliveryAddressModal show={showEditDeliveryAddressModal}
                clickBackdrop={() => setShowEditDeliveryAddressModal(false)}
                fullAddress={deliveryAddress} />
            <ApplyPromoCode show={showPromoModal} applyCode={applyPromoCode}
                totalAmount={totalAmount}
                closeModal={() => setShowPromoModal(false)} />
            <CreditCardDialog totalAmount={totalAmount} clickBackdrop={() => setShowCreditCardModal(false)}
                show={showCreditCardModal} setDataAndMakePayment={setDataAndMakePaymentWithCard} />
            <BayfayCashAlert show={showBayFayCashAlert}
                mode={bayFayCashAlertMode}
                clickBackdrop={onBayFayAlertReject}
                onConfirm={onBayFayAlertSuccess} />
            <AlertDialog show={showAlertCODDialog} clickBackdrop={() => setShowAlertCODDialog(false)}
                onConfirm={makePaymentWithCOD}
                onReject={() => setShowAlertCODDialog(false)} confirmButtonText={'Confirm'}
                title='Place Order' message='Are you sure you want to place order?' />
            <UpiDialog clickBackdrop={() => setShowUPIModal(false)} show={showUPIModal}
                setUpiIdAndMakePayment={setUpiIdAndMakePayment} totalAmount={totalAmount} />
        </ModalWrapper>
    );
};
export default CheckoutInformation;
