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

const height = 432;
const heightPx = `${height}px`;
const widthPx = "768px";

export default {
  title: "Basic examples",
  decorators: [withKnobs],
};

export const adUrl = () => {
  const adUrl =
    "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=";

  return (
    <Stream src={defaultVideo} adUrl={adUrl} controls {...streamActionProps} />
  );
};

export const fluidWidth = () => {
  const width = number("containing div's width", 400, {
    range: true,
    min: 300,
    max: 800,
    step: 1,
  });
  return (
    <div style={{ width }}>
      <Stream width="100%" src={defaultVideo} controls {...streamActionProps} />
    </div>
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
    `https://videodelivery.net/644822f93dcddab3e9441587d184ca2f/thumbnails/thumbnail.jpg?time=109s&height=${height}`
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
