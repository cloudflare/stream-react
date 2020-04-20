import React from "react";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";

import { Stream } from "../src";
import { streamActionProps } from "./actions";

const volumeOptions = {
  range: true,
  min: 0,
  max: 1,
  step: 0.1,
};

const defaultVideo = "644822f93dcddab3e9441587d184ca2f";

export default {
  title: "Basic examples",
  decorators: [withKnobs],
};

export const src = () => {
  return (
    <Stream src={text("src", defaultVideo)} controls {...streamActionProps} />
  );
};

export const fixedDimensions = () => {
  return (
    <Stream
      width="400px"
      height="400px"
      src={defaultVideo}
      controls
      {...streamActionProps}
    />
  );
};

export const muted = () => {
  const muted = boolean("muted", true);

  return (
    <Stream src={defaultVideo} muted={muted} loop {...streamActionProps} />
  );
};

export const volume = () => {
  const volume = number("volume", 1, volumeOptions);

  return (
    <Stream
      src={defaultVideo}
      volume={volume}
      controls
      loop
      {...streamActionProps}
    />
  );
};

export const controls = () => {
  const controls = boolean("controls", true);

  return (
    <Stream
      src={defaultVideo}
      controls={controls}
      loop
      muted
      {...streamActionProps}
    />
  );
};

export const autoplay = () => {
  return (
    <Stream
      src={defaultVideo}
      autoplay
      controls
      loop
      muted
      {...streamActionProps}
    />
  );
};

export const poster = () => {
  const controls = boolean("controls", true);

  const poster = text(
    "poster",
    "https://videodelivery.net/644822f93dcddab3e9441587d184ca2f/thumbnails/thumbnail.jpg?time=109s&height=1200"
  );

  return (
    <Stream
      src={defaultVideo}
      controls={controls}
      poster={poster}
      {...streamActionProps}
    />
  );
};

export const adUrl = () => {
  return (
    <Stream
      src={defaultVideo}
      adUrl={text(
        "adUrl",
        "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator="
      )}
      controls
      {...streamActionProps}
    />
  );
};

adUrl.story = {
  decorators: [
    withKnobs({
      // Necessary to prevent adUrl from being escaped
      // https://github.com/storybookjs/storybook/issues/4445
      escapeHTML: false,
    }),
  ],
};
