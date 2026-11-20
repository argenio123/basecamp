import type { Metadata } from "next";
import AuthCard from "@/components/members/AuthCard";

export const metadata: Metadata = {
  title: "Create a member account",
  description: "Create a free BaseCamp CamSur member account to request sessions, send inquiries, book, and purchase.",
  robots: { index: false, follow: false },
};

export default function MemberSignupPage() {
  return <AuthCard mode="signup" />;
}
