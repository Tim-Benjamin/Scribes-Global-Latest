export function parseChapterGallery(
  gallery:
    | string
    | string[]
    | null
    | undefined,
): string[] {
  if (!gallery) {
    return [];
  }

  if (
    Array.isArray(gallery)
  ) {
    return gallery.filter(
      (
        item,
      ): item is string =>
        typeof item ===
          "string" &&
        Boolean(
          item.trim(),
        ),
    );
  }

  const value =
    gallery.trim();

  if (!value) {
    return [];
  }

  /* JSON array */
  try {
    const parsed =
      JSON.parse(value);

    if (
      Array.isArray(
        parsed,
      )
    ) {
      return parsed
        .filter(
          (
            item,
          ): item is string =>
            typeof item ===
            "string",
        )
        .map(
          (item) =>
            item.trim(),
        )
        .filter(Boolean);
    }
  } catch {
    // Fall through to CSV.
  }

  /* CSV / legacy list */
  return value
    .split(",")
    .map(
      (item) =>
        item
          .trim()
          .replace(
            /^["']|["']$/g,
            "",
          ),
    )
    .filter(Boolean);
}