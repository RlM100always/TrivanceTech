import { useState } from 'react';
import { FileText, Pencil, Trash2, Check, X, Ban } from 'lucide-react';
import { linkify } from '../../utils/linkify';
import type { ChatMessage } from './types';

interface MessageBubbleProps {
  message: ChatMessage;
  /** True when the signed-in user sent this message (right-aligned, editable). */
  mine: boolean;
  /** Admins may delete anyone's message for moderation, but never edit one. */
  canModerate?: boolean;
  onEdit?: (id: string, body: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  /** Extra line under the body — the admin panel uses it for read receipts. */
  footer?: React.ReactNode;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message, mine, canModerate = false, onEdit, onDelete, footer,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.body);
  const [busy, setBusy] = useState(false);

  const deleted = Boolean(message.deleted_at);
  const canEdit = mine && !deleted && Boolean(onEdit);
  const canDelete = (mine || canModerate) && !deleted && Boolean(onDelete);

  const bubbleTone = mine
    ? 'bg-primary-600 text-white rounded-br-sm'
    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm';

  const submitEdit = async () => {
    const next = draft.trim();
    if (!next || next === message.body) { setEditing(false); return; }
    setBusy(true);
    try {
      await onEdit?.(message.id, next);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  if (deleted) {
    return (
      <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[80%] rounded-2xl px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-600">
          <p className="flex items-center gap-1.5 text-sm italic text-gray-400 dark:text-gray-500">
            <Ban size={13} /> This message was deleted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-1.5 ${mine ? 'justify-end' : 'justify-start'}`}>
      {/* Actions sit outside the bubble, before it, so they never overlap the text. */}
      {mine && !editing && (canEdit || canDelete) && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {canEdit && (
            <button
              type="button"
              aria-label="Edit message"
              onClick={() => { setDraft(message.body); setEditing(true); }}
              className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Pencil size={13} />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              aria-label="Delete message"
              onClick={() => { if (confirm('Delete this message?')) onDelete?.(message.id); }}
              className="p-1.5 text-gray-400 hover:text-red-600"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}

      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${bubbleTone}`}>
        {!mine && <p className="text-xs font-semibold opacity-70 mb-0.5">{message.sender_name}</p>}

        {editing ? (
          <div className="space-y-2">
            <textarea
              autoFocus
              value={draft}
              rows={2}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditing(false);
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit(); }
              }}
              className="w-full rounded-lg px-2 py-1 text-sm text-gray-900 bg-white/95 focus:outline-none resize-none"
            />
            <div className="flex items-center gap-2">
              <button type="button" disabled={busy} onClick={submitEdit} aria-label="Save edit" className="p-1">
                <Check size={14} />
              </button>
              <button type="button" onClick={() => setEditing(false)} aria-label="Cancel edit" className="p-1">
                <X size={14} />
              </button>
              <span className="text-[10px] opacity-70">Enter to save · Esc to cancel</span>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {linkify(
              message.body,
              mine
                ? 'underline break-all text-primary-100 hover:text-white'
                : 'underline break-all text-primary-600 dark:text-primary-400 hover:opacity-80'
            )}
          </p>
        )}

        {message.drive_file_id && (
          <a
            href={`https://drive.google.com/file/d/${message.drive_file_id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-1.5 flex items-center gap-1.5 text-xs underline ${
              mine ? 'text-primary-100' : 'text-primary-600 dark:text-primary-400'
            }`}
          >
            <FileText size={13} />
            {message.drive_file_name}
          </a>
        )}

        {message.edited_at && !editing && (
          <span className="block mt-0.5 text-[10px] opacity-60">edited</span>
        )}

        {footer}
      </div>

      {/* Moderation delete for the other party's messages (admin only). */}
      {!mine && canDelete && !editing && (
        <button
          type="button"
          aria-label="Delete message"
          onClick={() => { if (confirm('Delete this message?')) onDelete?.(message.id); }}
          className="p-1.5 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
