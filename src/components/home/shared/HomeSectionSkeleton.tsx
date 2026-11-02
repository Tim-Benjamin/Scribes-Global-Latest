interface HomeSectionSkeletonProps {
  cards?: number;
}

export default function HomeSectionSkeleton({
  cards = 3,
}: HomeSectionSkeletonProps) {
  return (
    <div
      className="home-section-skeleton"
      aria-label="Loading content"
      aria-busy="true"
    >
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="home-section-skeleton__card"
        >
          <div className="home-section-skeleton__media" />

          <div className="home-section-skeleton__body">
            <span />
            <span />
            <span />
          </div>
        </div>
      ))}
    </div>
  );
}