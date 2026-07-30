import React, {useEffect, useState} from 'react';
import './TextAd.scss'
import {fetchImage} from "../../utils/imageUtils";
import ImageLoader from "../ImageLoader/ImageLoader";

const TextAd = ({ad, onClick}) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        let imageUrl = `/category/view/img?img=${ad.private_icon}&format=jpeg&width=400&height=400&is_web=1`;
        let isCanceled = false;
        if (!isCanceled) {
            fetchImage(imageUrl)
                .then(response => {
                    const base64 = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    );
                    if (!isCanceled) {
                        setImage("data:;base64," + base64);
                    }
                })
                 .catch(err => console.log(err));
        }
        return () => {
            isCanceled = true;
        }
    }, []);

    return (
        <div className='text-ad-container' onClick={() => onClick(ad.unique_id)}>
            {image ? <img src={image} className='ad-shop-img' alt="ad_img"/> :
                <ImageLoader cssClass='wh130px rounded-10px' customSize={true}/>}
            <div className='p-2 d-flex flex-column flex-grow-1 ad-details'>
                <span className='font-weight-bold mb-2'>{ad.shop_name}</span>
                <span className='font-size-3 silver-text'>
                    {ad?.text_ad_info?.ad_content}
                </span>
            </div>
        </div>
    );
};

export default TextAd;
