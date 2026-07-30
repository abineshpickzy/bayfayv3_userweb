import React from 'react';
import './Backdrop.scss';

const backdrop = (props) => {
    const {show, clicked, showFirst, transparentBackground, headerClickable, fullHeight} = props;
    const cssClasses = ['Backdrop', show ? 'BackdropOpen' : 'BackdropClosed'];
    showFirst && cssClasses.push('z-index-9999999');
    fullHeight && cssClasses.push('p-0');
    transparentBackground ? cssClasses.push('transparentBg') : cssClasses.push('defaultBg');
    headerClickable ? cssClasses.push('header-clickable') : cssClasses.push('header-not-clickable');
    return <div onClick={clicked} className={cssClasses.join(' ')}>{props.children}</div>;
};

export default backdrop;
