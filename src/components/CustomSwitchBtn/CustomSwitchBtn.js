import React from 'react';
import './CustomSwitchBtn.scss';

const CustomSwitchBtn = ({checked}) => {
    return (
        <div className='switch-btn'>
            <span className={`${checked ? 'checked' : 'unchecked'}`}/>
        </div>
    );
};

export default CustomSwitchBtn;
