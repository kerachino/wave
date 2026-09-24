"use client";

// ご依頼（プロジェクト）の切り替え。
// 1件のときは名前だけを表示し、2件以上のときは選択できます。

import { projectTitle, type Project } from "@/lib/projects";

export function ProjectSwitcher({
  projects,
  selectedId,
  onSelect,
  className = "",
}: {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  if (projects.length === 0) return null;
  const current = projects.find((project) => project.id === selectedId) ?? projects[0];

  if (projects.length === 1) {
    return (
      <p
        className={`inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-card ${className}`}
      >
        <span aria-hidden="true" className="text-brand">
          ▤
        </span>
        {projectTitle(current)}
      </p>
    );
  }

  return (
    <label
      className={`inline-flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 text-sm shadow-card ${className}`}
    >
      <span className="font-bold text-ink-mute">ご依頼</span>
      <select
        value={current.id}
        onChange={(event) => onSelect(event.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm font-bold text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {projectTitle(project)}
          </option>
        ))}
      </select>
      <span className="text-xs text-ink-mute">{projects.length}件のご依頼</span>
    </label>
  );
}
