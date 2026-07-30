import React from 'react';
import './FixedFooter.scss';

const FixedFooter = () => {
    return (
        <div className='fixed-footer-container font-size-3'>
            Copyright @2026 BayFay
            <h1 className='h1-hidden'> BayFay </h1>
            <span className='powered-by-label'>
                <span className='silver-text mr-1'>powered by</span>
                <span className='color-black font-weight-bold'>PickZy</span>
            </span>
        </div>
    );
};

export default FixedFooter;
