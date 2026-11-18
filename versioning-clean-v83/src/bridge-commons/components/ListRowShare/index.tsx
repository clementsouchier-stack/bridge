import React from "react";
import { formatDuration, FormatDurations } from "~/helpers/time";
import clsx from "clsx";

import Button from "../Button";
import { ButtonIconPosition, ButtonSize, ButtonStyle, ButtonVariant } from "../Button/types";
import Checkbox from "../Checkbox";
import Chip from "../Chip";
import Icon from "../Icon";
import { IconComponents } from "../Icon/types";
import ListCell from "../ListCell";
import PlayingEqualizer from "../PlayingEqualizer";
import Knob from "./Knob";

import { Artist, MenuItem } from "@bridge-types";

export interface Props {
  data?: object;
  isHover?: boolean;
  isSupport?: boolean;
  isProject?: boolean;
  hasReorder?: boolean;
  isHub?: boolean;
  isPlaying: boolean;
  isInError: boolean;
  isActiveTrack: number;
  isSelected: boolean;
  canStream: boolean;
  isLibrary?: boolean;
  hasCheckbox?: boolean;
  showAllCheckboxes?: boolean;
  displayHubColumn?: boolean;
  togglePlay: () => void;
  toggleSelect?: () => void;
  handleOpenMenu: ({ x, y, selectedId }) => void;
  menuOptions?: MenuItem[];
  actionsList?: [];
  redirectTo?: (e, pathname, id, query) => void;
  playedTrackIds?: Record<string, true>;
}

const ListRowShare = ({
  data,
  isHover = true,
  isPlaying,
  isInError,
  isSupport = false,
  isProject = false,
  hasReorder = false,
  isHub = false,
  isActiveTrack,
  isSelected,
  canStream,
  isLibrary,
  hasCheckbox = false,
  showAllCheckboxes = false,
  displayHubColumn = false,
  togglePlay,
  toggleSelect,
  handleOpenMenu,
  menuOptions,
  actionsList,
  redirectTo = null,
  playedTrackIds = null,
}) => {
  let icon = undefined;
  if (isHover && data.isDeleted !== true) {
    icon = IconComponents.PlayCircleFill;
  }
  if (isActiveTrack) {
    if (!isPlaying || isInError) {
      icon = IconComponents.PlayCircleFill;
    } else if (isHover) {
      icon = IconComponents.PauseCircleFill;
    }
  }

  // Kept mounted regardless of hover so the equalizer animation never restarts on mouse over/out.
  const showPlayingAnimation =
    Boolean(isActiveTrack) && isPlaying && !isInError && data.isDeleted !== true;

  const isPlayed = !isActiveTrack && Boolean(playedTrackIds?.[data.id]);

  const artistNames =
    !isLibrary &&
    (data.artists || [])
      .map((item: Artist) => {
        return item.name ? item.name : item;
      })
      .join(", ");

  const defaultCellClassName = clsx("text-primaryDarkContent", {
    "text-accentContent": isActiveTrack,
  });

  const openContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    handleOpenMenu({
      x: e.currentTarget.getBoundingClientRect().x + 32 + 5,
      y: e.currentTarget.getBoundingClientRect().y + 32 - 2,
      selectedId: data.id,
    });
  };

  const formatTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(navigator.language || "en-US", options);
  };

  return (
    <>
      {(isLibrary || hasCheckbox) && (
        <ListCell
          className={clsx(defaultCellClassName, "cursor-pointer", {
            "opacity-30": !isHover && !isSelected && !showAllCheckboxes,
          })}
          onClick={(e) => {
            e.stopPropagation();
            if (toggleSelect) {
              toggleSelect(!isSelected, e);
            }
          }}
        >
          <Checkbox id={data.id} isControlled={true} checked={isSelected} />
        </ListCell>
      )}
      <ListCell className={defaultCellClassName}>
        {!isSupport && (isLibrary || isProject) && data.position && (
          <div
            className={`mr-2 flex w-8 shrink-0 justify-center ${hasReorder ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {hasReorder && isHover ? <Knob /> : data.position}
          </div>
        )}
        {icon && canStream && data.isDeleted !== true && !showPlayingAnimation ? (
          <Icon
            name={icon}
            onClick={() => {
              togglePlay({ trackId: data.id });
            }}
            className={"h-10 w-10 flex-shrink-0 rounded-s hover:cursor-pointer"}
            dataTest="list-togglePlay-icon"
            analyticsData={{
              category: "tracklist",
              label: isActiveTrack && isPlaying ? "pause" : "play",
            }}
          />
        ) : (
          <>
            {isSupport ? (
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center text-xs ${showPlayingAnimation && canStream ? "hover:cursor-pointer" : ""}`}
                onClick={(e) => {
                  if (showPlayingAnimation && canStream && !isHover) {
                    e.stopPropagation();
                    togglePlay({ trackId: data.id });
                  }
                }}
                data-testid={
                  showPlayingAnimation && canStream && !isHover
                    ? "list-togglePlay-icon"
                    : "list-track-position"
                }
              >
                {showPlayingAnimation && canStream ? <PlayingEqualizer /> : data.position}
                {showPlayingAnimation && canStream && icon && (
                  <Icon
                    name={icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay({ trackId: data.id });
                    }}
                    className="absolute inset-0 h-10 w-10 flex-shrink-0 rounded-s hover:cursor-pointer"
                    dataTest="list-togglePlay-icon"
                    analyticsData={{
                      category: "tracklist",
                      label: "pause",
                    }}
                  />
                )}
              </div>
            ) : (
              <div
                className={`relative h-10 w-10 flex-shrink-0 ${showPlayingAnimation && canStream ? "hover:cursor-pointer" : ""}`}
                onClick={(e) => {
                  if (showPlayingAnimation && canStream && !isHover) {
                    e.stopPropagation();
                    togglePlay({ trackId: data.id });
                  }
                }}
                data-testid={
                  showPlayingAnimation && canStream && !isHover ? "list-togglePlay-icon" : undefined
                }
              >
                <img
                  className="h-10 w-10 flex-shrink-0 rounded-s"
                  src={data.image ? data.image : "/images/default/track.svg"}
                  alt={
                    data.supportName
                      ? `Support cover of ${data.supportName}`
                      : "Default support cover"
                  }
                  data-testid="list-support-image"
                />
                {showPlayingAnimation && canStream && <PlayingEqualizer />}
                {showPlayingAnimation && canStream && icon && (
                  <Icon
                    name={icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay({ trackId: data.id });
                    }}
                    className="absolute inset-0 h-10 w-10 flex-shrink-0 rounded-s hover:cursor-pointer"
                    dataTest="list-togglePlay-icon"
                    analyticsData={{
                      category: "tracklist",
                      label: "pause",
                    }}
                  />
                )}
              </div>
            )}
          </>
        )}
        {data.isDeleted ? (
          <span className="ml-2 grow truncate" data-testid="list-track-name">
            Track deleted
          </span>
        ) : (
          <div className="ml-2 flex flex-col overflow-hidden">
            <div className="flex min-w-0 grow items-center gap-1">
              <span
                className="min-w-0 truncate font-bold"
                title={data.name}
                data-testid="list-track-name"
              >
                {data.name}
              </span>
              {isActiveTrack ? <Chip text="Playing" /> : null}
              {isPlayed ? (
                <span
                  data-tooltip-id="app-tooltip"
                  data-tooltip-content="Already played"
                  data-tooltip-place="right"
                  data-testid="played-track-icon"
                >
                  <Icon
                    name={IconComponents.HistoryLine}
                    className="h-4 w-4 shrink-0 fill-secondaryContent"
                  />
                </span>
              ) : null}
            </div>
            {isLibrary ? (
              <div className="truncate text-secondaryContent">
                {data.artists?.map((artist, index) => {
                  return (
                    <span
                      key={index}
                      className="cursor-pointer pr-2 hover:underline"
                      data-testid="list-artist-name"
                      onClick={(e) => {
                        if (redirectTo) {
                          redirectTo(e, "/library/artist", artist.id, "aid");
                        }
                      }}
                    >
                      {artist.name}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span
                className="truncate text-secondaryContent"
                title={artistNames}
                data-testid="list-artist-name"
              >
                {artistNames}
              </span>
            )}
          </div>
        )}
      </ListCell>
      {!(isLibrary && isSupport) && (
        <ListCell className={defaultCellClassName}>
          <span
            className={`truncate ${isLibrary ? "cursor-pointer hover:underline" : ""}`}
            title={firstString(data?.support?.name, data.support)}
            data-testid="list-support-name"
            onClick={(e) => {
              if (isLibrary && redirectTo) {
                redirectTo(e, "/library/album", data?.support?.id, "sid");
              }
            }}
          >
            {firstString(data?.support?.name, data.support)}
          </span>
        </ListCell>
      )}
      {data.workspaceName && isHub === true && (
        <ListCell className={defaultCellClassName}>
          <span className="truncate" title={data.workspaceName} data-testid="list-support-name">
            {data.workspaceName}
          </span>
        </ListCell>
      )}
      {/* {isHub === true && (
        <ListCell className={defaultCellClassName}>
          <span className="truncate" title={data.artistNotoriety} data-testid="list-support-name">
            <NotorietyDots value={data.artistNotoriety || 0} />
          </span>
        </ListCell>
      )} */}
      <ListCell className={defaultCellClassName}>
        <span data-testid="list-duration">
          {formatDuration(data.duration, FormatDurations.MMSS)}
        </span>
      </ListCell>
      {data.updatedAt && (
        <ListCell>
          <div>
            <div className="text-primaryDarkContent">{formatTimestampToDate(data.updatedAt)}</div>
            <div className="text-xs text-secondaryContent">{data.createdBy || " -"}</div>
          </div>
        </ListCell>
      )}
      {displayHubColumn && (
        <ListCell className={defaultCellClassName}>
          <span data-testid="list-hub">
            {data.hubImg && !isHover && (
              <div className="flex gap-1">
                <div className="h-5 w-5 rounded border border-secondaryBorder">
                  <img src={data.hubImg} alt="hub logo" />
                </div>
                {data.additionalHubs > 0 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded border border-secondaryBorder text-xs text-secondaryContent">
                    <div>+ {data.additionalHubs}</div>
                  </div>
                )}
              </div>
            )}
            {isHover && (
              <Button
                style={ButtonStyle.Neutral}
                variant={ButtonVariant.BorderLess}
                size={ButtonSize.Small}
                icon={IconComponents.BridgeAddArrow}
                tooltipLabel="Publish on hubs"
                iconPosition={ButtonIconPosition.Left}
                iconFilled={true}
                onClick={() => {
                  const getActionById = (id) => {
                    return menuOptions.find((item) => {
                      return item.id === id;
                    })?.action;
                  };
                  getActionById("publish-on-hubs")?.([data.id]);
                }}
              />
            )}
          </span>
        </ListCell>
      )}
      {isHover &&
        (menuOptions?.length > 0 || actionsList?.length > 0) &&
        data.isDeleted !== true && (
          <ListCell className="justify-end pr-2">
            <>
              {actionsList?.length > 0 &&
                actionsList.map((action, index) => {
                  return (
                    <div key={index} className="mr-2">
                      <Button
                        style={ButtonStyle.Neutral}
                        variant={ButtonVariant.BorderLess}
                        size={ButtonSize.Small}
                        icon={action.icon}
                        iconFilled={true}
                        tooltipLabel={action.tooltipLabel}
                        iconPosition={ButtonIconPosition.Left}
                        onClick={() => {
                          action.action(data.id);
                        }}
                        dataTest={action.dataTest}
                      />
                    </div>
                  );
                })}
              {menuOptions?.length > 1 && (
                <Button
                  style={ButtonStyle.Neutral}
                  variant={ButtonVariant.BorderLess}
                  size={ButtonSize.Small}
                  icon={IconComponents.EllipsisHorizontal}
                  iconFilled={true}
                  iconPosition={ButtonIconPosition.Left}
                  onClick={openContextMenu}
                  dataTest="open-context-menu"
                />
              )}
            </>
          </ListCell>
        )}
    </>
  );
};

const firstString = (...vals: any): string | null => {
  for (const val of vals) {
    if (typeof val === "string") {
      return val;
    }
  }
  return null;
};

export default ListRowShare;
