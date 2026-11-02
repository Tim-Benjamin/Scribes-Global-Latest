import { Link } from "react-router-dom";
import { motion } from "motion/react";

import type { LatestPostItem } from "../../lib/supabase/queries/home";
import { storageUrl } from "../../lib/supabase/storage";

import HomeSectionSkeleton from "./shared/HomeSectionSkeleton";
import HomeSectionError from "./shared/HomeSectionError";

import "./blog.css";

interface LatestStoriesProps {
  posts?: LatestPostItem[] | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

function formatPublishedDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function LatestStories({
  posts = [],
  loading = false,
  error = null,
  onRetry,
}: LatestStoriesProps) {
  const safePosts = Array.isArray(posts) ? posts : [];

  // Nothing published yet and nothing broke — just don't show an empty shelf.
  if (!loading && !error && safePosts.length === 0) {
    return null;
  }

  return (
    <section className="latest-stories" id="latest-stories">
      <div className="latest-stories__container">
        <motion.div
          className="latest-stories__header"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="latest-stories__eyebrow">Write · Reflect · Share</p>
            <h2>
              From the
              <span> blog.</span>
            </h2>
          </div>

          <Link to="/blog" className="latest-stories__all" data-cursor="VIEW">
            <span>All stories</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </motion.div>

        {loading ? (
          <HomeSectionSkeleton cards={3} />
        ) : error ? (
          <HomeSectionError
            title="Stories couldn't be loaded"
            message="We couldn't retrieve the latest posts at the moment."
            onRetry={onRetry}
          />
        ) : (
          <div className="latest-stories__grid">
            {safePosts.map((post, index) => {
              const imageUrl = storageUrl("blog-media", post.featured_image);
              const published = formatPublishedDate(post.published_at);

              return (
                <motion.article
                  key={post.id}
                  className="latest-story-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={`/blog/${post.slug}`} className="latest-story-card__link" data-cursor="VIEW">
                    <div className="latest-story-card__media">
                      {imageUrl ? (
                        <img src={imageUrl} alt="" loading="lazy" />
                      ) : (
                        <div className="latest-story-card__placeholder">
                          <span>Scribes Global</span>
                        </div>
                      )}
                      {post.category && <div className="latest-story-card__category">{post.category}</div>}
                    </div>

                    <div className="latest-story-card__body">
                      <h3>{post.title}</h3>
                      {post.excerpt && <p>{post.excerpt}</p>}

                      <div className="latest-story-card__meta">
                        {published && <span>{published}</span>}
                        {post.reading_time && <span>{post.reading_time} min read</span>}
                        <span className="latest-story-card__arrow" aria-hidden="true">↗</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
