import { Suspense } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

// Not async: with cacheComponents, the session (cookies) and fresh content are read inside
// <Suspense> so the route keeps a static shell. Docs: 02-guides/authentication-with-cache-components.md
export default function AdminPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}
