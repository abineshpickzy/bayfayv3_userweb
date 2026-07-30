import React from 'react';
import './Loader.scss';

const Loader = () => {
    return (
        <div className='loader-container'>
            <div className="spinner-border text-dark" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
