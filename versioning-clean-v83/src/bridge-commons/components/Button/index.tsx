import React, { MouseEvent, useRef, useState } from "react";
import { camelize } from "~/helpers/global";
import { useAnalytics } from "~/hooks/useAnalytics";
import clsx from "clsx";

import Icon from "../Icon";
import LoaderSpinner from "../LoaderSpinner";
import { LoaderSpinnerSize } from "../LoaderSpinner/types";
import styles from "./styles";
import { ButtonIconPosition, ButtonSize, ButtonStyle, ButtonVariant } from "./types";

import { AnalyticsData } from "@bridge-types";

interface Props {
  /**
   * Set the button label
   */
  label?: string;
  /**
   * Handler executed while button is clicked
   */
  onClick: (e: MouseEvent<HTMLElement>) => void;
  /**
   * Set if button is disabled
   */
  isDisabled?: boolean;
  /**
   * Set if button is pending during query or mutation
   */
  isPending?: boolean;
  /**
   * Set icon on button
   */
  icon?: React.FC;
  /**
   * Set icon position on button
   */
  iconPosition?: ButtonIconPosition;
  /**
   * Define if the icon must be filled with color
   */
  iconFilled?: boolean;
  /**
   * Define if the icon must be stroked with color
   */
  iconStroked?: boolean;
  /**
   * Replace the default icon size classes
   */
  iconSizeClassName?: string;
  /**
   * Set if button is in fullwidth
   */
  isFullWidth?: boolean;
  /**
   * Set if button is rounded
   */
  isRounded?: boolean;
  /**
   * Set button size
   */
  size?: ButtonSize;
  /**
   * Set button style
   */
  style?: ButtonStyle;
  /**
   * Set button variant
   */
  variant?: ButtonVariant;
  /**
   * Set if tooltip on label
   */
  tooltipLabel?: string;
  /**
   * Set if dataTest
   */
  dataTest?: string;
  /**
   * To display tooltip
   */
  onMouseOver?: () => void;
  /**
   * Analytics object to send event to segment
   */
  analyticsData?: AnalyticsData;
  /**
   * Display this string instead of label for 5s on click if not null
   */
  onClickMessage?: string;
}

const Button: React.FC<Props> = ({
  label = "",
  onClick,
  isDisabled = false,
  isPending = false,
  style = ButtonStyle.Primary,
  size = ButtonSize.Medium,
  variant = ButtonVariant.Solid,
  isFullWidth = false,
  isRounded = false,
  icon,
  iconPosition = ButtonIconPosition.Left,
  iconFilled = false,
  iconStroked = false,
  iconSizeClassName,
  dataTest,
  tooltipLabel,
  onMouseOver,
  analyticsData,
  onClickMessage,
}: Props) => {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [displayClickMessage, setDisplayClickMessage] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const btnRef: React.RefObject<HTMLButtonElement | null> = useRef(undefined);
  const { analytics } = useAnalytics();

  const handleOnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isDisabled && !isPending && onClick) {
      if (analyticsData && analytics) {
        const formatedLabel = label ? label : analyticsData.label;
        const event = `${analyticsData.category}_${camelize(formatedLabel)}_click`;
        const data = {
          category: analyticsData.category,
          label: formatedLabel,
          action: "click",
        };
        analytics.track(event, data);
      } else if (window.location.hostname === "localhost") {
        const context = label ? label : "UNKNOWN";
        console.error("missing configuration for analytics", context);
      }
      onClick(event);
    }
    if (onClickMessage) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setDisplayClickMessage(true);
      timerRef.current = setTimeout(() => {
        setDisplayClickMessage(false);
      }, 5000);
    }
  };

  const handleMouseOver = () => {
    if (onMouseOver) {
      onMouseOver();
    }
    if (timer) {
      // Prevent children elements to update timer or tooltip position
      return;
    }
  };

  const handleMouseOut = () => {
    clearTimeout(timer);
    setTimer(undefined);
  };

  const componentClass = clsx(
    "ring-borderCovers flex h-fit items-center justify-center font-semibold",
    "focus:ring-3 focus:outline-none",
    "active:outline-2 active:outline-offset-0 active:outline-[#DFDFDF]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    styles[variant][style],
    {
      "w-full": isFullWidth,
      "h-8 min-h-8 min-w-8 px-2 text-xs": size === ButtonSize.Small && label !== "",
      "h-8 min-h-8 w-8 px-0": size === ButtonSize.Small && label === "",
      "h-10 min-h-10 min-w-10 px-4 py-2 text-sm": size === ButtonSize.Medium && label !== "",
      "h-10 min-h-10 w-10 px-0": size === ButtonSize.Medium && label === "",
      "h-12 min-h-12 min-w-12 px-8 text-base": size === ButtonSize.Large && label !== "",
      "h-12 min-h-12 w-12 px-0": size === ButtonSize.Large && label === "",
      "cursor-not-allowed": isPending,
      "rounded-full": isRounded,
      "rounded-md": !isRounded,
      "pointer-events-none": displayClickMessage,
      "text-primaryAccent": displayClickMessage && variant == ButtonVariant.Outline,
      "cursor-pointer": !displayClickMessage,
    },
  );
  const iconClass = clsx(iconSizeClassName, {
    "fill-current": iconFilled,
    "stroke-current stroke-[1.5px]": iconStroked,
    "h-4 min-h-4": !iconSizeClassName && size === ButtonSize.Small,
    "h-5 min-h-5": !iconSizeClassName && (size === ButtonSize.Medium || size === ButtonSize.Large),
    "mr-2": iconPosition === ButtonIconPosition.Left && label,
    "ml-2": iconPosition === ButtonIconPosition.Right && label,
  });

  return (
    <button
      data-tooltip-id="app-tooltip"
      data-tooltip-content={tooltipLabel}
      data-test={dataTest}
      data-testid={dataTest}
      onClick={handleOnClick}
      className={componentClass}
      disabled={isDisabled}
      ref={btnRef}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      {label ? (
        <>
          {!displayClickMessage &&
            icon &&
            iconPosition === ButtonIconPosition.Left &&
            !isPending && (
              <div data-testid="button-left-icon">
                <Icon name={icon} className={iconClass} />
              </div>
            )}
          {isPending && (
            <span className={"mr-2"} data-testid="button-loader">
              <LoaderSpinner size={LoaderSpinnerSize.XSmall} />
            </span>
          )}
          {<span data-testid="button-label">{displayClickMessage ? onClickMessage : label}</span>}
          {!displayClickMessage && icon && iconPosition === ButtonIconPosition.Right && (
            <div data-testid="button-right-icon">
              <Icon name={icon} className={iconClass} />
            </div>
          )}
        </>
      ) : (
        <>
          {icon && (
            <div data-testid="button-icon-only">
              <Icon name={icon} className={iconClass} />
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
