"use client";

import Link from "next/link";
import { useState } from "react";
import { classes } from "@/data/classes";
import { useToast } from "@/contexts/ToastContext";

const adminTabs = [
  { id: "notes", label: "Notes" },
  { id: "classes", label: "Classes" },
  { id: "subjects", label: "Subjects" },
  { id: "chapters", label: "Chapters" },
  { id: "mcqs", label: "MCQs" },
  { id: "solutions", label: "Solutions" },
  { id: "pdfs", label: "PDFs" },
  { id: "users", label: "Users" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("notes");
  const { showToast } = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <h3 style={{ fontSize: "20px" }}>Notes</h3>
              <button
                className="btn btn-g"
                onClick={() => showToast("Note creation form coming soon", "info")}
              >
                + Add Note
              </button>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Real Numbers</b></td>
                    <td>10</td>
                    <td>Maths</td>
                    <td><span className="dot dot-g"></span>Live</td>
                    <td>
                      <button
                        className="btn btn-s"
                        style={{ padding: "6px 14px", fontSize: "14px" }}
                        onClick={() => showToast("Edit mode coming soon", "info")}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td><b>Chemical Reactions</b></td>
                    <td>10</td>
                    <td>Science</td>
                    <td><span className="dot dot-g"></span>Live</td>
                    <td>
                      <button
                        className="btn btn-s"
                        style={{ padding: "6px 14px", fontSize: "14px" }}
                        onClick={() => showToast("Edit mode coming soon", "info")}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td><b>Polynomials</b></td>
                    <td>10</td>
                    <td>Maths</td>
                    <td><span className="dot dot-y"></span>Draft</td>
                    <td>
                      <button
                        className="btn btn-s"
                        style={{ padding: "6px 14px", fontSize: "14px" }}
                        onClick={() => showToast("Edit mode coming soon", "info")}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );
      case "users":
        return (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vivek</td>
                  <td>vivek@email.com</td>
                  <td>Admin</td>
                  <td>
                    <button className="btn btn-s" style={{ padding: "6px 14px", fontSize: "14px" }}>
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <h3 style={{ fontSize: "20px", textTransform: "capitalize" }}>
                {activeTab}
              </h3>
              <button
                className="btn btn-g"
                onClick={() => showToast("Add form coming soon", "info")}
              >
                + Add
              </button>
            </div>
            <div
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--bd)",
                borderRadius: "var(--r)",
                padding: "28px",
                boxShadow: "var(--sh)",
              }}
            >
              <div className="form-group">
                <label htmlFor="adminTitle">Title</label>
                <input id="adminTitle" placeholder="Enter..." />
              </div>
              <div className="form-group">
                <label htmlFor="adminClass">Class</label>
                <select id="adminClass">
                  <option>Select</option>
                  {classes.map((cls) => (
                    <option key={cls.id}>Class {cls.id}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="adminContent">Content</label>
                <textarea id="adminContent" placeholder="Enter..."></textarea>
              </div>
              <button
                className="btn btn-g"
                onClick={() => showToast("Saved successfully", "success")}
              >
                Save
              </button>
            </div>
          </>
        );
    }
  };

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
          <div className="ph-badge">Admin</div>
          <h1>Content Management</h1>
          <p>Add, edit, remove content</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Admin</span>
        </nav>

        <div className="d-grid stagger">
          <div className="d-stat">
            <small>Users</small>
            <b>52,847</b>
            <span className="up">↑ 312</span>
          </div>
          <div className="d-stat">
            <small>Notes</small>
            <b>12,450</b>
          </div>
          <div className="d-stat">
            <small>Quizzes</small>
            <b>1,240</b>
          </div>
          <div className="d-stat">
            <small>MCQs</small>
            <b>5,412</b>
          </div>
        </div>

        <div className="admin-tabs">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "on" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div id="adminContent">{renderContent()}</div>
      </section>
    </>
  );
}
