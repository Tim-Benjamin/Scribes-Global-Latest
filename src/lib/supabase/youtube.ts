export function getYouTubeId(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const input =
    value.trim();

  if (!input) {
    return null;
  }

  /*
   * Bare YouTube ID.
   */
  if (
    /^[A-Za-z0-9_-]{11}$/.test(
      input,
    )
  ) {
    return input;
  }

  try {
    const url =
      new URL(input);

    if (
      url.hostname ===
        "youtu.be" ||
      url.hostname ===
        "www.youtu.be"
    ) {
      const id =
        url.pathname
          .split("/")
          .filter(Boolean)[0];

      return id || null;
    }

    if (
      url.hostname.includes(
        "youtube.com",
      )
    ) {
      const watchId =
        url.searchParams.get(
          "v",
        );

      if (watchId) {
        return watchId;
      }

      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);

      const embedIndex =
        parts.findIndex(
          (part) =>
            part ===
              "embed" ||
            part ===
              "shorts" ||
            part ===
              "live",
        );

      if (
        embedIndex >= 0 &&
        parts[
          embedIndex + 1
        ]
      ) {
        return parts[
          embedIndex + 1
        ];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnail(
  value?: string | null,
) {
  const id =
    getYouTubeId(value);

  if (!id) {
    return null;
  }

  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(
  value?: string | null,
) {
  const id =
    getYouTubeId(value);

  if (!id) {
    return null;
  }

  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}

export function parseYouTubeList(
  value?: string | null,
) {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map(
      (item) =>
        item.trim(),
    )
    .filter(Boolean)
    .map(
      (item) => ({
        raw: item,

        id:
          getYouTubeId(
            item,
          ),

        thumbnail:
          getYouTubeThumbnail(
            item,
          ),

        embed:
          getYouTubeEmbedUrl(
            item,
          ),
      }),
    )
    .filter(
      (
        item,
      ): item is {
        raw: string;
        id: string;
        thumbnail: string;
        embed: string;
      } =>
        Boolean(
          item.id &&
            item.thumbnail &&
            item.embed,
        ),
    );
}