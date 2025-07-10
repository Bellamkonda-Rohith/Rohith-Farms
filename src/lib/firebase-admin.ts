
// This file is no longer needed with the new user profile creation flow
// and can be safely ignored or deleted.
// We are keeping it to avoid breaking any potential imports, but its functions are not used.

import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

let app: admin.app.App;

export function getFirebaseAdminApp() {
  if (!app) {
    if (admin.apps.length > 0) {
      app = admin.apps[0]!;
    } else {
      if (!serviceAccount) {
        // This check is no longer critical as the function is not actively called.
        console.warn(
          'Firebase service account credentials are not set in the environment variables. This is okay if you are not using Admin SDK features directly.'
        );
        // Return a dummy or existing app to prevent crashing.
        return admin.apps.length > 0 ? admin.apps[0]! : null;
      }
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
  return app;
}
