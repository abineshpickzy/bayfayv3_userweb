import {useCallback, useEffect, useState} from "react";

const useForm = (inputs, callback) => {
    const [values, setValues] = useState(inputs);
    const [isDirty, setIsDirty] = useState(false);
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const isValid = Object.keys(values).map(key => values[key].isValid).every(value => value === true);
        setIsValid(isValid);
    }, [values, setIsValid]);

    const clear = useCallback(() => {
        setValues(inputs);
        setErrors({});
        setIsValid(false);
        setIsDirty(false);
    }, [setValues, setIsValid, setIsDirty]);

    const validate = useCallback((name, value) => {
        let isValueValid = true;
        let error = undefined;
        if (values[name].isRequired && !values[name].regEx.test(value)) {
            isValueValid = false;
            error = `Field '${name}' must not be empty!`;
        }
        if (values[name].type === 'number') {
            let min = values[name].min;
            let max = values[name].max;
            if (value < min || max < value) {
                error = `You entered an invalid value! Values must be between ${min} and ${max}`;
                isValueValid = false;
            }
        }
        if (values[name].type === 'checkbox' && values[name].isRequired) {
            if (value === false) {
                error = `This field is required`;
                isValueValid = false;
            }
        }

        setErrors(prevState => ({
            ...prevState,
            [name]: error
        }));
        setValues(prevState => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                isValid: isValueValid
            }
        }));
    }, [setErrors, setValues]);

    const onChange = useCallback((event) => {
        let {name, value: newValue} = event.target;
        if (values[name].type === 'checkbox') {
            newValue = event.target.checked;
        }
        setValues(prevState => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                value: newValue,
                touched: true
            }
        }));
        validate(name, newValue);
    }, [values, setValues, validate]);

    return {
        values,
        errors,
        onChange,
        isDirty,
        isValid,
        clearValues: clear
    }
};

export default useForm;
