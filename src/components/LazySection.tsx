"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazySectionProps = {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  minHeightClassName?: string;
};

export function LazySection({
  children,
  className,
  rootMargin = "300px 0px",
  minHeightClassName = "min-h-[40vh]",
}: LazySectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? children : <div aria-hidden="true" className={minHeightClassName} />}
    </div>
  );
}
