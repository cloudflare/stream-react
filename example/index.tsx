import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Stream, StreamPlayerApi } from "../.";
import { useState } from "react";

function useLocalStorageState<T>(key: string, defaultValue: T) {
  const valueFromLocalStorage = localStorage.getItem(key);

  const [value, setValue] = useState<T>(
    valueFromLocalStorage === null
      ? defaultValue
      : JSON.parse(valueFromLocalStorage)
  );

  return [
    value,
    (update: T) => {
      if (typeof update === "function") {
        setValue((prev: T) => {
          const newValue = update(prev);
          localStorage.setItem(key, JSON.stringify(newValue));
          return newValue;
        });
      } else {
        localStorage.setItem(key, JSON.stringify(update));
        setValue(update);
      }
    },
  ] as const;
}

type Primitive = string | number | boolean;

function useInput<T extends Primitive>(
  name: string,
  defaultValue: T,
  props: Omit<JSX.IntrinsicElements["input"], "value" | "checked" | "onChange">
) {
  const [value, setValue] = useLocalStorageState(name, defaultValue);
  return {
    value,
    input: (
      <label
        style={{
          display: "inline-block",
          border: "1px solid",
          padding: "4px 8px",
        }}
      >
        {name}{" "}
        <input
          {...props}
          checked={typeof value === "boolean" ? value : undefined}
          value={
            typeof value === "string" || typeof value === "number"
              ? value
              : undefined
          }
          onChange={(e) =>
            setValue(
              defaultValue.constructor(
                typeof defaultValue === "boolean"
                  ? e.target.checked
                  : e.target.value
              )
            )
          }
        />
      </label>
    ),
  };
}

const App = () => {
  const ref = React.useRef<StreamPlayerApi>(null);

  const autoplay = useInput("autoplay", true, { type: "checkbox" });
  const muted = useInput("muted", true, { type: "checkbox" });
  const loop = useInput("loop", true, { type: "checkbox" });
  const controls = useInput("controls", true, { type: "checkbox" });
  const responsive = useInput("responsive", true, { type: "checkbox" });
  const volume = useInput("volume", 1, {
    type: "range",
    min: 0,
    max: 1,
    step: 0.01,
  });

  return (
    <div>
      <Stream
        streamRef={ref}
        src="4bcf13d23290043d9efb344b56200ebd"
        muted={muted.value}
        loop={loop.value}
        controls={controls.value}
        responsive={responsive.value}
        autoplay={autoplay.value}
        volume={volume.value}
      />
      <div>
        {volume.input}
        {muted.input}
        {autoplay.input}
        {loop.input}
        {controls.input}
        {responsive.input}
      </div>
      <button
        onClick={() => {
          if (ref.current) {
            ref.current.currentTime = 30;
          }
        }}
      >
        seek to 30s
      </button>
      <button
        onClick={() => {
          if (ref.current) {
            ref.current.play();
          }
        }}
      >
        play
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
