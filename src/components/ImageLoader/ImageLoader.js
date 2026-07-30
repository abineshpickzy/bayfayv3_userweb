import React, {useEffect, useState} from 'react';
import './ImageLoader.scss';

const ImageLoader = ({small, cssClass, customSize}) => {
    const [color, setColor] = useState(0);

    useEffect(() => {
        setColor(Math.floor(Math.random() * 5) + 1);
    }, []);

    return (
        <div
            className={`image-loader image-bg-${color} ${customSize ? '' : small ? 'w-70px' : 'wh-8rem'} ${cssClass ? cssClass : ''}`}/>
    );
};
export default ImageLoader;
