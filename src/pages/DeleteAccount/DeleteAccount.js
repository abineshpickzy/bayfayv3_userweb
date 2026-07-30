import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Aux from "../../utils/auxilary";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import RequestSpinner from "../../components/RequestSpinner/RequestSpinner";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import history from "../../utils/history";
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";

const REASONS = [
    "I don't use it anymore",
    "Privacy concerns",
    "Switching to another service",
    "Too many issues / bugs",
    "Other"
];

const DeleteAccount = () => {
    const isGuest = useSelector(state => state.authReducer.isGuest);
    const { sendRequest, isLoading } = useHttp();
    const apiEndpoints = new ApiEndpoints();

    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [extraNote, setExtraNote] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const [mobileError, setMobileError] = useState('');

    const reason = selectedReason
        ? (extraNote.trim() ? `${selectedReason} - ${extraNote.trim()}` : selectedReason)
        : extraNote.trim();

    const validateMobile = (value) => {
        if (!value.trim()) return 'Mobile number is required.';
        if (!/^[0-9]{10}$/.test(value.trim())) return 'Please enter a valid 10-digit mobile number.';
        return '';
    };

    const handleSubmit = () => {
        const mobileErr = validateMobile(mobile);
        setMobileError(mobileErr);
        if (mobileErr) return;
        if (!selectedReason) return;
        if (selectedReason === 'Other' && !extraNote.trim()) return;
        setShowConfirm(true);
    };

    const onConfirm = () => {
        setShowConfirm(false);
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().user.deleteAccountRequest(
            reason, mobile.trim(), email.trim()
        );
        sendRequest(url, method, body, success, error,
            (res) => {
                setMessage(res.message);
                setShowSuccess(true);
                setMobile('');
                setEmail('');
                setSelectedReason('');
                setExtraNote('');
                setTimeout(() => {

                    history.push("/home");

                }, 3000);

            },
            () => {
                setMessage('Something went wrong. Please try again.');
                setShowError(true);
            }
        );
    };

    const isSubmitDisabled = !mobile.trim() || !selectedReason || isLoading ||
        (selectedReason === 'Other' && !extraNote.trim());

    return (
        <Aux>
            <CustomHeader title={'DELETE ACCOUNT'} />
            <div className='d-flex justify-content-center static-page-bg'>
                {isGuest === false ? <NavigationMenu /> : null}
                <div className='max-width-800px w-100 py-3 px-2'>

                    <span className='profile-label mb-3'>Delete Account</span>

                    <div className='d-flex align-items-start bg-lightest-orange border-radius-0 p-3 mb-3 mt-3'>
                        <i className='fas fa-exclamation-triangle color-orange mr-2 mt-1' />
                        <p className='font-size-2 mb-0'>
                            Once your account is deleted, all your data including orders, addresses and payment history will be <strong>permanently removed</strong>. This action cannot be undone.
                        </p>
                    </div>

                    <div className='user-profile flex-column'>

                        {/* Mobile Number */}
                        <div className='d-flex flex-column mb-3'>
                            <label className='font-size-3 font-weight-bold mb-1'>
                                Mobile Number <span className='color-red'>*</span>
                            </label>
                            <input
                                type='tel'
                                className='form-control border-radius-0'
                                placeholder='Enter your registered mobile number'
                                value={mobile}
                                maxLength={10}
                                onChange={e => {
                                    setMobile(e.target.value);
                                    setMobileError('');
                                }}
                            />
                            {mobileError &&
                                <p className='font-size-2 color-red mb-0 mt-1'>{mobileError}</p>
                            }
                        </div>

                        {/* Email */}
                        <div className='d-flex flex-column mb-3'>
                            <label className='font-size-3 font-weight-bold mb-1'>
                                Email Address <span className='font-size-2 text-muted'>(optional)</span>
                            </label>
                            <input
                                type='email'
                                className='form-control border-radius-0'
                                placeholder='Enter your registered email address'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Reason */}
                        <p className='font-size-3 font-weight-bold mb-1'>
                            Reason for deletion <span className='color-red'>*</span>
                        </p>
                        <p className='font-size-2 text-muted mb-3'>Help us understand why you're leaving. Your feedback is valuable to us.</p>

                        <div className='d-flex flex-column mb-3'>
                            {REASONS.map((r) => (
                                <label key={r} className='d-flex align-items-center font-size-3 mb-2 cursor-pointer'>
                                    <input
                                        type='radio'
                                        name='deleteReason'
                                        value={r}
                                        checked={selectedReason === r}
                                        onChange={() => setSelectedReason(r)}
                                        className='mr-2'
                                    />
                                    {r}
                                </label>
                            ))}
                        </div>

                        <textarea
                            className='form-control border-radius-0 mb-1'
                            rows={3}
                            placeholder={selectedReason === 'Other' ? 'Please describe your reason...' : 'Tell us more (optional)...'}
                            value={extraNote}
                            onChange={e => setExtraNote(e.target.value)}
                        />
                        {selectedReason === 'Other' && !extraNote.trim() &&
                            <p className='font-size-2 color-red mb-3'>Please describe your reason for deletion.</p>
                        }

                        <div className='d-flex justify-content-end mt-3'>
                            <button
                                className='btn border-radius-0 mr-2'
                                onClick={() => {

                                    history.push("/home");

                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className='btn btn-danger border-radius-0'
                                disabled={isSubmitDisabled}
                                onClick={handleSubmit}
                            >
                                <i className='fas fa-trash mr-2' />
                                Submit Deletion Request
                            </button>
                        </div>
                    </div>

                    {isLoading && <RequestSpinner />}
                </div>
            </div>

            <SuccessModal show={showSuccess} clickBackdrop={() => setShowSuccess(false)} message={message} />
            <ErrorModal show={showError} clickBackdrop={() => setShowError(false)} message={message} />
            <AlertDialog
                show={showConfirm}
                clickBackdrop={() => setShowConfirm(false)}
                title={'Delete Account'}
                message={'Are you sure you want to delete your account? This action cannot be undone.'}
                confirmButtonText={'Yes, Delete'}
                onConfirm={onConfirm}
                onReject={() => setShowConfirm(false)}
                isLoading={isLoading}
            />
        </Aux>
    );
};

export default DeleteAccount;