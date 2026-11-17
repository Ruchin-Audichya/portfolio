/** Crawlers, link-preview fetchers, uptime checkers and scripts: never counted as visitors. */
const BOT =
  /bot\b|bot\/|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|preview|whatsapp|telegram|discord|skype|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|vercel|curl|wget|python|httpx|axios|node-fetch|undici|go-http|java\/|okhttp|postman|insomnia/i;

export const isBot = (ua: string | null) => !ua || BOT.test(ua);

export type ParsedUa = { browser: string; os: string; device: "mobile" | "tablet" | "desktop" };

/** Small, dependency-free user-agent reading: good enough for "Chrome on Android, mobile". */
export function parseUa(ua: string): ParsedUa {
  const os = /android/i.test(ua)
    ? "Android"
    : /iphone|ipad|ipod/i.test(ua)
      ? "iOS"
      : /windows/i.test(ua)
        ? "Windows"
        : /mac os x|macintosh/i.test(ua)
          ? "macOS"
          : /cros/i.test(ua)
            ? "ChromeOS"
            : /linux/i.test(ua)
              ? "Linux"
              : "Other";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /samsungbrowser/i.test(ua)
        ? "Samsung Internet"
        : /brave/i.test(ua)
          ? "Brave"
          : /firefox|fxios/i.test(ua)
            ? "Firefox"
            : /chrome|crios/i.test(ua)
              ? "Chrome"
              : /safari/i.test(ua)
                ? "Safari"
                : "Other";
  const device = /ipad|tablet/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))
    ? "tablet"
    : /mobile|iphone|ipod/i.test(ua)
      ? "mobile"
      : "desktop";
  return { browser, os, device };
}
