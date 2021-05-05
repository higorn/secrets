// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  gapi: {
    CLIENT_ID:
      '633467320706-bge9vru1vqt8r02qaguctgl1174a7r8l.apps.googleusercontent.com',
    API_KEY: 'AIzaSyCQqq3jkzmiZcFM3eSwZe-XXoWdiNtUgUE',
    DISCOVERY_DOCS: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ],
    SCOPES: 'https://www.googleapis.com/auth/drive',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
