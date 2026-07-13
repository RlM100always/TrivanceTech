import React, { useEffect, useState } from 'react';
import { Plus, Trash2, CheckSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import { api, Task } from '../../utils/adminApi';
import { Card, PageHeader, Badge, STATUS_TONE, Spinner, formatDate } from '../../components/admin/ui';

const COLUMNS: Array<{ key: Task['status']; label: string }> = [
  { key: 'todo', label: 'To Do' },
  { key: 'doing', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  const load = () => api.get<{ tasks: Task[] }>('/api/tasks').then((d) => setTasks(d.tasks)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const move = async (task: Task, dir: 1 | -1) => {
    const idx = COLUMNS.findIndex((c) => c.key === task.status);
    const next = COLUMNS[idx + dir];
    if (!next) return;
    setTasks((prev) => prev?.map((t) => (t.id === task.id ? { ...t, status: next.key } : t)) ?? null);
    await api.patch(`/api/tasks/${task.id}`, { status: next.key }).catch(() => load());
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    setTasks((prev) => prev?.filter((t) => t.id !== id) ?? null);
    await api.del(`/api/tasks/${id}`).catch(() => load());
  };

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title="Tasks"
        subtitle="Track work across every client project."
        action={
          <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
            <Plus size={16} /> New task
          </button>
        }
      />

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {adding && <NewTaskForm onClose={() => setAdding(false)} onCreated={(t) => { setTasks((p) => [t, ...(p ?? [])]); setAdding(false); }} />}

      {!tasks ? <Spinner /> : (
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {COLUMNS.map((col) => {
            const items = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{col.label}</h2>
                  <span className="text-xs text-gray-400">{items.length}</span>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {items.map((t) => {
                    const colIdx = COLUMNS.findIndex((c) => c.key === t.status);
                    return (
                      <Card key={t.id} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</p>
                          <button onClick={() => remove(t.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                        {t.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.description}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge tone={STATUS_TONE[t.priority]}>{t.priority}</Badge>
                          {t.client_name && <span className="text-[11px] text-gray-400">{t.client_name}</span>}
                          {t.due_date && <span className="text-[11px] text-gray-400">due {formatDate(t.due_date)}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <button onClick={() => move(t, -1)} disabled={colIdx === 0} className="text-xs text-gray-400 hover:text-primary-600 disabled:opacity-30 flex items-center"><ChevronLeft size={14} />Back</button>
                          <button onClick={() => move(t, 1)} disabled={colIdx === COLUMNS.length - 1} className="text-xs text-gray-400 hover:text-primary-600 disabled:opacity-30 flex items-center">Next<ChevronRight size={14} /></button>
                        </div>
                      </Card>
                    );
                  })}
                  {items.length === 0 && (
                    <div className="text-center py-6 text-gray-300 dark:text-gray-600">
                      <CheckSquare size={24} className="mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const NewTaskForm: React.FC<{ onClose: () => void; onCreated: (t: Task) => void }> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const { task } = await api.post<{ task: Task }>('/api/tasks', { title, description, priority, due_date: due || undefined });
      onCreated(task);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-4 mb-2">
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title *" className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white sm:col-span-2" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white sm:col-span-2" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white capitalize">
          {['low', 'medium', 'high'].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input value={due} onChange={(e) => setDue(e.target.value)} type="date" className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" />
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={submit} disabled={busy} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium disabled:opacity-60">{busy ? 'Adding…' : 'Add task'}</button>
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">Cancel</button>
      </div>
    </Card>
  );
};

export default AdminTasks;
