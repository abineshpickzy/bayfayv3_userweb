import React, {useEffect, useState} from 'react';
import CSSTransition from "react-transition-group/CSSTransition";
import './CustomDropdown.scss';

const CustomDropdownChild = ({show, item, onSelect, selectedItem, parentSelected}) => {

    const [showChildren, setShowChildren] = useState(false);

    const fullPath = item.parent.concat(`/${item.name}`);

    const onClick = () => {
        onSelect(fullPath);
    };

    useEffect(() => {
        setShowChildren(selectedItem?.includes(item.name));
    }, [selectedItem]);

    return (
        <div className={`child-container ${parentSelected ? 'silver-bg' : ''}`}>
            <CSSTransition
                in={show}
                timeout={300}
                classNames="alert"
                unmountOnExit
                onEnter={() => {
                }}
                onExited={() => {
                }}
            >
                <div
                    className={`child-dropdown ${selectedItem === fullPath ? 'selected-item' : ''} ${parentSelected ? 'silver-bg' : ''}`}
                    onClick={() => onClick(item)}>
                    <span className='value text-truncate font-size-3'>
                            {item.name}
                    </span>
                    <i className={`fal fa-chevron-right menu-icon font-size-3 ${showChildren ? 'rotate' : ''}`}/>
                </div>
            </CSSTransition>
            {item.children && item.children.map(child => (
                <CustomDropdownChild show={showChildren} item={child} onSelect={onSelect}
                                     selectedItem={selectedItem} key={child.parent.concat(`/${child.name}`)}
                                     parentSelected={parentSelected || fullPath === selectedItem}/>
            ))}
        </div>
    );
};

export default CustomDropdownChild;
