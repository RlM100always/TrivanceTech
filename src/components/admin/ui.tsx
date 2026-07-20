import React from 'react';

// Shared presentational atoms for the admin panel — keep the pages consistent.

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm ${className}`}>
    {children}
  </div>
);

export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const TONES: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export const Badge: React.FC<{ tone?: keyof typeof TONES; children: React.ReactNode }> = ({ tone = 'gray', children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TONES[tone]}`}>
    {children}
  </span>
);

// Map a status string to a badge tone, used across leads/orders/tasks.
export const STATUS_TONE: Record<string, keyof typeof TONES> = {
  new: 'blue', contacted: 'amber', proposal: 'purple', converted: 'green', closed: 'gray',
  draft: 'gray', sent: 'amber', paid: 'green', cancelled: 'red',
  todo: 'gray', doing: 'blue', done: 'green',
  low: 'gray', medium: 'amber', high: 'red',
  active: 'green', completed: 'green', archived: 'gray',
  // project lifecycle
  planning: 'gray', in_progress: 'blue', review: 'purple', delivered: 'green', on_hold: 'amber',
  // invoice lifecycle
  partial: 'amber', void: 'gray', unpaid: 'red',
};

// Slim progress bar shared by the admin project board and the client portal.
export const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const pct = Math.max(0, Math.min(100, Math.round(value || 0)));
  return (
    <div
      className={`h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? 'bg-green-500' : 'bg-primary-600'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export const EmptyState: React.FC<{ icon?: React.ReactNode; title: string; hint?: string }> = ({ icon, title, hint }) => (
  <div className="text-center py-16 px-6">
    {icon && <div className="mx-auto mb-3 text-gray-300 dark:text-gray-600 flex justify-center">{icon}</div>}
    <p className="text-gray-600 dark:text-gray-300 font-medium">{title}</p>
    {hint && <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{hint}</p>}
  </div>
);

export const Spinner: React.FC = () => (
  <div className="flex justify-center py-16">
    <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function money(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
