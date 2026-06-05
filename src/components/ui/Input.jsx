import { forwardRef, useId } from "react";
import { InputShake } from "./InputShake";

const Input = forwardRef(({ label, type = "text", placeholder = "Enter something", star = false, className = "", shake = false, shakeKey, errorMessage, hasError = false, inputShakeOnCancel, ...attributes }, ref) => {
      const id = useId();
      return (
            <div className="col-span-2">
                  {label && (
                        <label htmlFor={id} className="text-sm font-medium text-[var(--color-bl)]">
                              {label} {star && <span className="text-red-500">*</span>}
                        </label>
                  )}
                  <InputShake shake={shake} shakeKey={shakeKey} message={errorMessage} isError={hasError} onCancel={inputShakeOnCancel}>
                        <input ref={ref} id={id} className={`w-full py-2 block border-none bg-transparent transition-all rounded outline-none ${className}`} type={type} placeholder={placeholder} {...attributes} />
                  </InputShake>
            </div>
      );
});
Input.displayName = "Input";

export default Input;
