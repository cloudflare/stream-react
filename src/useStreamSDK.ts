import { useState, useEffect } from "react";

const sdkScriptLocation = "https://embed.videodelivery.net/embed/sdk.latest.js";

export function useStreamSDK() {
  // Because we're storing the Stream function in state, we need to pass a
  // function in that returns it because React will invoke functions that
  // are passed into state
  const [streamSdk, setStreamSdk] = useState(() => window.Stream);

  useEffect(() => {
    if (!streamSdk) {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src='${sdkScriptLocation}']`
      );
      const script = existingScript ?? document.createElement("script");
      script.addEventListener("load", () => {
        // Same thing here, passing in a function that will return window.Stream
        setStreamSdk(() => window.Stream);
      });
      if (!existingScript) {
        script.src = sdkScriptLocation;
        document.head.appendChild(script);
      }
    }
  }, [streamSdk]);

  return streamSdk;
}
