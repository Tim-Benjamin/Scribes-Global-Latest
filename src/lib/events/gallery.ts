export function parseEventGallery(
  value: unknown,
): string[] {
  if (!value) {
    return [];
  }

  if (
    Array.isArray(value)
  ) {
    return value
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

  if (
    typeof value !==
    "string"
  ) {
    return [];
  }

  const trimmed =
    value.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(trimmed);

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
    // Fall through.
  }

  return trimmed
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