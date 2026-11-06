import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { stats } from "@/content/site";
import { useEffect, useRef, useState } from "react";

const CountUp = ({
  end,
  suffix = "",
  duration = 3500,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export function Impact() {
  return (
    <section id="impacto" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Impacto"
            title="Nuestro impacto"
            description="Proyectos ambientales y sociales en marcha en el territorio, junto a las personas y familias que participan de nuestras iniciativas."
          />
        </Reveal>

        <dl className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            // Parse numeric value from stat.value
            const valueStr = stat.value.toString().replace(/[^0-9]/g, "");
            const numericValue = parseInt(valueStr) || 0;
            const suffix = stat.value.toString().replace(/[0-9.,]/g, "");

            return (
              <Reveal
                key={stat.label}
                delay={i * 80}
                className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-8 text-center shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-lift"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
                <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-secondary/5 transition-transform duration-500 group-hover:scale-125" />
                <div className="relative">
                  <dd className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                    <CountUp end={numericValue} suffix={suffix} />
                  </dd>
                  <dt className="order-2 mt-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
