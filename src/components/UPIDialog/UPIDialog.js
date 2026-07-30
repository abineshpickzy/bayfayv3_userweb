import React, {useState} from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";

const UpiDialog = ({show, clickBackdrop, onlySaveUpi, totalAmount, setUpiIdAndMakePayment}) => {

    const [upiId, setUpiId] = useState('');
    const [invalidInput, setInvalidInput] = useState(false);
    const [saveUpiId, setSaveUpiId] = useState(true);

    const onUpiIdChange = e => {
        setUpiId(e.target.value);
    };

    const makePayment = () => {
        if (upiId?.length > 0) {
            setInvalidInput(false);
            setUpiIdAndMakePayment(upiId, saveUpiId);
            clickBackdrop();
        } else {
            setInvalidInput(true);
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
                    <div className="modal-body w-500px d-flex flex-column align-items-center pt-0">
                        <div className='d-flex justify-content-center px-4'>
                            <span className='d-flex mr-2 flex-shrink-0'>We Accept:</span>
                            <img src={require('../../assets/images/google-pay.png')} alt="googlePay"
                                 className='w-15 mr-3 height-20px'/>
                            <img src={require('../../assets/images/phone_pe.jpg')} alt="phonepe"
                                 className='w-20 mr-3 height-20px'/>
                            <img src={require('../../assets/images/bhim.jpeg')} alt="bhim"
                                 className='w-15 mr-3 height-20px'/>
                            <img src={require('../../assets/images/pockets.png')} alt="pockets"
                                 className='w-15 mr-3 height-20px'/>
                        </div>
                        <div className={`upi-pay-card`}>
                            <div className='mr-4'>
                                <img src={require('../../assets/images/upipay.png')} alt="upipay"
                                     className='upi-pay-img'/>
                            </div>
                            <div className='d-flex flex-column upi-input-wrapper'>
                                <span className='mb-3 text-left'>Enter your UPI ID</span>
                                <input type="text" className='upi-id-input' placeholder='Enter your UPI ID'
                                       value={upiId}
                                       onChange={onUpiIdChange}/>
                            </div>
                        </div>
                        {invalidInput ?
                            <div className='font-size-2 text-danger text-left w-100 pt-2 pl-5 ml-3'>
                                Please enter your UPI ID
                            </div> : null}
                        <div className="w-100 text-center mt-3">
                            {onlySaveUpi ? 'Secure save this UPI ID in order faster next time.' :
                                <div className="form-check cursor-pointer">
                                    <input className="form-check-input" type="checkbox" checked={saveUpiId}
                                           onChange={() => setSaveUpiId(prevState => !prevState)}
                                           id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Secure save this UPI ID in order faster next time.
                                    </label>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="modal-footer border-0 d-flex justify-content-center">
                        <button className="btn btn-light make-payment-btn height-32px align-self-center"
                                onClick={makePayment}>
                            {onlySaveUpi ? 'SAVE ID' : `Make Payment of ₹ ${totalAmount}`}
                        </button>
                    </div>
                </div>
            </div>
        </ModalWrapper>

    );
};

export default UpiDialog;
