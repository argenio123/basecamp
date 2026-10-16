export type SocialPlatform = "Instagram" | "Facebook" | "X";

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

  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
    </svg>
  );
}
