import React from "react";
import CSSTransition from "react-transition-group/CSSTransition";

import "./ModalWrapper.scss";
import Backdrop from "../Backdrop/Backdrop";

const animationTiming = {
    enter: 1000,
    exit: 1000
};

const modalWrapper = props => {
    const {show, clickBackdrop, showFirst, transparentBackground, headerClickable, fullHeight} = props;

    const stopPropagation = e => e.stopPropagation();

    return (
        <Backdrop show={show} clicked={clickBackdrop} showFirst={showFirst} fullHeight={fullHeight}
                  transparentBackground={transparentBackground} headerClickable={headerClickable}>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={show}
                timeout={animationTiming}
                classNames={{
                    enter: '',
                    enterActive: 'ModalOpen',
                    exit: 'ModalClosed',
                    exitActive: 'ModalClosed'
                }}>
                <div className="Modal position-relative height-max-content" onClick={stopPropagation}>
                    {props.children}
                </div>
            </CSSTransition>
        </Backdrop>
    );
};

export default modalWrapper;
