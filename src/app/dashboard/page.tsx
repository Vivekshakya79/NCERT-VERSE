"use client";

import Link from "next/link";
import { Flame, FileEdit, Trophy, Download, Hand } from "lucide-react";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

const dashboardStats = [
  { label: "Study Hours", value: "14.5", change: "↑ 23%", changeType: "up" as const },
  { label: "Chapters", value: "28", change: "↑ 4", changeType: "up" as const },
  { label: "Quiz Avg", value: "82%", change: "↑ 5%", changeType: "up" as const },
  { label: "Streak", value: "7", change: "Best!", changeType: "up" as const },
];

const activityIcons: Record<string, React.ReactNode> = {
  "📝": <FileEdit size={20} />,
  "🏆": <Trophy size={20} />,
  "📥": <Download size={20} />,
};

const recentActivity = [
  { icon: "📝", title: "Trigonometry Notes", meta: "2h ago" },
  { icon: "🏆", title: "Quiz: 9/10", meta: "5h ago" },
  { icon: "📥", title: "Formula Sheet", meta: "Yesterday" },
];

const subjectProgress = [
  { name: "Mathematics", percent: 72 },
  { name: "Science", percent: 58 },
  { name: "English", percent: 85 },
  { name: "SST", percent: 45 },
];

export default function DashboardPage() {
  return (
    <>
      <div className="ph">
      <AmbientBackground />
        <div className="ph-fade" />
        <div className="ph-content">
          <div className="ph-badge">Dashboard</div>
          <h1>Welcome back, Vivek <Hand size={22} style={{ display: "inline", verticalAlign: "middle" }} /></h1>
          <p>7-day streak active!</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Dashboard</span>
        </nav>

        <div className="d-grid stagger">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="d-stat">
              <small>{stat.label}</small>
              <b>{stat.value}{stat.label === "Streak" && <Flame size={18} style={{ display: "inline", verticalAlign: "middle", color: "var(--pri-xl)" }} />}</b>
              <span className="up">{stat.change}</span>
            </div>
          ))}
        </div>

        <div className="g g-3 stagger">
          <div
            style={{
              background: "rgba(255,255,255,.04)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "var(--r)",
              padding: "28px",
            }}
          >
            <h4 style={{ fontSize: "20px", marginBottom: "16px" }}>
              Recent Activity
            </h4>
            {recentActivity.map((activity) => (
              <div
                key={activity.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: "rgba(37,99,235,.03)",
                  borderRadius: "12px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "20px" }} aria-hidden="true">
                  {activityIcons[activity.icon] || activity.icon}
                </span>
                <div>
                  <b
                    style={{
                      fontSize: "15px",
                      display: "block",
                      color: "var(--tx)",
                    }}
                  >
                    {activity.title}
                  </b>
                  <span style={{ fontSize: "13px", color: "var(--tx-3)" }}>
                    {activity.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.04)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "var(--r)",
              padding: "28px",
            }}
          >
            <h4 style={{ fontSize: "20px", marginBottom: "16px" }}>
              Progress
            </h4>
            {subjectProgress.map((subj) => (
              <div key={subj.name} style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "15px",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{subj.name}</span>
                  <span style={{ color: "var(--tx-3)" }}>{subj.percent}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "var(--bd-l)",
                    borderRadius: "99px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${subj.percent}%`,
                      background: "linear-gradient(90deg, var(--pri), var(--pri-xl))",
                      borderRadius: "99px",
                      transition: "width 600ms ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--bd)",
              borderRadius: "var(--r)",
              padding: "24px",
              boxShadow: "var(--sh)",
            }}
          >
            <h4 style={{ fontSize: "20px", marginBottom: "16px" }}>
              Bookmarks
            </h4>
            <p style={{ color: "var(--tx-3)", fontSize: "15px" }}>
              Your bookmarked chapters will appear here.
            </p>
            <button
              className="btn btn-s"
              style={{ marginTop: "12px" }}
              onClick={() => {
                try {
                  const bms = JSON.parse(
                    localStorage.getItem("sv-bookmarks") || "[]"
                  );
                  if (bms.length === 0) {
                    const toast = document.querySelector(".toast-container");
                    // Use simple alert as fallback in client component
                    alert("No bookmarks yet. Browse classes and bookmark chapters!");
                  } else {
                    alert(
                      `You have ${bms.length} bookmark${
                        bms.length > 1 ? "s" : ""
                      }!`
                    );
                  }
                } catch {
                  alert("No bookmarks yet.");
                }
              }}
            >
              View Bookmarks
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
