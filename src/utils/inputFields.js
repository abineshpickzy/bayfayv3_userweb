import {SINGLE_CHARACTER_REGEX, SINGLE_DIGIT_REGEX} from "./regEx";

export const inputField = ({value, isRequired, regEx, type, min, max}) => {
    return {
        value: value === false ? value : value || '',
        isRequired: isRequired || true,
        regEx: type ? type === 'number' ? SINGLE_DIGIT_REGEX : regEx || SINGLE_CHARACTER_REGEX : regEx === null ? null : regEx || SINGLE_CHARACTER_REGEX,
        type: type || 'text',
        touched: false,
        isValid: isRequired,
        min: type === 'number' ? min ? min : 0 : null,
        max: type === 'number' ? max ? max : 100 : null
    }
};
