import React, { useCallback, useEffect, useState } from 'react';
import { FolderKanban, Plus, X, Trash2, ExternalLink, Github } from 'lucide-react';
import {
  api, Project, Milestone, Client, PROJECT_STATUSES, ProjectStatus, formatStatus,
} from '../../utils/adminApi';
import {
  Card, PageHeader, Spinner, EmptyState, Badge, STATUS_TONE, ProgressBar, formatDate,
} from '../../components/admin/ui';

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [active, setActive] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.get<{ projects: Project[] }>(`/api/projects?status=${filter}`)
      .then((d) => setProjects(d.projects))
      .catch((e) => setError(e.message));
  }, [filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get<{ clients: Client[] }>('/api/clients')
      .then((d) => setClients(d.clients))
      .catch(() => { /* the picker just stays empty */ });
  }, []);

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title="Projects"
        subtitle="Delivery status for every client engagement."
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium"
          >
            <Plus size={16} /> New project
          </button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {(['all', ...PROJECT_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === s
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {s === 'all' ? 'All' : formatStatus(s)}
          </button>
        ))}
      </div>

      {!projects ? <Spinner /> : projects.length === 0 ? (
        <Card><EmptyState icon={<FolderKanban size={36} />} title="No projects yet" hint="Create one from a client's order." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id} className="p-4 cursor-pointer hover:border-primary-300 transition-colors">
              <button onClick={() => setActive(p)} className="w-full text-left">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                  <Badge tone={STATUS_TONE[p.status] ?? 'gray'}>{formatStatus(p.status)}</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{p.client_name}</p>
                <ProgressBar value={p.progress} />
                <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
                  <span>{p.milestone_done ?? 0}/{p.milestone_count ?? 0} milestones</span>
                  <span>{p.progress}%</span>
                </div>
                {p.target_date && (
                  <p className="mt-2 text-[11px] text-gray-400">Target {formatDate(p.target_date)}</p>
                )}
              </button>
            </Card>
          ))}
        </div>
      )}

      {creating && (
        <NewProjectModal
          clients={clients}
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); load(); }}
        />
      )}
      {active && (
        <ProjectDrawer
          project={active}
          onClose={() => setActive(null)}
          onChanged={load}
        />
      )}
    </div>
  );
};

const NewProjectModal: React.FC<{
  clients: Client[];
  onClose: () => void;
  onCreated: () => void;
}> = ({ clients, onClose, onCreated }) => {
  const [form, setForm] = useState({ client_id: '', title: '', description: '', target_date: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!form.client_id || !form.title.trim()) { setErr('Client and title are required.'); return; }
    setBusy(true);
    try {
      await api.post('/api/projects', form);
      onCreated();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-md p-5" >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">New project</h2>
            <button onClick={onClose} aria-label="Close"><X size={18} /></button>
          </div>

          <div className="space-y-3">
            <select
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Select a client…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
            </select>
            <input
              placeholder="Project title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
            <textarea
              placeholder="Scope / description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white resize-none"
            />
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Target date
              <input
                type="date"
                value={form.target_date}
                onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </label>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              onClick={submit}
              disabled={busy}
              className="w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium"
            >
              {busy ? 'Creating…' : 'Create project'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ProjectDrawer: React.FC<{
  project: Project;
  onClose: () => void;
  onChanged: () => void;
}> = ({ project, onClose, onChanged }) => {
  const [detail, setDetail] = useState<Project>(project);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    api.get<{ project: Project; milestones: Milestone[] }>(`/api/projects/${project.id}`)
      .then((d) => { setDetail(d.project); setMilestones(d.milestones); })
      .finally(() => setLoading(false));
  }, [project.id]);

  useEffect(() => { load(); }, [load]);

  const patchProject = async (patch: Partial<Project>) => {
    const { project: updated } = await api.patch<{ project: Project }>(`/api/projects/${project.id}`, patch);
    setDetail(updated);
    onChanged();
  };

  // Milestone writes return the recomputed progress, so the bar and the
  // checklist can never disagree with each other.
  const addMilestone = async () => {
    if (!newMilestone.trim()) return;
    const { milestone, progress } = await api.post<{ milestone: Milestone; progress: number }>(
      '/api/milestones', { project_id: project.id, title: newMilestone.trim() }
    );
    setMilestones((prev) => [...prev, milestone]);
    setDetail((prev) => ({ ...prev, progress }));
    setNewMilestone('');
    onChanged();
  };

  const cycleMilestone = async (m: Milestone) => {
    const next = m.status === 'todo' ? 'doing' : m.status === 'doing' ? 'done' : 'todo';
    const { milestone, progress } = await api.patch<{ milestone: Milestone; progress: number }>(
      `/api/milestones/${m.id}`, { status: next }
    );
    setMilestones((prev) => prev.map((x) => (x.id === m.id ? milestone : x)));
    setDetail((prev) => ({ ...prev, progress }));
    onChanged();
  };

  const removeMilestone = async (m: Milestone) => {
    if (!confirm(`Remove milestone "${m.title}"?`)) return;
    const { progress } = await api.del<{ progress: number }>(`/api/milestones/${m.id}`);
    setMilestones((prev) => prev.filter((x) => x.id !== m.id));
    setDetail((prev) => ({ ...prev, progress }));
    onChanged();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white dark:bg-gray-900 overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{detail.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{detail.client_name ?? project.client_name}</p>
          </div>
          <button onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {loading ? <Spinner /> : (
          <div className="space-y-5">
            <div>
              <ProgressBar value={detail.progress} />
              <p className="mt-1 text-xs text-gray-400">{detail.progress}% complete</p>
            </div>

            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              Status
              <select
                value={detail.status}
                onChange={(e) => patchProject({ status: e.target.value as ProjectStatus })}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{formatStatus(s)}</option>)}
              </select>
            </label>

            {detail.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{detail.description}</p>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Milestones</p>
              <div className="space-y-1.5">
                {milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => cycleMilestone(m)}
                      className="flex-1 flex items-center gap-2 text-left text-sm py-1"
                      title="Click to cycle todo → doing → done"
                    >
                      <Badge tone={STATUS_TONE[m.status] ?? 'gray'}>{m.status}</Badge>
                      <span className={m.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}>
                        {m.title}
                      </span>
                    </button>
                    <button
                      onClick={() => removeMilestone(m)}
                      aria-label={`Remove ${m.title}`}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {milestones.length === 0 && (
                  <p className="text-xs text-gray-400">No milestones yet — add the first deliverable below.</p>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <input
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMilestone(); } }}
                  placeholder="Add a milestone…"
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white"
                />
                <button onClick={addMilestone} className="px-3 rounded-xl bg-primary-600 text-white" aria-label="Add milestone">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Links & delivery</p>
              <LinkField label="Live URL" icon={<ExternalLink size={13} />} value={detail.live_url ?? ''} onSave={(v) => patchProject({ live_url: v })} />
              <LinkField label="Repo URL" icon={<Github size={13} />} value={detail.repo_url ?? ''} onSave={(v) => patchProject({ repo_url: v })} />
              <LinkField label="Deliverable link" value={detail.deliverable_url ?? ''} onSave={(v) => patchProject({ deliverable_url: v })} />
              {/* Large builds go over WhatsApp — this records that they were sent. */}
              <LinkField
                label="Delivery note"
                value={detail.delivery_note ?? ''}
                placeholder="e.g. Final build sent via WhatsApp"
                onSave={(v) => patchProject({ delivery_note: v })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LinkField: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
  onSave: (value: string) => void | Promise<void>;
}> = ({ label, value, placeholder, icon, onSave }) => {
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);

  return (
    <label className="block text-[11px] text-gray-500 dark:text-gray-400">
      <span className="inline-flex items-center gap-1">{icon}{label}</span>
      <input
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { if (draft !== value) onSave(draft); }}
        className="mt-0.5 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm text-gray-900 dark:text-white"
      />
    </label>
  );
};

export default AdminProjects;
