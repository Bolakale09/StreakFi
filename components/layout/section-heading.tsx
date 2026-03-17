type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink/50">{eyebrow}</p>
      <div className="space-y-2">
        <h2 className="display-font text-3xl font-semibold leading-tight text-ink">{title}</h2>
        {description ? <p className="max-w-xl text-sm leading-6 text-ink/70">{description}</p> : null}
      </div>
    </div>
  );
}
