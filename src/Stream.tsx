import React, {
  useRef,
  useEffect,
  RefObject,
  MutableRefObject,
  FC,
} from "react";

const scriptLocation =
  "https://embed.videodelivery.net/embed/r4xu.fla9.latest.js";

let streamScript = document.querySelector<HTMLScriptElement>(
  `script[src="${scriptLocation}"]`
);

function useStreamElement(
  containerRef: RefObject<HTMLDivElement>,
  streamRef: MutableRefObject<HTMLStreamElement | null>
) {
  // Need to create stream element with document.createElement
  // because React will log console warnings if we render
  // invalid HTML elements in JSX
  useEffect(() => {
    if (!containerRef.current) return;
    // grab current container from ref so we can use it in the
    // callback we return for cleanup.
    const container = containerRef.current;
    const stream = document.createElement("stream") as HTMLStreamElement;

    // store stream element on ref
    streamRef.current = stream;

    // insert stream element into dom
    container.appendChild(stream);
    return () => {
      // clean up before unmounting or re-running the effect
      container.removeChild(stream);
    };
  }, [streamRef, containerRef]);
}

declare global {
  interface Window {
    __stream?: {
      init: () => void;
      initElement: (streamElement: HTMLStreamElement) => void;
    };
  }
}

/**
 * Script to load the player. This initializes the player on the stream element
 */
function useStreamScript(ref: RefObject<HTMLStreamElement>) {
  useEffect(() => {
    if (streamScript === null) {
      streamScript = document.createElement("script");
      streamScript.setAttribute("data-cfasync", "false");
      streamScript.setAttribute("defer", "true");
      streamScript.setAttribute("type", "text/javascript");
      streamScript.setAttribute("src", scriptLocation);
      document.head.appendChild(streamScript);
      return;
    }

    const streamElement = ref.current;
    if (window.__stream && streamElement) {
      window.__stream.initElement(streamElement);
    }

    // no dependencies in the dependancy array means this only fires on mount
    // and the cleanup only fires on unmount.
  }, []);
}

// Creating a type alias for this so we can modify properties on it later
export type HTMLStreamElement = HTMLVideoElement;

type Primitive = string | number | boolean;

/**
 * Hook for syncing attributes to an element when they change
 */
function useAttribute(
  attributeName: string,
  ref: RefObject<HTMLStreamElement>,
  value?: Primitive
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    // explicitly checking for false or undefined to remove attribbutes
    //  so that other falsy values such as 0 or "" may be set
    if (value === false || value === undefined) {
      el.removeAttribute(attributeName);
    } else {
      el.setAttribute(attributeName, value.toString());
    }
  }, [attributeName, value, ref]);
}

/**
 * Hook for syncing properties to an element when they change
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
  ref: RefObject<HTMLStreamElement>,
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

type AttributeProps = {
  /**
   * Either the video id or the signed url for the video you’ve uploaded to Cloudflare Stream should be included here.
   */
  src: string;
  adUrl?: string;
  /**
   * The height of the video’s display area, in CSS pixels.
   */
  height?: string;
  /**
   * The width of the video’s display area, in CSS pixels.
   */
  width?: string;
  /**
   * A URL for an image to be shown before the video is started or while the video is downloading. If this attribute isn’t specified, a thumbnail image of the video is shown.
   */
  poster?: string;
};

type PropertyProps = {
  /**
   * Tells the browser to immediately start downloading the video and play it as soon as it can. Note that mobile browsers generally do not support this attribute, the user must tap the screen to begin video playback. Please consider mobile users or users with Internet usage limits as some users don’t have unlimited Internet access before using this attribute.
   *
   * To disable video autoplay, the autoplay attribute needs to be removed altogether as this attribute. Setting autoplay="false" will not work; the video will autoplay if the attribute is there in the <stream> tag.
   *
   * In addition, some browsers now prevent videos with audio from playing automatically. You may add the mute attribute to allow your videos to autoplay. For more information, [go here](https://webkit.org/blog/6784/new-video-policies-for-ios/).
   */
  autoplay?: boolean;
  /**
   * Shows the default video controls such as buttons for play/pause, volume controls. You may choose to build buttons and controls that work with the player.
   */
  controls?: boolean;
  /**
   * Returns the current playback time in seconds. Setting this value seeks the video to a new time.
   */
  currentTime?: number;
  /**
   * A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced.
   */
  muted?: boolean;
  /**
   * A Boolean attribute; if included the player will automatically seek back to the start upon reaching the end of the video.
   */
  loop?: boolean;
  /**
   * This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. You may choose to include this attribute as a boolean attribute without a value, or you may specify the value preload="auto" to preload the beginning of the video. Not including the attribute or using preload="metadata" will just load the metadata needed to start video playback when requested.
   *
   * The <video> element does not force the browser to follow the value of this attribute; it is a mere hint. Even though the preload="none" option is a valid HTML5 attribute, Stream player will always load some metadata to initialize the player. The amount of data loaded in this case is negligable.
   */
  preload?: "auto" | "metadata" | "none" | boolean;
  /**
   * Sets volume from 0.0 (silent) to 1.0 (maximum value)
   */
  volume?: number;
};

export type Events = {
  /**
   * Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent.
   */
  onAbort?: EventListener;
  /**
   * Sent when enough data is available that the media can be played, at least for a couple of frames.
   */
  onCanPlay?: EventListener;
  /**
   * Sent when the entire media can be played without interruption, assuming the download rate remains at least at the current level. It will also be fired when playback is toggled between paused and playing. Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox. Other browsers might not fire this event.
   */
  onCanPlayThrough?: EventListener;
  /**
   * The metadata has loaded or changed, indicating a change in duration of the media. This is sent, for example, when the media has loaded enough that the duration is known.
   */
  onDurationChange?: EventListener;
  /**
   * Sent when playback completes.
   */
  onEnded?: EventListener;
  /**
   * Sent when an error occurs. (e.g. the video has not finished encoding yet, or the video fails to load due to an incorrect signed URL)
   */
  onError?: EventListener;
  /**
   * The first frame of the media has finished loading.
   */
  onLoadedData?: EventListener;
  /**
   * The media’s metadata has finished loading; all attributes now contain as much useful information as they’re going to.
   */
  onLoadedMetaData?: EventListener;
  /**
   * Sent when loading of the media begins.
   */
  onLoadStart?: EventListener;
  /**
   * Sent when the playback state is changed to paused (paused property is true).
   */
  onPause?: EventListener;
  /**
   * Sent when the playback state is no longer paused, as a result of the play method, or the autoplay attribute.
   */
  onPlay?: EventListener;
  /**
   * Sent when the media has enough data to start playing, after the play event, but also when recovering from being stalled, when looping media restarts, and after seeked, if it was playing before seeking.
   */
  onPlaying?: EventListener;
  /**
   * Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element’s buffered attribute.
   */
  onProgress?: EventListener;
  /**
   * Sent when the playback speed changes.
   */
  onRateChange?: EventListener;
  /**
   * Sent when a seek operation completes.
   */
  onSeeked?: EventListener;
  /**
   * Sent when a seek operation begins.
   */
  onSeeking?: EventListener;
  /**
   * Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
   */
  onStalled?: EventListener;
  /**
   * Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason.
   */
  onSuspend?: EventListener;
  /**
   * The time indicated by the element’s currentTime attribute has changed.
   */
  onTimeUpdate?: EventListener;
  /**
   * Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed).
   */
  onVolumeChange?: EventListener;
  /**
   * Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).
   */
  onWaiting?: EventListener;
  /**
   * Fires when ad-url attribute is present and the ad begins playback
   */
  onStreamAdStart?: EventListener;
  /**
   * Fires when ad-url attribute is present and the ad finishes playback
   */
  onStreamAdEnd?: EventListener;
  /**
   * Fires when ad-url attribute is present and the ad took too long to load.
   */
  onStreamAdTimeout?: EventListener;
};

/**
 * Type helper that forces type checker to evaluate a type.
 */
type Compute<T> = T extends Function ? T : {} & { [Key in keyof T]: T[Key] };

export type StreamProps = Compute<
  {
    /**
     * Ref for accessing the underlying stream element. Useful for providing imperative access to the player API:
     * https://developers.cloudflare.com/stream/viewing-videos/using-the-player-api
     */
    streamRef?: MutableRefObject<HTMLStreamElement | null>;
  } & AttributeProps &
    PropertyProps &
    Events
>;

export const Stream: FC<StreamProps> = ({
  src,
  adUrl,
  controls,
  muted,
  autoplay,
  loop,
  preload,
  height,
  width,
  poster,
  currentTime,
  volume,
  streamRef,
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
  // initialize with no argument to get a mutable ref back instead
  // of readonly RefObject which cannot be mutated directly
  const internalStreamRef = useRef<HTMLStreamElement>(null);
  // Because useRef needs to be called the same number of times
  // across renders, we create an internal ref that we only use
  // when playerRef is not provided
  const ref = streamRef ?? internalStreamRef;
  // initialize with null to get readonly RefObject back since we
  // don't need to mutate this ref
  const containerRef = useRef<HTMLDivElement>(null);

  useStreamElement(containerRef, ref);

  // set attributes
  useAttribute("ad-url", ref, adUrl);
  useAttribute("src", ref, src);
  useAttribute("autoplay", ref, autoplay);
  useAttribute("controls", ref, controls);
  useAttribute("loop", ref, loop);
  useAttribute("preload", ref, preload);
  useAttribute("height", ref, height);
  useAttribute("width", ref, width);
  useAttribute("poster", ref, poster);
  useAttribute("muted", ref, muted);

  // These props need to be set directly on the stream element as properties
  // in order for the player to respond to them when they change
  useProperty("autoplay", ref, autoplay ?? false);
  useProperty("controls", ref, controls ?? false);
  useProperty("currentTime", ref, currentTime ?? 0);
  useProperty("muted", ref, muted ?? false);
  useProperty("loop", ref, loop ?? false);
  useProperty("volume", ref, volume ?? 1);
  useProperty(
    "preload",
    ref,
    typeof preload === "string"
      ? // if it's a string pass as is
        preload
      : // else if it's true, map to auto
      preload === true
      ? "auto"
      : // otherwise (undefined | false) maps to none
        "none"
  );

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

  // stream element is set up from effects, load script
  useStreamScript(ref);

  return <div style={{ height, width }} ref={containerRef} />;
};
