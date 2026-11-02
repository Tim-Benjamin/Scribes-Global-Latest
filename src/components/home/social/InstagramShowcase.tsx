import { motion } from "motion/react";

import type {
  InstagramPostItem,
} from "../../../lib/supabase/queries";

import HomeSectionError from "../shared/HomeSectionError";

interface InstagramShowcaseProps {
  posts?: InstagramPostItem[] | null;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function InstagramShowcase({
  posts = [],
  loading = false,
  error = null,
  onRetry,
}: InstagramShowcaseProps) {
  const safePosts = Array.isArray(posts)
    ? posts.filter((post) =>
        Boolean(post.post_url?.trim()),
      )
    : [];

  if (
    !loading &&
    !error &&
    safePosts.length === 0
  ) {
    return null;
  }

  return (
    <section className="social-feed social-feed--instagram">
      <div className="social-feed__container">
        <div className="social-feed__header">
          <div>
            <p>Instagram</p>

            <h2>
              Moments from
              <span> the movement.</span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="social-feed__loading">
            Loading Instagram...
          </div>
        ) : error ? (
          <HomeSectionError
            title="Instagram couldn't be loaded"
            message="We couldn't retrieve Instagram posts right now."
            onRetry={onRetry}
          />
        ) : (
          <div className="social-feed__grid">
            {safePosts.map((post, index) => (
              <motion.a
                key={`instagram-${post.slot ?? index}`}
                href={post.post_url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="social-feed__card"
                data-cursor="VIEW"
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
                  margin: "-10%",
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="social-feed__number">
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </div>

                <div className="social-feed__card-body">
                  <span>Instagram</span>

                  <p>
                    {post.caption?.trim() ||
                      "View this post on Instagram."}
                  </p>
                </div>

                <span
                  className="social-feed__arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}