import {
  Link,
} from "react-router-dom";

import {
  motion,
} from "motion/react";

import {
  getChapterSlug,
  type ActiveChapterItem,
} from "../../lib/supabase/queries/chapters";

import {
  storageUrl,
} from "../../lib/supabase/storage";

type ChapterCardProps = {
  chapter:
    ActiveChapterItem;

  index:
    number;

  active?:
    boolean;

  onSelect?:
    () => void;
};

function getHeroImage(
  chapter:
    ActiveChapterItem,
) {
  const path =
    chapter.hero_image ??
    chapter.chapter_image ??
    chapter.image;

  return storageUrl(
    "chapter-media",
    path,
  );
}

function getLogoImage(
  chapter:
    ActiveChapterItem,
) {
  const path =
    chapter.chapter_logo ??
    chapter.logo_image ??
    chapter.logo_path;

  return storageUrl(
    "chapter-media",
    path,
  );
}

export default function ChapterCard({
  chapter,
  index,
  active = false,
  onSelect,
}: ChapterCardProps) {
  const hero =
    getHeroImage(
      chapter,
    );

  const logo =
    getLogoImage(
      chapter,
    );

  const slug =
    getChapterSlug(
      chapter,
    );

  return (
    <motion.article
      className={`chapter-card ${
        active
          ? "is-active"
          : ""
      }`}
      layout
      onMouseEnter={
        onSelect
      }
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-5%",
      }}
      transition={{
        duration: 0.55,
        delay:
          Math.min(
            index *
              0.045,
            0.25,
          ),
      }}
    >
      <Link
        to={`/chapters/${slug}`}
        className="chapter-card__link"
        data-cursor="VIEW"
      >
        <div className="chapter-card__media">
          {hero ? (
            <img
              src={hero}
              alt=""
              loading="lazy"
            />
          ) : (
            <div
              className="chapter-card__media-fallback"
              aria-hidden="true"
            >
              <span>
                {
                  chapter
                    .name
                    .charAt(
                      0,
                    )
                }
              </span>
            </div>
          )}

          <div className="chapter-card__overlay" />

          <div className="chapter-card__top">
            <span>
              {String(
                index +
                  1,
              ).padStart(
                2,
                "0",
              )}
            </span>

            <span>
              {
                chapter.is_campus
                  ? "Campus Chapter"
                  : "Chapter"
              }
            </span>
          </div>

          {logo && (
            <div className="chapter-card__logo">
              <img
                src={
                  logo
                }
                alt={`${chapter.name} logo`}
                loading="lazy"
              />
            </div>
          )}

          <div className="chapter-card__media-title">
            <span>
              {
                chapter.location
              }
            </span>

            <h3>
              {
                chapter.name
              }
            </h3>
          </div>
        </div>

        <div className="chapter-card__body">
          {chapter.campus_university && (
            <p className="chapter-card__university">
              {
                chapter.campus_university
              }
            </p>
          )}

          {chapter.description && (
            <p className="chapter-card__description">
              {
                chapter.description
              }
            </p>
          )}

          <div className="chapter-card__footer">
            <div>
              {chapter.meeting_schedule && (
                <>
                  <span>
                    Meeting
                  </span>

                  <strong>
                    {
                      chapter.meeting_schedule
                    }
                  </strong>
                </>
              )}
            </div>

            <span className="chapter-card__arrow">
              ↗
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}