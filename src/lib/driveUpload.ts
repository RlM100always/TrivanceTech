import { requestDriveAccessToken } from './googleIdentity';

export interface UploadedDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

const FOLDER_NAME = 'AiTechWorlds Client Files';
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB — Chat attachments only, not bulk storage

// Cached for the current tab session so repeat uploads don't re-search/re-create.
let cachedFolderId: string | null = null;

async function getOrCreateClientFilesFolder(accessToken: string): Promise<string> {
  if (cachedFolderId) return cachedFolderId;

  const query = `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&spaces=drive`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (searchRes.ok) {
    const data = await searchRes.json() as { files?: Array<{ id: string }> };
    if (data.files && data.files.length > 0) {
      cachedFolderId = data.files[0].id;
      return cachedFolderId;
    }
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
  });
  if (!createRes.ok) {
    throw new Error('Could not create Drive folder for client files.');
  }
  const created = await createRes.json() as { id: string };
  cachedFolderId = created.id;
  return cachedFolderId;
}

/**
 * Uploads a file directly from the browser to the signed-in user's Google Drive,
 * into a dedicated "AiTechWorlds Client Files" folder (created on first use, reused
 * after), using the drive.file scope access token. The file bytes never touch our
 * backend — only the resulting Drive file id/name get registered via
 * /api/drive/register.
 */
export async function uploadFileToDrive(file: File): Promise<UploadedDriveFile> {
  // Portal attachments are capped on purpose — large deliverables are exchanged
  // over WhatsApp, so the message points there rather than to a bigger limit.
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File is too large (max ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB). ` +
      'Please send large files over WhatsApp, or paste a share link in the chat.'
    );
  }

  const accessToken = await requestDriveAccessToken();
  const folderId = await getOrCreateClientFilesFolder(accessToken);

  const metadata = { name: file.name, mimeType: file.type || 'application/octet-stream', parents: [folderId] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Drive upload failed: ${res.status} ${text}`);
  }

  return res.json();
}
