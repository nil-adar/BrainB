import { useEffect, useRef, useState } from "react";

export default function LandingVideo({
  videoId,
  titleHe = "הדגמה קצרה של BrainBridge",
  subtitleHe = "הציצו במסך עבודה אמיתי לפני הרשמה",
  titleEn = "Quick BrainBridge demo",
  subtitleEn = "See the product in action before signing up",
  lang = "he",
}: {
  videoId: string; // e.g. "3yylb_jKSqg"
  titleHe?: string;
  subtitleHe?: string;
  titleEn?: string;
  subtitleEn?: string;
  lang?: "he" | "en";
}) {
  const t =
    lang === "he"
      ? { title: titleHe, subtitle: subtitleHe }
      : { title: titleEn, subtitle: subtitleEn };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  // Lazy-load את ה־iframe רק כשהמקטע נכנס לפריים
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setReady(true);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
      <p className="text-sm text-muted-foreground mb-6">{t.subtitle}</p>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl shadow-md"
      >
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          {ready ? (
            <iframe
              title="BrainBridge demo"
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <img
              alt="Video placeholder"
              className="absolute inset-0 h-full w-full object-cover"
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            />
          )}
        </div>
      </div>
    </section>
  );
}
