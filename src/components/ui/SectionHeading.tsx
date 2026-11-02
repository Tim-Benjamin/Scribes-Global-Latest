import Reveal from "../animation/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`section-heading section-heading-${align}`}
    >
      {eyebrow && (
        <Reveal>
          <p className="section-eyebrow">
            {eyebrow}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.08}>
        <h2>{title}</h2>
      </Reveal>

      {description && (
        <Reveal delay={0.16}>
          <p className="section-description">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}