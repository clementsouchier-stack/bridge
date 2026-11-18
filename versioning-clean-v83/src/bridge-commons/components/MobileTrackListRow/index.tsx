import React from "react";

import Button from "../Button";
import { ButtonIconPosition, ButtonSize, ButtonStyle, ButtonVariant } from "../Button/types";
import Chip from "../Chip";
import Icon from "../Icon";
import { IconComponents } from "../Icon/types";
import ListCell from "../ListCell";
import PlayingEqualizer from "../PlayingEqualizer";

import type { Track } from "@bridge-types";

type Props = {
  data?: Track;
  isPlaying?: boolean;
  isActiveTrack?: boolean;
  isSupport?: boolean;
  canStream: boolean;
  canDownload: boolean;
  canAccessTrackMetadata: boolean;
  handleOpenMenu?: ({ x, y, selectedId }) => void;
  openActionModalCallback?: (id, image, name, artists) => void;
  togglePlayCallback: (id) => void;
  playedTrackIds?: Record<string, true>;
};

const MobileTrackListRow: React.FC<Props> = ({
  data,
  isPlaying,
  isActiveTrack,
  isSupport = false,
  canStream,
  canDownload,
  canAccessTrackMetadata,
  handleOpenMenu,
  openActionModalCallback,
  togglePlayCallback,
  playedTrackIds,
}: Props) => {
  let icon = undefined;
  if (isActiveTrack && !isPlaying) {
    icon = IconComponents.PlayCircleFill;
  }

  const isPlayed = !isActiveTrack && Boolean(playedTrackIds?.[data.id]);

  const showPlayingAnimation = Boolean(isActiveTrack) && isPlaying && data.isDeleted !== true;

  const handlePlay = () => {
    if (canStream) {
      togglePlayCallback(data.id);
    }
  };

  const handleOpenActionsModal = (e: React.MouseEvent<HTMLElement>) => {
    if (openActionModalCallback) {
      openActionModalCallback(data.id, data.image, data.name, data.artists);
    }
    if (handleOpenMenu) {
      handleOpenMenu({
        x: e.currentTarget.getBoundingClientRect().x + 32 + 5,
        y: e.currentTarget.getBoundingClientRect().y + 32 - 2,
        selectedId: data.id,
      });
    }
  };

  const hasActions = canDownload || canAccessTrackMetadata;
  // Without an actions modal, the parent List row opens its contextual menu
  const hasActionsModal = hasActions && Boolean(openActionModalCallback);

  return (
    <div
      className="w-full text-primaryDarkContent"
      data-long-press={hasActionsModal ? "" : undefined}
      onContextMenu={(event) => {
        if (hasActionsModal) {
          event.stopPropagation();
          event.preventDefault();
          openActionModalCallback(data.id, data.image, data.name, data.artists);
        }
      }}
    >
      {/* We must set the max-width for the flex item to be truncated once is it too big for the screen */}
      <div className="flex h-16 max-w-[calc(100vw-32px)] select-none space-x-2">
        <ListCell className="shrink-0">
          <div
            className="flex items-center justify-center"
            onDoubleClick={handlePlay}
            onClick={handlePlay}
          >
            {icon ? (
              <Icon name={icon} className="h-10 w-10 rounded-s" />
            ) : (
              <>
                {isSupport ? (
                  <div className="relative flex h-10 w-10 items-center justify-center text-xs">
                    {showPlayingAnimation ? <PlayingEqualizer /> : data.position}
                  </div>
                ) : (
                  <div className="relative h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-s"
                      src={data.image ? data.image : "/images/default/track.svg"}
                      alt={`Support cover of ${data.support}`}
                    />
                    {showPlayingAnimation && <PlayingEqualizer />}
                  </div>
                )}
              </>
            )}
          </div>
        </ListCell>
        <ListCell className="max-w-full grow">
          <div className="min-w-0 text-sm" onDoubleClick={handlePlay} onClick={handlePlay}>
            <div className="flex min-w-0 items-center gap-1">
              <p className="min-w-0 truncate font-semibold" data-testid="mobile-track-name">
                {data.name}
              </p>
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
            <div>
              <p className="grow truncate text-sm text-secondaryContent">
                {data.artists &&
                  data.artists
                    .map((i) => {
                      return i.name || i;
                    })
                    .join(" • ")}
              </p>
            </div>
          </div>
        </ListCell>
        {hasActions && (
          <ListCell className="shrink-0">
            <div className="flex justify-items-end">
              <Button
                size={ButtonSize.Medium}
                style={ButtonStyle.Neutral}
                variant={ButtonVariant.BorderLess}
                icon={IconComponents.EllipsisHorizontal}
                iconFilled={true}
                iconPosition={ButtonIconPosition.Left}
                onClick={handleOpenActionsModal}
              />
            </div>
          </ListCell>
        )}
      </div>
    </div>
  );
};

export default MobileTrackListRow;
