import React from 'react';
import ShopItem from "../Shop-item/ShopItem";
import Aux from "../../utils/auxilary";
import './ShopItems.scss';

const itemsInRow = 6;

const ShopItems = ({ shopsObject, title, staticImagePrefix, showCount, isPrivate, isOtherLocationShop, isPublic, isBranded }) => {
    const { shops, count } = shopsObject;
    let numberOfStaticItems = 6;

    if (count > 0) {
        numberOfStaticItems = count % itemsInRow === 0 ? 0 : (itemsInRow - (count % itemsInRow));
    }

    const renderStaticShops = () => {
        const staticShop = {
            display_name: 'Static'
        };
        return Array.from(Array(numberOfStaticItems).keys()).map(num => (
            <ShopItem staticImagePrefix={staticImagePrefix} shop={staticShop}
                staticImageIndex={num + 1 + (itemsInRow - numberOfStaticItems)} key={num} isStatic={true} />
        ));
    };

    return (
        <Aux>
            <div className="px-2 py-1 mb-1 h6 shops-group">
                {title}
                <div className="btn-group dropup ml-2">
                    <button type="button" className="btn btn-light p-0 ml-2 tooltip-btn"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fal fa-question-circle align-self-center cursor-pointer" />
                    </button>
                    <div className="dropdown-menu width-200px px-2 font-size-2">
                        {isPrivate ? <span>
                            Purchase products from your favourite shop
                        </span> : isPublic ? <span>
                            Find the lowest price for the products from different shops
                        </span> : isBranded ? <span>
                            Find the branded products in best deals
                        </span> : isOtherLocationShop ? <span>
                            Find the global products in best deals
                        </span> : null}
                    </div>
                </div>
            </div>
            <div className='row'>
                {shops.map(shop => {
                    return <ShopItem shop={shop} key={shop.stores[0]} showCount={showCount} isPrivate={isPrivate}
                        isOtherLocationShop={isOtherLocationShop} />
                })}
                {renderStaticShops()}
            </div>
        </Aux>
    );
};
export default ShopItems;
