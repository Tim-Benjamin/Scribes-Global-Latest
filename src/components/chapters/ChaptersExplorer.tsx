import {
  useMemo,
  useState,
} from "react";

import type {
  ActiveChapterItem,
} from "../../lib/supabase/queries/chapters";

type ChaptersExplorerProps = {
  chapters:
    ActiveChapterItem[];

  selectedId:
    ActiveChapterItem["id"] |
    null;

  onSelect:
    (
      chapter:
        ActiveChapterItem,
    ) => void;
};

type PositionedChapter = {
  chapter:
    ActiveChapterItem;

  x: number;

  y: number;
};

/* =========================================================
   HELPERS
========================================================= */

function toNumber(
  value:
    | string
    | number
    | null,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const parsed =
    Number(value);

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : null;
}

function createPositions(
  chapters:
    ActiveChapterItem[],
): PositionedChapter[] {
  const withCoordinates =
    chapters
      .map(
        (
          chapter,
        ) => ({
          chapter,

          latitude:
            toNumber(
              chapter.latitude,
            ),

          longitude:
            toNumber(
              chapter.longitude,
            ),
        }),
      )
      .filter(
        (
          item,
        ): item is typeof item & {
          latitude: number;
          longitude: number;
        } =>
          item.latitude !==
            null &&
          item.longitude !==
            null,
      );

  if (
    withCoordinates.length ===
    0
  ) {
    /*
     * No fake geographic points.
     * We simply create a visual network
     * arrangement using chapter order.
     */
    return chapters.map(
      (
        chapter,
        index,
      ) => {
        const angle =
          (index /
            Math.max(
              chapters.length,
              1,
            )) *
          Math.PI *
          2;

        return {
          chapter,

          x:
            50 +
            Math.cos(
              angle,
            ) *
              33,

          y:
            50 +
            Math.sin(
              angle,
            ) *
              31,
        };
      },
    );
  }

  const latitudes =
    withCoordinates.map(
      (
        item,
      ) =>
        item.latitude,
    );

  const longitudes =
    withCoordinates.map(
      (
        item,
      ) =>
        item.longitude,
    );

  const minLat =
    Math.min(
      ...latitudes,
    );

  const maxLat =
    Math.max(
      ...latitudes,
    );

  const minLong =
    Math.min(
      ...longitudes,
    );

  const maxLong =
    Math.max(
      ...longitudes,
    );

  const latRange =
    Math.max(
      maxLat -
        minLat,
      0.0001,
    );

  const longRange =
    Math.max(
      maxLong -
        minLong,
      0.0001,
    );

  return withCoordinates.map(
    (
      item,
    ) => ({
      chapter:
        item.chapter,

      x:
        10 +
        ((item.longitude -
          minLong) /
          longRange) *
          80,

      /*
       * Latitude increases upwards,
       * while browser Y increases downwards.
       */
      y:
        88 -
        ((item.latitude -
          minLat) /
          latRange) *
          76,
    }),
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ChaptersExplorer({
  chapters,
  selectedId,
  onSelect,
}: ChaptersExplorerProps) {
  const [
    hoveredId,
    setHoveredId,
  ] =
    useState<
      ActiveChapterItem["id"] |
        null
    >(null);

  const positioned =
    useMemo(
      () =>
        createPositions(
          chapters,
        ),
      [chapters],
    );

  if (
    positioned.length ===
    0
  ) {
    return null;
  }

  return (
    <section
      className="chapters-explorer"
      aria-label="Chapter network"
    >
      <div className="chapters-container">
        <div className="chapters-section-heading">
          <div>
            <span>
              01
            </span>

            <p>
              The Network
            </p>
          </div>

          <h2>
            FIND YOUR
            <span>
              COMMUNITY.
            </span>
          </h2>
        </div>

        <div className="chapters-explorer__stage">
          <div
            className="chapters-explorer__glow"
            aria-hidden="true"
          />

          <svg
            className="chapters-explorer__connections"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {positioned
              .slice(
                1,
              )
              .map(
                (
                  current,
                  index,
                ) => {
                  const previous =
                    positioned[
                      index
                    ];

                  return (
                    <line
                      key={`${String(previous.chapter.id)}-${String(current.chapter.id)}`}
                      x1={
                        previous.x
                      }
                      y1={
                        previous.y
                      }
                      x2={
                        current.x
                      }
                      y2={
                        current.y
                      }
                    />
                  );
                },
              )}
          </svg>

          {positioned.map(
            (
              item,
              index,
            ) => {
              const active =
                selectedId ===
                  item.chapter.id ||
                hoveredId ===
                  item.chapter.id;

              return (
                <button
                  key={
                    item.chapter
                      .id
                  }
                  type="button"
                  className={`chapters-explorer__node ${
                    active
                      ? "is-active"
                      : ""
                  }`}
                  style={{
                    left:
                      `${item.x}%`,

                    top:
                      `${item.y}%`,
                  }}
                  onMouseEnter={() =>
                    setHoveredId(
                      item.chapter
                        .id,
                    )
                  }
                  onMouseLeave={() =>
                    setHoveredId(
                      null,
                    )
                  }
                  onClick={() =>
                    onSelect(
                      item.chapter,
                    )
                  }
                  aria-label={`Select ${item.chapter.name}`}
                >
                  <span className="chapters-explorer__pulse" />

                  <span className="chapters-explorer__dot">
                    {String(
                      index +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span className="chapters-explorer__node-label">
                    <strong>
                      {
                        item.chapter
                          .name
                      }
                    </strong>

                    <small>
                      {
                        item.chapter
                          .location
                      }
                    </small>
                  </span>
                </button>
              );
            },
          )}

          <div className="chapters-explorer__legend">
            <span>
              ●
            </span>

            Active chapter

            <i>
              {
                positioned.length
              }
            </i>
          </div>
        </div>
      </div>
    </section>
  );
}