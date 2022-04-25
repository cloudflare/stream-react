export function validSrcUrl(str: string) {
  try {
    const url = new URL(str);
    return (
      url.hostname.endsWith("videodelivery.net") ||
      url.hostname.endsWith("cloudflarestream.com")
    );
  } catch {
    return false;
  }
}
