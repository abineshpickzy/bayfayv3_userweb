import React, { useEffect } from 'react';
import './AboutUs.scss'
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import Aux from "../../utils/auxilary";

const AboutUs = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <Aux>
            <CustomHeader title={'ABOUT US'} />
            <div className='d-flex justify-content-center static-page-bg about-us-content'>
                <div className='max-width-800px w-100 font-size-3 py-2'>
                    <div className='font-size-1-4rem font-weight-bold py-2'>BayFay is the story of a boy!</div>
                    <div className='font-size-1-1rem'>
                        <p>
                            In 1998, a school boy was more interested in learning Electronics and Mechanical Engines, he
                            will try experiments in the home and for that, he will travel 18 kilometers to buy
                            electronic components and books, he doesn’t know whether those components and books are
                            available in his small town. But still, he travels and checks on all the available shops.
                            Sometimes the bookstores ordered the book for him. And from here the idea to clone the shop
                            online begins, and he created the first virtual Automobile shop in 2002 as his College
                            project.
                        </p>
                        <p>
                            If we get all the components, books and materials whatever we need in our life from
                            anywhere, we could have many inventors, and many people can save their time and many
                            merchants can sell their products to the end of the world.
                        </p>
                        <p>
                            This advanced technology platform can take virtual copy of any Physical shop and even Restaurants anywhere in this world. People can see and buy from the shop whatever they are looking to buy.
                        </p>
                        <p>
                            BayFay will make everybody's life easier and valuable.
                        </p>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default AboutUs;
