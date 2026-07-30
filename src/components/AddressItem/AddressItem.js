import React from 'react';
import './AddressItem.scss';

const AddressItem = ({item, onDelete, onEdit}) => {

    const renderIcon = () => {
        switch (item.type) {
            case 'Work': {
                return (
                    <i className="fal fa-building font-size-25 location-type-icon"/>
                )
            }
            case 'Home': {
                return (
                    <i className="fal fa-home font-size-25 location-type-icon"/>
                )
            }
            default:
                return (
                    <i className="fas fa-map-marker-alt font-size-25 location-type-icon"/>
                )
        }
    };

    return (
        <div className='address-item'>
            <div className='px-3'>
                {renderIcon()}
            </div>
            <div className='d-flex flex-column'>
                <span className='font-weight-bold address-type-label'>{item.type}</span>
                <span className='font-size-3 address-color'>
                    <span>{[item.address.area, item.address.street, item.address.zipcode, item.address.landmark]
                        .filter(a => a?.toString().length > 0).join(', ')}</span>
                </span>
                <div className='d-flex align-items-center mt-2'>
                    <button className="btn delete-address-btn" onClick={() => onDelete(item)}>
                        Delete
                    </button>
                    <button className="btn edit-address-btn" onClick={() => onEdit(item)}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressItem;
