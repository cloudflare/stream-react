import { useMemo } from "react";
import { Preload } from "./types";

interface IframeSrcOptions {
  muted?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  controls?: boolean;
  poster?: string;
  primaryColor?: string;
  startTime?: string | number;
  adUrl?: string;
  defaultTextTrack?: string;
  preload?: Preload;
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
    adUrl,
    startTime,
    defaultTextTrack,
  }: IframeSrcOptions
) {
  const paramString = [
    poster && `poster=${encodeURIComponent(poster)}`,
    adUrl && `ad-url=${encodeURIComponent(adUrl)}`,
    defaultTextTrack &&
      `defaultTextTrack=${encodeURIComponent(defaultTextTrack)}`,
    primaryColor && `primaryColor=${encodeURIComponent(primaryColor)}`,
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
    () => `https://iframe.videodelivery.net/${src}?${paramString}`,
    // we intentionally do NOT include paramString here because we want
    // to avoid changing the URL when these options change. Changes to
    // these options will instead be handled separately via the SDK.
    []
  );

  return iframeSrc;
}
