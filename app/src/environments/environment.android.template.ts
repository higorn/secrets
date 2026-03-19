// Template environment file - DO NOT COMMIT SECRETS
// Copy this to environment.android.secret.ts and fill in real values
// environment.android.secret.ts is gitignored

export const environment = {
  production: false,

  gapi: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
    API_KEY: 'YOUR_GOOGLE_API_KEY',
    DISCOVERY_DOCS: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ],
    SCOPES: 'https://www.googleapis.com/auth/drive',
  },
};
