import React, { ChangeEvent, useEffect, useRef } from "react";
import clsx from "clsx";

interface Props {
  /**
   * checkbox id
   */
  id: string;
  /**
   * checkbox label
   */
  label?: string;
  /**
   * checkbox is large
   */
  large?: boolean;
  /**
   *
   * @returns checkbox id
   */
  onChange?: (event: ChangeEvent) => void;
  /**
   * is checked value
   */
  checked?: boolean;
  /**
   * input is disabled
   */
  isDisabled?: boolean;
  /**
   * is controlled
   * @default false
   */
  isControlled?: boolean;
  /**
   * Define if check box is indeterminated state
   * @default false
   */
  isIndeterminated?: boolean;
}

const Checkbox: React.FC<Props> = ({
  id,
  label,
  large = false,
  onChange,
  checked = false,
  isDisabled = false,
  isControlled = false,
  isIndeterminated = false,
}: Props) => {
  const ref = useRef<HTMLInputElement>(undefined);
  const inputContainerClassName = clsx(
    isDisabled ? "cursor-not-allowed opacity-40" : "opacity-100 hover:cursor-pointer",
  );
  const inputClassName = clsx(
    "rounded-sm border-2 border-solid border-primaryBorder bg-neutralSoftBg text-accentContent hover:cursor-pointer focus:ring-0 focus:ring-offset-0",
    large ? "h-5 w-5" : "h-3.5 w-3.5",
  );
  const handleChange = (e: ChangeEvent) => {
    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    const checkboxRef: HTMLInputElement = ref.current;
    if (checkboxRef) {
      checkboxRef.indeterminate = isIndeterminated;
    }
  }, [isIndeterminated, checked]);

  return (
    <div data-testid="checkbox-container" className={inputContainerClassName}>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={inputClassName}
        onChange={handleChange}
        data-testid="checkbox-input"
        disabled={isDisabled}
        {...(isControlled ? { checked: checked } : { defaultChecked: checked })}
      />
      {label && (
        <label
          htmlFor={id}
          className="ml-3 cursor-pointer text-sm text-primaryDarkContent"
          data-testid="checkbox-label"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
