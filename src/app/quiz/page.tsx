"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

const quizQuestions = [
  {
    question: "If the HCF of 65 and 117 is expressible in the form 65m − 117, what is the value of m?",
    options: ["1", "2", "3", "4"],
    correct: 1,
  },
];

export default function QuizPage() {
  const [selected, setSelected] = useState<number | null>(1);

  return (
    <>
      <div className="ph">
        <div className="ph-mesh">
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
        </div>
        <div className="ph-light-tr" />
        <div className="ph-light-left" />
        <div className="ph-aurora" />
        <div className="ph-glass" />
        <div className="ph-noise" />
        <div className="ph-grid" />
        <div className="ph-blobs">
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
        </div>
        <div className="ph-fade" />
        <div className="ph-content">
          <div className="ph-badge">Test Yourself</div>
          <h1>Quiz Center</h1>
          <p>Quizzes, challenges, leaderboards</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Quiz</span>
        </nav>

        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              background: "rgba(255,255,255,.04)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "var(--r)",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "15px", color: "var(--tx-3)" }}>
              Question 1 of 10
            </span>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "var(--warning)" }}>
              <Clock size={16} style={{ marginRight: 6, verticalAlign: "middle" }} /> 04:32
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "6px",
              background: "var(--bd-l)",
              borderRadius: "99px",
              overflow: "hidden",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "10%",
                background: "var(--pri)",
                borderRadius: "99px",
              }}
            />
          </div>

          <p
            style={{
              fontSize: "20px",
              fontFamily: "var(--heading)",
              fontWeight: 700,
              marginBottom: "24px",
              lineHeight: 1.5,
              color: "var(--tx)",
            }}
          >
            {quizQuestions[0].question}
          </p>

          <div
            className="stagger"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            {quizQuestions[0].options.map((opt, i) => (
              <div
                key={i}
                className={`quiz-opt ${selected === i ? "selected" : ""}`}
                onClick={() => setSelected(i)}
                role="radio"
                aria-checked={selected === i}
                tabIndex={0}
              >
                <div className="quiz-letter">
                  {String.fromCharCode(65 + i)}
                </div>
                <span style={{ fontSize: "18px", fontWeight: 500 }}>{opt}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="btn btn-s">&larr; Previous</button>
            <button className="btn btn-g">Next &rarr;</button>
          </div>
        </div>
      </section>
    </>
  );
}
