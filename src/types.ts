import { MutableRefObject } from "react";

declare global {
  interface Window {
    Stream?: (iframe: HTMLIFrameElement) => StreamPlayerApi;
  }
}

export type Preload = "auto" | "metadata" | "none" | boolean;

export interface VideoDimensions {
  videoHeight: number;
  videoWidth: number;
}

export interface StreamPlayerApi {
  /**
   * Subscribe to events
   */
  addEventListener: (event: string, handler: EventListener) => void;
  /**
   * VAST tag for displaying ads
   */
  adUrl?: string;
  /**
   * Tells the browser to immediately start downloading the video and play it as soon as it can. Note that mobile browsers generally do not support this attribute, the user must tap the screen to begin video playback. Please consider mobile users or users with Internet usage limits as some users don’t have unlimited Internet access before using this attribute.
   *
   * To disable video autoplay, the autoplay attribute needs to be removed altogether as this attribute. Setting autoplay="false" will not work; the video will autoplay if the attribute is there in the <stream> tag.
   *
   * In addition, some browsers now prevent videos with audio from playing automatically. You may add the mute attribute to allow your videos to autoplay. For more information, [go here](https://webkit.org/blog/6784/new-video-policies-for-ios/).
   */
  autoplay: boolean;
  /**
   * Shows the default video controls such as buttons for play/pause, volume controls. You may choose to build buttons and controls that work with the player. If you hide controls, you may choose to build custom buttons and controls that work with the player.
   */
  controls: boolean;
  /**
   * Returns the current playback time in seconds. Setting this value seeks the video to a new time.
   */
  currentTime: number;
  /**
   * A Boolean attribute; if included the player will automatically seek back to the start upon reaching the end of the video.
   */
  loop: boolean;
  /**
   * A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced.
   */
  muted: boolean;
  /**
   * Pause the video
   */
  pause: () => void;
  /**
   * Attempts to play the video. Returns a promise that will resolve if playback begins successfully, and rejects if it fails. The most common reason for this to fail is browser policies which prevent unmuted playback that is not initiated by the user.
   */
  play: () => Promise<void>;
  /**
   * A URL for an image to be shown before the video is started or while the video is downloading. If this attribute isn’t specified, a thumbnail image of the video is shown.
   */
  poster?: string;
  /**
   * This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. You may choose to include this attribute as a boolean attribute without a value, or you may specify the value preload="auto" to preload the beginning of the video. Not including the attribute or using preload="metadata" will just load the metadata needed to start video playback when requested.
   *
   * The <video> element does not force the browser to follow the value of this attribute; it is a mere hint. Even though the preload="none" option is a valid HTML5 attribute, Stream player will always load some metadata to initialize the player. The amount of data loaded in this case is negligable.
   */
  preload: Preload;
  /**
   * Any valid CSS color value provided will be applied to certain elements of the player's UI.
   * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   */
  primaryColor?: string;
  /**
   * Unsubscribe from events
   */
  removeEventListener: (event: string, handler: EventListener) => void;
  /**
   * Either the video id or the signed url for the video you’ve uploaded to Cloudflare Stream should be included here.
   */
  src: string;
  /**
   * Number representing the intrinsic height of the video in pixels. Note that this is specific to the resolution of the actual video depending on the quality being played. For example, a 16:9 video playing at 1080p will have an intrinsic height of 1080.
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight
   */
  videoHeight: number;
  /**
   * Number representing the intrinsic width of the video in pixels. Note that this is specific to the resolution of the actual video depending on the quality being played. For example, a 16:9 video playing at 1080p will have an intrinsic width of 1920.
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth
   */
  videoWidth: number;
  /**
   * Sets volume from 0.0 (silent) to 1.0 (maximum value)
   */
  volume: number;
}

export interface StreamProps {
  /**
   * VAST tag for displaying ads
   */
  adUrl?: string;
  /**
   * Tells the browser to immediately start downloading the video and play it as soon as it can. Note that mobile browsers generally do not support this attribute, the user must tap the screen to begin video playback. Please consider mobile users or users with Internet usage limits as some users don’t have unlimited Internet access before using this attribute.
   *
   * To disable video autoplay, the autoplay attribute needs to be removed altogether as this attribute. Setting autoplay="false" will not work; the video will autoplay if the attribute is there in the <stream> tag.
   *
   * In addition, some browsers now prevent videos with audio from playing automatically. You may add the mute attribute to allow your videos to autoplay. For more information, [go here](https://webkit.org/blog/6784/new-video-policies-for-ios/).
   */
  autoplay?: boolean;
  /**
   * CSS class applied to the containing div
   */
  className?: string;
  /**
   * Shows the default video controls such as buttons for play/pause, volume controls. You may choose to build buttons and controls that work with the player. If you hide controls, you may choose to build custom buttons and controls that work with the player.
   */
  controls?: boolean;
  /**
   * Returns the current playback time in seconds. Setting this value seeks the video to a new time.
   */
  currentTime?: number;
  /**
   * Will initialize the player with the specified text track enabled. The value should be the BCP-47 language code that was used to [upload the text track](https://developers.cloudflare.com/stream/uploading-videos/adding-captions).
   * Note: This will _only_ work once during initialization. Beyond that point the user has full control over their text track settings.
   */
  defaultTextTrack?: string;
  /**
   * The height of the video’s display area, in CSS pixels.
   */
  height?: string;
  /**
   * A Boolean attribute; if included the player will automatically seek back to the start upon reaching the end of the video.
   */
  loop?: boolean;
  /**
   * A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced.
   */
  muted?: boolean;
  /**
   * A URL for an image to be shown before the video is started or while the video is downloading. If this attribute isn’t specified, a thumbnail image of the video is shown.
   */
  poster?: string;
  /**
   * This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. You may choose to include this attribute as a boolean attribute without a value, or you may specify the value preload="auto" to preload the beginning of the video. Not including the attribute or using preload="metadata" will just load the metadata needed to start video playback when requested.
   *
   * The <video> element does not force the browser to follow the value of this attribute; it is a mere hint. Even though the preload="none" option is a valid HTML5 attribute, Stream player will always load some metadata to initialize the player. The amount of data loaded in this case is negligable.
   */
  preload?: Preload;
  /**
   * Any valid CSS color value provided will be applied to certain elements of the player's UI.
   * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   */
  primaryColor?: string;
  /**
   * Automatically manages the aspect ratio of the iframe for you. Defaults to true. If you want to manually handle the styles yourself, set this to false.
   */
  responsive?: boolean;
  /**
   * Either the video id or the signed url for the video you’ve uploaded to Cloudflare Stream should be included here.
   */
  src: string;
  /**
   * A timestamp that specifies the time when playback begins.
   * If a plain number is used such as ?startTime=123, it will
   * be interpreted as 123 seconds. More human readable timestamps
   * can also be used, such as ?startTime=1h12m27s for 1 hour,
   * 12 minutes, and 27 seconds.
   */
  startTime?: string | number;
  /**
   * Ref for accessing the underlying stream element. Useful for providing imperative access to the player API:
   * https://developers.cloudflare.com/stream/viewing-videos/using-the-player-api
   */
  streamRef?: MutableRefObject<StreamPlayerApi | undefined>;
  /**
   * Title of the iframe that the player will load within.
   *
   * From the MDN docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#accessibility_concerns
   *
   * People navigating with assistive technology such as a screen reader can use the title attribute on an <iframe> to label its content. The title's value should concisely describe the embedded content.
   * Without this title, they have to navigate into the <iframe> to determine what its embedded content is. This context shift can be confusing and time-consuming, especially for pages with multiple <iframe>s and/or if embeds contain interactive content like video or audio.
   */
  title?: string;
  /**
   * Sets volume from 0.0 (silent) to 1.0 (maximum value)
   */
  volume?: number;
  /**
   * The width of the video’s display area, in CSS pixels.
   */
  width?: string;
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
   * Sent when the video's intrinsic dimensions (videoHeight & videoWidth) change.
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight
   */
  onResize?: EventListener;
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
}
