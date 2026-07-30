import React, { useEffect, useState } from 'react';
import CustomDropdownChild from "./CustomDropdownChild";
import Aux from "../../utils/auxilary";
import './CustomDropdown.scss';

const CustomDropdown = ({ items, onSelect, preSelected, allValue }) => {

    const [expanded, setExpanded] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (items[0].name !== 'All') {
            allValue && items.unshift({ name: 'All', parent: '', children: [] });
        }
        if (preSelected && !initialized) {
            setSelectedItem(preSelected);
            setInitialized(true);
        }
    }, [items]);


    const onSelectItem = itemName => {
        setSelectedItem(itemName);
        onSelect(itemName);
    };

    const onClick = (item) => {
        if (expanded === item.name) {
            setExpanded(null);
        } else {
            setExpanded(item.name);
        }
        setSelectedItem(item.name);
        onSelect(item.name)
    };

    return (
        <Aux>
            {items.map(item =>
                <Aux key={item.name}>
                    <div className={`custom-dropdown ${selectedItem === item.name ? 'selected-item' : ''}`}
                        onClick={() => onClick(item)}>
                        <span className='value text-truncate font-size-3'>
                            {item.name}
                        </span>
                        {item.name !== 'All' &&
                            <i className={`fal fa-chevron-right font-size-3 menu-icon ${expanded === item.name ? 'rotate' : ''}`} />
                        }
                    </div>
                    {
                        item.children?.map(child =>
                            <CustomDropdownChild show={selectedItem?.includes(item.name)} selectedItem={selectedItem}
                                item={child} onSelect={onSelectItem}
                                key={child.parent.concat(`/${child.name}`)}
                                parentSelected={item.name === selectedItem} />
                        )
                    }
                </Aux>
            )}
        </Aux>
    );
};

export default CustomDropdown;
