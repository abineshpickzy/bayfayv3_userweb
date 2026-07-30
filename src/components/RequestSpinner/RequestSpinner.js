import React from 'react';
import './RequestSpinner.scss';

const RequestSpinner = (props) => {
    return (
        <div className='position-absolute request-spinner'>
            <div className="spinner-border text-dark" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};
export default RequestSpinner;
