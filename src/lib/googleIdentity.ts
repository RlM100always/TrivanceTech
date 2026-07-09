// Minimal ambient types for the Google Identity Services script loaded in index.html.
// (No official @types package covers this API surface.)
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: { access_token?: string; error?: string }) => void;
}

interface GoogleTokenClient {
  requestAccessToken: () => void;
}

interface GoogleAccountsGlobal {
  id: {
    initialize: (config: GoogleIdConfig) => void;
    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
    prompt: () => void;
  };
  oauth2: {
    initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient;
  };
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccountsGlobal };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

function waitForGoogle(): Promise<GoogleAccountsGlobal> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window.google?.accounts) return resolve(window.google.accounts);
      if (Date.now() - start > 10000) return reject(new Error('Google Identity Services failed to load'));
      setTimeout(check, 100);
    };
    check();
  });
}

export async function renderGoogleSignInButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void
): Promise<void> {
  const accounts = await waitForGoogle();
  accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => onCredential(response.credential),
  });
  accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    width: 320,
    text: 'continue_with',
  });
}

/**
 * Incremental OAuth: requests a short-lived Drive access token (drive.file scope only —
 * the app can only see files it creates, never the user's whole Drive). Used only when
 * a client actually uploads a file, not at sign-in time.
 */
export function requestDriveAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    waitForGoogle().then((accounts) => {
      const client = accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: DRIVE_SCOPE,
        callback: (response) => {
          if (response.access_token) resolve(response.access_token);
          else reject(new Error(response.error ?? 'Drive authorization was not granted'));
        },
      });
      client.requestAccessToken();
    }, reject);
  });
}
