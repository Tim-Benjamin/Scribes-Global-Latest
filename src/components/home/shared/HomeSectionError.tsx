interface HomeSectionErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function HomeSectionError({
  title = "Something went wrong",
  message = "We couldn't load this section right now.",
  onRetry,
}: HomeSectionErrorProps) {
  return (
    <div
      className="home-section-error"
      role="status"
    >
      <div>
        <p className="home-section-error__eyebrow">
          Temporarily unavailable
        </p>

        <h3>{title}</h3>

        <p>{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="home-section-error__button"
        >
          Try again
        </button>
      )}
    </div>
  );
}