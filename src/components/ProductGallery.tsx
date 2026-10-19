import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const total = images.length;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (total === 0) {
    return (
      <div
        aria-hidden="true"
        className="aspect-[4/3] w-full rounded-2xl border border-dashed border-border bg-background"
      />
    );
  }

  return (
    <div>
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        >
          <CarouselContent>
            {images.map((item) => (
              <CarouselItem key={item.src}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.alt}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-3 h-10 w-10 rounded-full border-0 bg-white/80 text-foreground shadow-lift backdrop-blur hover:bg-white" />
          <CarouselNext className="right-3 h-10 w-10 rounded-full border-0 bg-white/80 text-foreground shadow-lift backdrop-blur hover:bg-white" />
          <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {current + 1} / {total}
          </div>
        </Carousel>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {images.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Ver imagen ${index + 1}: ${item.alt}`}
            className={cn(
              "overflow-hidden rounded-lg border-2 transition-all duration-300",
              index === current
                ? "border-secondary opacity-100 shadow-lift"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <img src={item.src} alt={item.alt} className="h-16 w-24 object-cover sm:h-20 sm:w-32" />
          </button>
        ))}
      </div>
    </div>
  );
}
