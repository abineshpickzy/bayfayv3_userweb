import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <div className='footer-container'>
            <div className='footer-content font-size-3'>
                <div className='d-flex flex-column px-2 footer-column'>
                    <span className='footer-title'>Company</span>
                    <a href={`${window.location.origin}/about-us`} target={'_blank'} rel="noopener noreferrer">
                        About us
                    </a>
                    <a href="#">Blog</a>
                </div>
                <div className='d-flex flex-column px-2 footer-column'>
                    <span className='footer-title'>Contact</span>
                    <a href={`${window.location.origin}/partner`} target={'_blank'} rel="noopener noreferrer">Partner
                        with us</a>
                    <a href={`${window.location.origin}/faq`} target={'_blank'} rel="noopener noreferrer">FAQ</a>
                    <a href={`${window.location.origin}/help`} target={'_blank'} rel="noopener noreferrer">Help</a>
                </div>
                <div className='d-flex flex-column px-2 footer-column'>
                    <span className='footer-title'>Softwares</span>
                    <a href="https://play.google.com/store/apps/details?id=com.bayfay.merchant" target='_blank' rel="noopener noreferrer">Merchant App</a>
                    <a href="https://play.google.com/store/apps/details?id=com.bayfay.customer" target='_blank' rel="noopener noreferrer">Customer App</a>
                    <a href="https://play.google.com/store/apps/details?id=com.bayfay.delivery" target='_blank' rel="noopener noreferrer">Delivery App</a>
                    <a href={`${window.location.origin}/merchant-help`} target='_blank' rel="noopener noreferrer">Merchant Help</a>
                    <a href={`${window.location.origin}/api`} target={'_blank'} rel="noopener noreferrer">API
                        Document</a>
                </div>
                <div className='d-flex flex-column px-2 footer-column'>
                    <span className='footer-title'>Terms</span>
                    <a href={`${window.location.origin}/terms`} target={'_blank'} rel="noopener noreferrer">Terms &
                        Conditions</a>
                    <a href={`${window.location.origin}/cancellation`} target={'_blank'} rel="noopener noreferrer">Cancellation
                        & Refund</a>
                    <a href={`${window.location.origin}/merchant-policy`} target={'_blank'} rel="noopener noreferrer">Merchant
                        Policy</a>
                    <a href={`${window.location.origin}/privacy`} target={'_blank'} rel="noopener noreferrer">Privacy
                        Policy</a>
                </div>
                <div className='d-flex flex-column align-items-center px-2 footer-column'>
                    <a href="https://apps.apple.com/in/app/bayfay-shop-from-any-shops/id1463215060" target='_blank'
                       className='text-right' rel="noopener noreferrer">
                        <img src={require('../../assets/images/download_from_app_store.png')} alt="store"
                             className='footer-store-img'/>
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.bayfay.customer" target='_blank'
                       className='text-right' rel="noopener noreferrer">
                        <img src={require('../../assets/images/download_from_play_store.png')} alt="store"
                             className='footer-store-img'/>
                    </a>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <a className='social-img-holder' href='https://twitter.com/BayFay' target='_blank'
                   rel="noopener noreferrer">
                    <img src={require('../../assets/images/twitter.png')} alt="twitter" className='social-img'/>
                </a>
                <a className='social-img-holder' href='https://www.instagram.com/bayfay.stores/' target='_blank'
                   rel="noopener noreferrer">
                    <img src={require('../../assets/images/instagram.png')} alt="twitter" className='social-img'/>
                </a>
                <a className='social-img-holder' href='https://www.linkedin.com/company/bayfay' target='_blank'
                   rel="noopener noreferrer">
                    <img src={require('../../assets/images/linkedin.png')} alt="twitter" className='social-img'/>
                </a>
                <a className='social-img-holder' href='https://www.facebook.com/bayfay.stores' target='_blank'
                   rel="noopener noreferrer">
                    <img src={require('../../assets/images/facebook.png')} alt="twitter" className='social-img'/>
                </a>
                <a className='social-img-holder' href='https://www.youtube.com/channel/UCXzDVr9NAIZfUBpsSnodUUg/'
                   target='_blank' rel="noopener noreferrer">
                    <img src={require('../../assets/images/youtube.png')} alt="twitter" className='social-img'/>
                </a>
            </div>
        </div>
    );
};

export default Footer;
