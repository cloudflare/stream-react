import { Events } from "../src/Stream";
import { action, HandlerFunction } from "@storybook/addon-actions";

export const streamActionProps: {
  [Key in keyof Required<Events>]: HandlerFunction;
} = {
  onPlay: action("play"),
  onAbort: action("abort"),
  onCanPlay: action("canplay"),
  onCanPlayThrough: action("canplaythrough"),
  onDurationChange: action("durationchange"),
  onEnded: action("ended"),
  onError: action("error"),
  onLoadStart: action("loadstart"),
  onLoadedData: action("loadeddata"),
  onLoadedMetaData: action("loadedmetadata"),
  onPause: action("pause"),
  onPlaying: action("playing"),
  onProgress: action("progress"),
  onRateChange: action("ratechange"),
  onSeeked: action("seeked"),
  onSeeking: action("seeking"),
  onStalled: action("stalled"),
  onStreamAdEnd: action("stream-adend"),
  onStreamAdStart: action("stream-adstart"),
  onStreamAdTimeout: action("stream-adtimeout"),
  onSuspend: action("suspend"),
  onTimeUpdate: action("timeupdate"),
  onVolumeChange: action("volumechange"),
  onWaiting: action("waiting"),
};
