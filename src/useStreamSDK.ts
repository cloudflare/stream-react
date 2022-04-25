import { useState, useEffect } from "react";

const sdkScriptLocation =
  "https://embed.cloudflarestream.com/embed/sdk.latest.js";

// This needs to be wrapped as such for two reasons:
// - Stream is a function, and useState invokes functions immediately and uses the return value.
// - We need to check typeof on window to ensure safety for server side rendering.
export const safelyAccessStreamSDK = () => {
  if (typeof window === "undefined") return undefined;
  return window.Stream;
};

export function useStreamSDK() {
  const [streamSdk, setStreamSdk] = useState(safelyAccessStreamSDK);

  useEffect(() => {
    if (!streamSdk) {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src='${sdkScriptLocation}']`
      );
      const script = existingScript ?? document.createElement("script");
      script.addEventListener("load", () => {
        setStreamSdk(safelyAccessStreamSDK);
      });
      if (!existingScript) {
        script.src = sdkScriptLocation;
        document.head.appendChild(script);
      }
    }
  }, [streamSdk]);

  return streamSdk;
}
