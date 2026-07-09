import { requestDriveAccessToken } from './googleIdentity';

export interface UploadedDriveFile {
  id: string;
  name: string;
  mimeType: string;
}

/**
 * Uploads a file directly from the browser to the signed-in user's Google Drive
 * (in a dedicated "AiTechWorlds Client Files" folder the app creates on first use)
 * using the drive.file scope access token. The file bytes never touch our backend —
 * only the resulting Drive file id/name get registered via /api/drive/register.
 */
export async function uploadFileToDrive(file: File): Promise<UploadedDriveFile> {
  const accessToken = await requestDriveAccessToken();

  const metadata = { name: file.name, mimeType: file.type || 'application/octet-stream' };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType', {
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
