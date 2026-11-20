import type { Metadata } from "next";
import AuthPage from "@/components/members/AuthPage";

export const metadata: Metadata = {
  title: "Create a member account",
  description: "Create a free BaseCamp CamSur member account to request sessions, send inquiries, book, and purchase.",
  robots: { index: false, follow: false },
};

export default function MemberSignupPage() {
  return <AuthPage mode="signup" />;
}
