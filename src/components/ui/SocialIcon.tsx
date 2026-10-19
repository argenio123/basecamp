import type { SocialPlatform } from "@/content/types";

export type { SocialPlatform };

export default function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.9" r=".9" fill="currentColor" stroke="none" className="social-icon-fill" />
      </svg>
    );
  }

  if (platform === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M14.2 8.2h3V4.5c-.7-.1-1.9-.3-3.4-.3-3.1 0-5.2 1.9-5.2 5.4v2.9H5.2v4.1h3.4V24h4.2v-7.4h3.5l.6-4.1h-4.1V10c0-1.2.3-1.8 1.4-1.8Z" />
      </svg>
    );
  }

  if (platform === "TikTok") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.1a6.3 6.3 0 1 0 5.4 6.3V8.6a8 8 0 0 0 4.7 1.5V6.7a4.7 4.7 0 0 1-4.7-4.7Z" />
      </svg>
    );
  }

  if (platform === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true" focusable="false">
        <path fillRule="evenodd" d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.6 3.1-5.6 3.1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
    </svg>
  );
}
