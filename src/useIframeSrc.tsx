import { useMemo } from "react";
import { Preload } from "./types";

interface IframeSrcOptions {
  muted?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  poster?: string;
  primaryColor?: string;
  letterboxColor?: string;
  startTime?: string | number;
  adUrl?: string;
  defaultTextTrack?: string;
  preload?: Preload;
  customerCode?: string;
}

export function useIframeSrc(
  src: string,
  {
    muted,
    preload,
    loop,
    autoplay,
    controls,
    poster,
    primaryColor,
    letterboxColor,
    adUrl,
    startTime,
    defaultTextTrack,
    customerCode,
  }: IframeSrcOptions
) {
  const paramString = [
    poster && `poster=${encodeURIComponent(poster)}`,
    adUrl && `ad-url=${encodeURIComponent(adUrl)}`,
    defaultTextTrack &&
      `defaultTextTrack=${encodeURIComponent(defaultTextTrack)}`,
    primaryColor && `primaryColor=${encodeURIComponent(primaryColor)}`,
    letterboxColor && `letterboxColor=${encodeURIComponent(letterboxColor)}`,
    startTime && `startTime=${startTime}`,
    muted && "muted=true",
    preload && `preload=${preload}`,
    loop && "loop=true",
    autoplay && "autoplay=true",
    !controls && "controls=false",
  ]
    .filter(Boolean)
    .join("&");

  const iframeSrc = useMemo(
    () =>
      customerCode
        ? `https://customer-${customerCode}.cloudflarestream.com/${src}/iframe?${paramString}`
        : `https://iframe.cloudflarestream.com/${src}?${paramString}`,
    // we intentionally do NOT include paramString here because we want
    // to avoid changing the URL when these options change. Changes to
    // these options will instead be handled separately via the SDK.
    []
  );

  return iframeSrc;
}
