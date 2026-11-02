import type { Database } from "./database.types";

type SocialStat =
  Database["public"]["Tables"]["social_media_stats"]["Row"];

export function getVisibleSocialStats(
  stats: SocialStat[],
) {
  return stats.filter((stat) => {
    const count = Number(stat.follower_count ?? 0);

    return count > 0;
  });
}

export function formatSocialCount(
  value?: number | null,
) {
  const count = Number(value ?? 0);

  if (count >= 1_000_000) {
    return `${(count / 1_000_000)
      .toFixed(count >= 10_000_000 ? 0 : 1)
      .replace(".0", "")}M`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000)
      .toFixed(count >= 100_000 ? 0 : 1)
      .replace(".0", "")}K`;
  }

  return count.toLocaleString();
}