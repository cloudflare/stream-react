import React, {
  useRef,
  useEffect,
  RefObject,
  FC,
  useState,
  CSSProperties,
  useMemo,
  MutableRefObject,
} from "react";
import { StreamPlayerApi, StreamProps, VideoDimensions } from "./types";
import { useStreamSDK, safelyAccessStreamSDK } from "./useStreamSDK";
import { useIframeSrc } from "./useIframeSrc";
import { validSrcUrl } from "./validSrcUrl";

/**
 * Hook for syncing properties to the SDK api when they change
 */
function useProperty<T, Key extends keyof T>(
  name: Key,
  ref: RefObject<T | undefined>,
  value: T[Key]
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el[name] = value;
  }, [name, value, ref]);
}

/**
 * Hook for binding event listeners to the player.
 */
function useEvent(
  event: string,
  ref: MutableRefObject<StreamPlayerApi | undefined>,
  callback: EventListener = noop
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.addEventListener(event, callback);
    // clean up
    return () => el.removeEventListener(event, callback);
  }, [callback, event, ref]);
}

// Declaring a single noop function that will retain object
// identity across renders and prevent unnecessary rebinding
// when no callback is provided
const noop = () => {};

export const Stream: FC<StreamProps> = (props) => {
  const streamSdk = useStreamSDK();
  return streamSdk ? <StreamEmbed {...props} /> : null;
};

const responsiveIframeStyles: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: "100%",
  width: "100%",
};

const Container: FC<{
  responsive: boolean;
  videoDimensions: VideoDimensions;
  className?: string;
}> = ({ children, responsive, className, videoDimensions }) => {
  const { videoHeight, videoWidth } = videoDimensions;
  const responsiveStyles: CSSProperties = useMemo<CSSProperties>(
    () => ({
      position: "relative",
      paddingTop:
        videoWidth > 0 ? `${(videoHeight / videoWidth) * 100}%` : undefined,
    }),
    [videoWidth, videoHeight]
  );
  return (
    <div
      className={className}
      style={responsive ? responsiveStyles : undefined}
    >
      {children}
    </div>
  );
};

export const StreamEmbed: FC<StreamProps> = ({
  src,
  customerCode,
  adUrl,
  controls = false,
  muted = false,
  autoplay = false,
  loop = false,
  preload = "metadata",
  primaryColor,
  letterboxColor,
  defaultTextTrack,
  height,
  width,
  poster,
  currentTime = 0,
  volume = 1,
  playbackRate = 1,
  startTime,
  streamRef,
  responsive = true,
  className,
  title,
  onAbort,
  onCanPlay,
  onCanPlayThrough,
  onDurationChange,
  onEnded,
  onError,
  onLoadedData,
  onLoadedMetaData,
  onLoadStart,
  onPause,
  onPlay,
  onPlaying,
  onProgress,
  onRateChange,
  onResize,
  onSeeked,
  onSeeking,
  onStalled,
  onSuspend,
  onTimeUpdate,
  onVolumeChange,
  onWaiting,
  onStreamAdStart,
  onStreamAdEnd,
  onStreamAdTimeout,
}) => {
  const internalRef = useRef<StreamPlayerApi>();
  const ref = streamRef ?? internalRef;

  const [videoDimensions, setVideoDimensions] = useState({
    videoHeight: 0,
    videoWidth: 0,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const computedSrc = useIframeSrc(src, {
    customerCode,
    muted,
    preload,
    loop,
    autoplay,
    controls,
    poster,
    primaryColor,
    letterboxColor,
    adUrl,
    defaultTextTrack,
    startTime,
  });

  // While it's easier for most consumers to simply provide the video UID
  // or signed token and have us compute the iframe's src for them, some
  // consumers may need to manually specify the iframe's src.
  const iframeSrc = validSrcUrl(src) ? src : computedSrc;

  useProperty("muted", ref, muted);
  useProperty("controls", ref, controls);
  useProperty("src", ref, src);
  useProperty("autoplay", ref, autoplay);
  useProperty("currentTime", ref, currentTime);
  useProperty("loop", ref, loop);
  useProperty("preload", ref, preload);
  useProperty("primaryColor", ref, primaryColor);
  useProperty("letterboxColor", ref, letterboxColor);
  useProperty("volume", ref, volume);
  useProperty("playbackRate", ref, playbackRate);

  // instantiate API after properties are bound because we want undefined
  // values to be set before defining the properties
  useEffect(() => {
    const Stream = safelyAccessStreamSDK();
    if (iframeRef.current && Stream) {
      const api = Stream(iframeRef.current);
      ref.current = api;
      const { videoHeight, videoWidth } = api;
      if (videoHeight && videoWidth)
        setVideoDimensions({ videoHeight, videoWidth });
    }
  }, []);

  // bind events
  useEvent("abort", ref, onAbort);
  useEvent("canplay", ref, onCanPlay);
  useEvent("canplaythrough", ref, onCanPlayThrough);
  useEvent("durationchange", ref, onDurationChange);
  useEvent("ended", ref, onEnded);
  useEvent("error", ref, onError);
  useEvent("loadeddata", ref, onLoadedData);
  useEvent("loadedmetadata", ref, onLoadedMetaData);
  useEvent("loadstart", ref, onLoadStart);
  useEvent("pause", ref, onPause);
  useEvent("play", ref, onPlay);
  useEvent("playing", ref, onPlaying);
  useEvent("progress", ref, onProgress);
  useEvent("ratechange", ref, onRateChange);
  useEvent("seeked", ref, onSeeked);
  useEvent("seeking", ref, onSeeking);
  useEvent("stalled", ref, onStalled);
  useEvent("suspend", ref, onSuspend);
  useEvent("timeupdate", ref, onTimeUpdate);
  useEvent("volumechange", ref, onVolumeChange);
  useEvent("waiting", ref, onWaiting);
  useEvent("stream-adstart", ref, onStreamAdStart);
  useEvent("stream-adend", ref, onStreamAdEnd);
  useEvent("stream-adtimeout", ref, onStreamAdTimeout);
  useEvent("resize", ref, (e) => {
    if (ref.current) {
      const { videoHeight, videoWidth } = ref.current;
      setVideoDimensions({ videoHeight, videoWidth });
      onResize && onResize(e);
    }
  });

  return (
    <Container
      className={className}
      responsive={responsive}
      videoDimensions={videoDimensions}
    >
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title={title}
        style={responsive ? responsiveIframeStyles : undefined}
        frameBorder={0}
        height={height}
        width={width}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      />
    </Container>
  );
};
