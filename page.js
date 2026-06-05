'use client';

import { useState, useRef } from "react";

const INITIAL_MEMBERS = [
  { id: "dad",  name: "Dad",  initials: "DA", color: "#1D6FA4", bg: "#D4EAFB", role: "Father" },
  { id: "mom",  name: "Mom",  initials: "MO", color: "#9B3D5C", bg: "#F7D4E2", role: "Mother" },
  { id: "alex", name: "Alex", initials: "AL", color: "#2E7A4F", bg: "#C7EDD8", role: "Son · 16" },
  { id: "sara", name: "Sara", initials: "SA", color: "#9C6A1A", bg: "#FAEACB", role: "Daughter · 12" },
];

const COLOR_OPTIONS = [
  { color: "#1D6FA4", bg: "#D4EAFB" },
  { color: "#9B3D5C", bg: "#F7D4E2" },
  { color: "#2E7A4F", bg: "#C7EDD8" },
  { color: "#9C6A1A", bg: "#FAEACB" },
  { color: "#534AB7", bg: "#EEEDFE" },
  { color: "#993C1D", bg: "#FAECE7" },
  { color: "#085041", bg: "#E1F5EE" },
  { color: "#3B3B3B", bg: "#EFEFEF" },
];

const TYPE_ICON = { pdf: "📄", doc: "📝", img: "🖼️", sheet: "📊", other: "📎" };

function typeFromName(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return "pdf";
  if (["doc", "docx"].includes(ext)) return "doc";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "img";
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  return "other";
}

function formatDate(s) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name) {
  return name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", width: 360, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MemberForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [role, setRole] = useState(initial?.role || "");
  const [colorIdx, setColorIdx] = useState(
    initial ? COLOR_OPTIONS.findIndex(c => c.color === initial.color) ?? 0 : 0
  );

  function handleSave() {
    if (!name.trim()) return;
    const chosen = COLOR_OPTIONS[colorIdx] || COLOR_OPTIONS[0];
    onSave({
      id: initial?.id || name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: name.trim(),
      role: role.trim() || "Family Member",
      initials: getInitials(name),
      color: chosen.color,
      bg: chosen.bg,
    });
  }

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Ravi"
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
          autoFocus
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Role</label>
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="e.g. Father, Son · 14"
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 8 }}>Colour</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COLOR_OPTIONS.map((c, i) => (
            <div key={i} onClick={() => setColorIdx(i)} style={{
              width: 28, height: 28, borderRadius: "50%", background: c.color, cursor: "pointer",
              outline: colorIdx === i ? `3px solid ${c.color}` : "3px solid transparent",
              outlineOffset: 2, transition: "outline .15s",
            }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer", fontSize: 13 }}>Cancel</button>
        <button onClick={handleSave} disabled={!name.trim()} style={{
          padding: "8px 18px", borderRadius: 8, border: "none",
          background: name.trim() ? COLOR_OPTIONS[colorIdx].color : "#ccc",
          color: "#fff", cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500,
        }}>Save</button>
      </div>
    </>
  );
}

export default function FamilyCloud() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [docs, setDocs] = useState({ dad: [
    { id: 1, name: "Passport.pdf", type: "pdf", size: "1.2 MB", date: "2024-03-15" },
    { id: 2, name: "Car Insurance 2025.pdf", type: "pdf", size: "840 KB", date: "2025-01-10" },
  ], mom: [
    { id: 3, name: "Medical Records.pdf", type: "pdf", size: "3.4 MB", date: "2025-02-20" },
  ], alex: [], sara: [] });
  const [view, setView] = useState("home");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const [editTarget, setEditTarget] = useState(null);
  const fileRef = useRef();

  const member = members.find(m => m.id === view);
  const currentDocs = (docs[view] || []).filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleFiles(files) {
    if (!files || !files.length || view === "home") return;
    const now = new Date().toISOString().slice(0, 10);
    const newDocs = Array.from(files).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      type: typeFromName(f.name),
      size: f.size > 1e6 ? (f.size / 1e6).toFixed(1) + " MB" : Math.round(f.size / 1024) + " KB",
      date: now,
    }));
    setDocs(prev => ({ ...prev, [view]: [...(prev[view] || []), ...newDocs] }));
    showToast(`${newDocs.length} file${newDocs.length > 1 ? "s" : ""} added to ${member.name}'s folder`);
  }

  function deleteDoc(docId) {
    setDocs(prev => ({ ...prev, [view]: prev[view].filter(d => d.id !== docId) }));
  }

  function handleAddMember(data) {
    setMembers(prev => [...prev, data]);
    setDocs(prev => ({ ...prev, [data.id]: [] }));
    setModal(null);
    showToast(`${data.name}'s folder created`);
  }

  function handleEditMember(data) {
    setMembers(prev => prev.map(m => m.id === data.id ? data : m));
    setModal(null);
    showToast(`${data.name}'s profile updated`);
  }

  function handleDeleteMember() {
    setMembers(prev => prev.filter(m => m.id !== editTarget.id));
    setDocs(prev => { const n = { ...prev }; delete n[editTarget.id]; return n; });
    if (view === editTarget.id) setView("home");
    setModal(null);
    showToast(`${editTarget.name}'s folder removed`);
  }

  function openEdit(e, m) {
    e.stopPropagation();
    setEditTarget(m);
    setModal("edit");
  }

  function openDelete(e, m) {
    e.stopPropagation();
    setEditTarget(m);
    setModal("delete");
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e5e5e5", padding: "0 2rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏠</span>
          <span style={{ fontWeight: 600, fontSize: 16 }}>FamilyVault</span>
          {view !== "home" && <span style={{ color: "#999", fontSize: 14 }}>&nbsp;/ {member?.name}</span>}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {view !== "home" && (
            <input placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: "6px 12px", fontSize: 13, borderRadius: 8, border: "1px solid #ddd", width: 180 }} />
          )}
          {view !== "home" && (
            <button onClick={() => { setView("home"); setSearch(""); }}
              style={{ padding: "6px 14px", fontSize: 13, borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer" }}>
              ← All Folders
            </button>
          )}
        </div>
      </header>

      <main style={{ padding: "2rem", maxWidth: 860, margin: "0 auto" }}>

        {/* HOME VIEW */}
        {view === "home" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>Family Folders</h1>
                <p style={{ fontSize: 14, color: "#666", margin: 0 }}>Click a folder to open it. Hover to edit or delete.</p>
              </div>
              <button onClick={() => setModal("add")} style={{
                padding: "9px 18px", fontSize: 13, fontWeight: 500, borderRadius: 10,
                border: "none", background: "#111", color: "#fff", cursor: "pointer",
              }}>+ Add Member</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {members.map(m => {
                const count = (docs[m.id] || []).length;
                return (
                  <div key={m.id} style={{ position: "relative" }}
                    onMouseEnter={e => e.currentTarget.querySelector(".card-actions").style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.querySelector(".card-actions").style.opacity = "0"}>

                    <button onClick={() => setView(m.id)} style={{
                      width: "100%", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 14,
                      padding: "1.5rem 1.25rem", cursor: "pointer", textAlign: "left",
                      display: "flex", flexDirection: "column", gap: 10, transition: "border-color .15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = m.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e5e5"}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 18, color: m.color }}>{m.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{m.role}</div>
                      </div>
                      <div style={{ fontSize: 12, color: m.color, background: m.bg, padding: "3px 10px", borderRadius: 20, display: "inline-block", fontWeight: 500 }}>
                        {count} file{count !== 1 ? "s" : ""}
                      </div>
                    </button>

                    {/* Edit / Delete buttons — appear on hover */}
                    <div className="card-actions" style={{
                      position: "absolute", top: 10, right: 10,
                      display: "flex", gap: 4, opacity: 0, transition: "opacity .15s",
                    }}>
                      <button onClick={e => openEdit(e, m)} title="Edit" style={{
                        width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e5e5",
                        background: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✏️</button>
                      <button onClick={e => openDelete(e, m)} title="Delete" style={{
                        width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e5e5",
                        background: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[{ label: "Total Files", value: Object.values(docs).flat().length }, { label: "Family Members", value: members.length }, { label: "Storage Used", value: "~25 MB" }].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FOLDER VIEW */}
        {view !== "home" && member && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 14, padding: "1rem 1.25rem" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: member.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: member.color, flexShrink: 0 }}>{member.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{member.name}'s Folder</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{member.role} · {currentDocs.length} file{currentDocs.length !== 1 ? "s" : ""}</div>
              </div>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "none", background: member.color, color: "#fff", cursor: "pointer" }}>
                + Upload
              </button>
              <input type="file" multiple ref={fileRef} style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            </div>

            <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              style={{ background: "#fff", border: dragging ? `2px dashed ${member.color}` : "1px solid #e5e5e5", borderRadius: 14, minHeight: 200, overflow: "hidden" }}>
              {currentDocs.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", color: "#aaa" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{search ? "No files match your search" : "No files yet"}</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{search ? "Try a different keyword" : "Drag & drop or click Upload"}</div>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                      {["Name", "Size", "Date Added", ""].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#888", background: "#fafafa" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentDocs.map((doc, i) => (
                      <tr key={doc.id} style={{ borderBottom: i < currentDocs.length - 1 ? "1px solid #f0f0f0" : "none" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{TYPE_ICON[doc.type] || TYPE_ICON.other}</span>
                          <span style={{ fontWeight: 500 }}>{doc.name}</span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#888", whiteSpace: "nowrap" }}>{doc.size}</td>
                        <td style={{ padding: "12px 16px", color: "#888", whiteSpace: "nowrap" }}>{formatDate(doc.date)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button onClick={() => deleteDoc(doc.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: "#ccc", padding: "2px 6px" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#E24B4A"}
                            onMouseLeave={e => e.currentTarget.style.color = "#ccc"}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#aaa", marginTop: 10, textAlign: "center" }}>Drag & drop files anywhere in the box above to upload</p>
          </>
        )}
      </main>

      {/* ADD MEMBER MODAL */}
      {modal === "add" && (
        <Modal title="Add family member" onClose={() => setModal(null)}>
          <MemberForm onSave={handleAddMember} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* EDIT MEMBER MODAL */}
      {modal === "edit" && editTarget && (
        <Modal title="Edit member" onClose={() => setModal(null)}>
          <MemberForm initial={editTarget} onSave={handleEditMember} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* DELETE CONFIRM MODAL */}
      {modal === "delete" && editTarget && (
        <Modal title="Remove member?" onClose={() => setModal(null)}>
          <p style={{ fontSize: 14, color: "#555", marginTop: 0 }}>
            This will permanently remove <strong>{editTarget.name}</strong> and all their files from FamilyVault.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setModal(null)} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer", fontSize: 13 }}>Cancel</button>
            <button onClick={handleDeleteMember} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#E24B4A", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Yes, remove</button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999 }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}