import { forwardRef, useId } from "react";

const Input = forwardRef(({ label, type = "text", placeholder = "Enter something", star = false, className = "", ...attributes }, ref) => {
      const id = useId();
      return (
            <div className="col-span-2">
                  {label && (
                        <label htmlFor={id} className="text-sm font-medium text-[var(--color-bl)]">
                              {label} {star && <span className="text-red-500">*</span>}
                        </label>
                  )}
                  <input ref={ref} id={id} className={`w-full py-2 block border-b-2 focus:border-b-blue-500 transition-all rounded outline-none ${className}`} type={type} placeholder={placeholder} {...attributes} />
            </div>
      );
});
Input.displayName = "Input";

export default Input;
