"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { House } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="page-404">
      <div className="num404">404</div>
      <h2>Page Not Found</h2>
      <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Link href="/" className="btn btn-p">
          <House size={16} style={{ marginRight: 8 }} /> Go Home
        </Link>
        <button className="btn btn-s" onClick={() => router.back()}>
          ← Go Back
        </button>
      </div>
    </div>
  );
}
