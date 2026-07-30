import React, {useEffect, useState} from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import {NUMBER_REGEX} from "../../utils/regEx";
import {PaymentUtils, UNKNOWN_CARD_TYPE, validateCardExpirationDate} from "../../utils/PaymentUtils";

const CreditCardDialog = ({show, clickBackdrop, totalAmount, setDataAndMakePayment, onlySaveCard}) => {

    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [saveCard, setSaveCard] = useState(true);
    const [expirationDate, setExpirationDate] = useState('');
    const [cardType, setCardType] = useState(UNKNOWN_CARD_TYPE);
    const [isCardInfoValid, setIsCardInfoValid] = useState(true);

    useEffect(() => {
        const ct = PaymentUtils.getCardType(cardNumber);
        if (cardNumber?.length > 0 && cardType !== ct) {
            setCardType(ct);
        } else if (cardNumber?.length === 0 && cardType !== UNKNOWN_CARD_TYPE) {
            setCardType(UNKNOWN_CARD_TYPE);
        }
    }, [cardNumber]);

    const onCardNumberChange = e => {
        setCardNumber(e.target.value);
    };

    const onCvvChange = e => {
        setCvv(e.target.value);
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

    const cardInputsValid = (cardNum, cardExp, cardCvv) => {
        const cvvValid = cardCvv?.length === 3;
        const expirationDateValid = validateCardExpirationDate(cardExp);
        const cardNumberValid = cardNum?.length === 16;
        setIsCardInfoValid(cvvValid && expirationDateValid && cardNumberValid);
        return cvvValid && expirationDateValid && cardNumberValid;
    };

    const makePayment = () => {
        if (cardInputsValid(cardNumber, expirationDate, cvv)) {
            setDataAndMakePayment(cardNumber, expirationDate, cvv, saveCard);
        }
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px pt-0">
                        <div className='p-1'>
                            <div
                                className="d-flex align-items-center flex-grow-1 h-100 px-4 pb-0 flex-column">
                                <div className={`cred-card ${!isCardInfoValid ? 'invalid-card' : ''}`}>
                                    {
                                        (!cardType || cardType === UNKNOWN_CARD_TYPE) ?
                                            <i className="fab fa-cc-mastercard color-red mastercard-icon mx-3 mt-4 flex-shrink-0"/> :
                                            <img src={require(`../../assets/images/${cardType.toLowerCase()}.png`)}
                                                 className='card-type-img mx-2 mt-3 flex-shrink-0' alt="card"/>
                                    }
                                    <div className='d-flex flex-column w-75 px-2 py-3 align-items-start'>
                                        <span className='mb-2'>Credit / Debit Card</span>
                                        <input type="text" className='card-number-input mb-1' placeholder='Card Number'
                                               value={cardNumber} onChange={onCardNumberChange} maxLength={16}/>
                                        <div
                                            className='d-flex justify-content-between align-items-center exp-date-cvv-container pt-2'>
                                            <input type="text" className='expiration-date-input' placeholder='Exp. date'
                                                   value={expirationDate} onChange={onExpirationDateChange}
                                                   maxLength={5}/>
                                            <div className='d-flex align-self-center'>
                                                <input className='cvv' placeholder='CVV' value={cvv} maxLength={3}
                                                       onChange={onCvvChange}/>
                                                <button type="button" className="btn btn-light p-0 ml-3"
                                                        data-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">
                                                    <i className="fal fa-question-circle align-self-center cursor-pointer"/>
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
                                {!onlySaveCard ? <div className='py-4'>
                                    <div className="form-check cursor-pointer">
                                        <input className="form-check-input" type="checkbox" checked={saveCard}
                                               onChange={() => setSaveCard(prevState => !prevState)}
                                               id="defaultCheck1"/>
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Secure save this card to order faster next time
                                        </label>
                                    </div>
                                </div> : null}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 d-flex justify-content-center">
                        <button className="btn btn-light make-payment-btn height-32px align-self-center"
                                onClick={makePayment}>
                            {onlySaveCard ? 'Save Card' : `Make Payment of ₹ ${totalAmount}`}
                        </button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CreditCardDialog;
