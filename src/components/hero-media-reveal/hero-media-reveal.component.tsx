"use client";

import Image, { type ImageProps } from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type VideoHTMLAttributes,
} from "react";

const HeroMediaReadyContext = createContext<() => void>(() => {});

export function useHeroMediaReady() {
  return useContext(HeroMediaReadyContext);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export type HeroMediaRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Holds an ink surface under hero media, then fades the media in once ready.
 */
export function HeroMediaReveal({
  children,
  className = "",
}: HeroMediaRevealProps) {
  const [ready, setReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const show = ready || reducedMotion;

  const markReady = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <HeroMediaReadyContext.Provider value={markReady}>
      <div className={`absolute inset-0 bg-ink ${className}`.trim()}>
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            show ? "opacity-100" : "opacity-0"
          }`}
        >
          {children}
        </div>
      </div>
    </HeroMediaReadyContext.Provider>
  );
}

/** Next/Image that signals HeroMediaReveal when the bitmap is ready. */
export function HeroRevealImage({ onLoad, alt = "", ...props }: ImageProps) {
  const markReady = useHeroMediaReady();
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth > 0) {
      markReady();
    }
  }, [markReady, props.src]);

  return (
    <Image
      {...props}
      ref={ref}
      alt={alt}
      onLoad={(event) => {
        onLoad?.(event);
        markReady();
      }}
    />
  );
}

/** Video that signals HeroMediaReveal when it can play. */
export function HeroRevealVideo({
  onCanPlay,
  onLoadedData,
  ...props
}: VideoHTMLAttributes<HTMLVideoElement>) {
  const markReady = useHeroMediaReady();

  return (
    <video
      {...props}
      onCanPlay={(event) => {
        onCanPlay?.(event);
        markReady();
      }}
      onLoadedData={(event) => {
        onLoadedData?.(event);
        markReady();
      }}
    />
  );
}
