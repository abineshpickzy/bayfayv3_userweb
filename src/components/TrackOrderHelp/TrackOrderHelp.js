import React, { useEffect, useState } from 'react';
import CSSTransition from "react-transition-group/CSSTransition";
import './TrackOrderHelp.scss';
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import Loader from "../Loader/Loader";
import Aux from "../../utils/auxilary";
import SupportModal from "../SupportModal/SupportModal";

const animationTiming = {
    enter: 1000,
    exit: 1000
};

const TrackOrderHelp = ({ closeModal, show, orderId }) => {
    const apiEndpoints = new ApiEndpoints();
    const { sendRequest } = useHttp();

    const [isLoading, setIsLoading] = useState(false);
    const [helpData, setHelpData] = useState(null);
    const [helpContent, setHelpContent] = useState(new Map());
    const [showSupportModal, setShowSupportModal] = useState(false);

    useEffect(() => {
        if (show) {
            getHelpTitles();
        }
    }, [show]);

    const getHelpTitles = () => {
        setIsLoading(true);
        const { url, method, body } = apiEndpoints.getApiEndpoints().orderHelp.getTitles(orderId);
        sendRequest(url, method, body, null, null, response => {
            if (response.success) {
                setHelpData(response.data);
                response.data.titles.forEach((title, index) => {
                    let isLast = index === (response.data.titles.length - 1);
                    getHelpContent(title._id, isLast);
                })
            }
        });
    };

    const getHelpContent = (titleId, isLast) => {
        const { url, method, body } = apiEndpoints.getApiEndpoints().orderHelp.getHelpContent(titleId);
        sendRequest(url, method, body, null, null, response => {
            isLast && setIsLoading(false);
            helpContent.set(titleId, response.data.content);
        });
    };

    const openSupportModal = () => {
        setShowSupportModal(true);
    };

    return (
        <div onClick={closeModal}
            className={`promo-code-container billing-details-container ${show ? 'promo-code-container-open' : 'promo-code-container-closed'}`}>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={show}
                timeout={animationTiming}
                classNames={{
                    enter: '',
                    enterActive: 'modalOpen',
                    exit: 'modalClosed',
                    exitActive: 'modalClosed'
                }}>
                <div
                    className="position-fixed apply-promo-container apply-promo-container-modal d-flex flex-column help-modal"
                    onClick={e => e.stopPropagation()}>
                    <div className="closeModalIcon d-flex justify-content-start position-absolute close-help-modal">
                        <button className='btn border-0 bg-white' onClick={closeModal}>
                            <i className="fal fa-times font-size-15" />
                        </button>
                    </div>
                    <span className='to-help-title'>
                        Help
                    </span>
                    {isLoading ? <Loader /> :
                        <Aux>
                            <div id="accordion" className='help-content'>
                                {helpData?.titles.map(title => (
                                    <div className="card" key={title._id}>
                                        <div className="card-header py-1 bg-white" id={`heading-${title._id}`}>
                                            <div className="btn expand-collapse-btn" data-toggle="collapse"
                                                data-target={`#collapse${title._id}`} aria-expanded="false"
                                                aria-controls={`collapse${title._id}`}>
                                                <span className='text-left'>{title.display_name}</span>
                                                <i className="fal fa-chevron-up" />
                                                <i className="fal fa-chevron-down" />
                                            </div>
                                        </div>

                                        <div id={`collapse${title._id}`} className="collapse"
                                            aria-labelledby={`heading-${title._id}`}
                                            data-parent="#accordion">
                                            <div className="card-body font-size-3">
                                                <div dangerouslySetInnerHTML={{
                                                    __html: helpContent.get(title._id)?.substring(
                                                        helpContent.get(title._id).lastIndexOf('<body>') + 6,
                                                        helpContent.get(title._id).lastIndexOf("</body>")
                                                    )
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='help-actions'>
                                <span className='help-action mr-4' data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                    <i className="fas fa-phone" />
                                </span>
                                <div className="dropdown-menu width-150px px-2 font-size-3 text-center">
                                    {helpData?.help?.dialing_code} {helpData?.help?.number}
                                </div>
                                <span className='help-action ml-4' onClick={openSupportModal}>
                                    <i className="fal fa-envelope" />
                                </span>
                            </div>
                        </Aux>}
                    <SupportModal show={showSupportModal} clickBackdrop={() => setShowSupportModal(false)} />
                </div>
            </CSSTransition>
        </div>
    );
};

export default TrackOrderHelp;
