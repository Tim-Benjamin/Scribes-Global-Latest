type SectionTransitionProps = {
  label?: string;
};

export default function SectionTransition({
  label,
}: SectionTransitionProps) {
  return (
    <div
      className="section-transition"
      aria-hidden="true"
    >
      <div className="section-transition__curtain" />

      <div className="section-transition__line">
        <span />
      </div>

      {label && (
        <span className="section-transition__label">
          {label}
        </span>
      )}
    </div>
  );
}