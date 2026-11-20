import type { Metadata } from "next";
import AuthCard from "@/components/members/AuthCard";

export const metadata: Metadata = {
  title: "Member log in",
  description: "Log in to your BaseCamp CamSur member account to request sessions, send inquiries, book, and purchase.",
  robots: { index: false, follow: false },
};

export default function MemberLoginPage() {
  return <AuthCard mode="login" />;
}
