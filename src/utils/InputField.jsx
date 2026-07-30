import React from "react";

function InputField({name, value, label, type, min, max, step, cssClass, labelCss, error, onChange, onClick, placeHolder, touched, id}) {
    return (
        <React.Fragment>
            {label && type !== 'checkbox' && <label htmlFor={id} className={labelCss}>{label}</label>}
            <input type={type}
                   pattern={type === 'number' ? '[0-9]*' : null}
                   id={id}
                   min={type === 'number' ? min ? min : 0 : null}
                   max={type === 'number' ? max ? max : 100 : null}
                   step={type === 'number' ? step ? step : 1 : null}
                   onChange={onChange}
                   value={value}
                   checked={type === 'checkbox' ? value : null}
                   placeholder={placeHolder}
                   className={touched ? `${cssClass} ${error ? 'is-invalid' : 'is-valid'}` : `${cssClass}`}
                   name={name}/>
            {label && type === 'checkbox' && <label htmlFor={id} className={labelCss}>{label}</label>}
            {error && <div className="invalid-feedback">
                {error}
            </div>}
        </React.Fragment>
    );
}

export default InputField;