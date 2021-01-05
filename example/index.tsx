import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HTMLStreamElement, Stream } from "../.";

const App = () => {
  const ref = React.useRef<HTMLStreamElement>(null);

  return (
    <div>
      <Stream
        streamRef={ref}
        src="4bcf13d23290043d9efb344b56200ebd"
        muted
        autoplay
        controls
      />
      <button
        onClick={() => {
          if (ref.current) {
            ref.current.currentTime = 30;
          }
        }}
      >
        seek to 30s
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
