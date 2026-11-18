import React, { type JSX } from "react";
import { camelize } from "~/helpers/global";
import { useAnalytics } from "~/hooks/useAnalytics";

import type { AnalyticsData } from "@bridge-types";

interface Props {
  name: React.FC;
  className?: string;
  onClick?: (event?: React.MouseEvent) => void;
  onDoubleClick?: (event?: React.MouseEvent) => void;
  dataTest?: string;
  analyticsData?: AnalyticsData;
}

interface IconProps {
  className?: string;
  onClick?: (event?: React.MouseEvent) => void;
  onDoubleClick?: (event?: React.MouseEvent) => void;
  dataTest?: string;
}

const Icon: React.FC<Props> = ({
  name,
  className = "fill-current text-black",
  onClick,
  onDoubleClick,
  dataTest,
  analyticsData,
}): JSX.Element => {
  const Component: React.FC<IconProps> = name;
  const { analytics } = useAnalytics();

  const handleOnClick = (e) => {
    if (analyticsData) {
      const event = `${analyticsData.category}_${camelize(analyticsData.label)}_click`;
      analytics.track(event, {
        action: "click",
        category: analyticsData.category,
        label: analyticsData.label,
      });
    }
    if (onClick) {
      onClick(e);
    }
  };

  const handleOnDoubleClick = () => {
    if (analyticsData) {
      const event = `${analyticsData.category}_${camelize(analyticsData.label)}_doubleclick`;
      analytics.track(event, {
        action: "dblclick",
        category: analyticsData.category,
        label: analyticsData.label,
      });
    }
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  return (
    <Component
      className={className}
      onClick={handleOnClick}
      onDoubleClick={handleOnDoubleClick}
      data-test={dataTest}
      data-testid={dataTest}
    />
  );
};

export default Icon;
