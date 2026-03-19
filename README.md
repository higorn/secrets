# secrets

A secure password/secrets manager built with Ionic/Angular and Capacitor, featuring encrypted vault storage, biometric authentication, and cloud sync via Google Drive.

## Features

- **Vault**: Encrypted storage for passwords and sensitive data, secured by a master password
- **RSA/AES Encryption**: Uses `node-forge` for cryptographic operations
- **Biometric Auth**: Native biometric authentication via `capacitor-native-biometric`
- **Cloud Sync**: Google Drive backup/restore via Google OAuth
- **Autofill**: Native autofill service for iOS and Android
- **i18n**: Supports English and Portuguese translations
- **Platforms**: iOS, Android, and PWA via Capacitor

## Prerequisites

### General Requirements

- **Node.js** >= 12.x (LTS recommended)
- **npm** >= 6.x

### Android Development

- **Android Studio** with SDK installed
- **Android SDK** (API level 21+)
- **Java Development Kit (JDK)** 8 or higher
- **Gradle** (included with Android Studio)

### iOS Development

- **macOS** (required for iOS builds)
- **Xcode** >= 12
- **CocoaPods** (`sudo gem install cocoapods`)
- **Apple Developer Account** (for deployment)

### Additional Tools

- **Capacitor CLI**: `npm install -g @capacitor/cli`
- **Ionic CLI**: `npm install -g @ionic/cli`

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd secrets

# Install main app dependencies
cd app
npm install

# Install Capacitor dependencies
npx cap init "secrets" "com.secrets.app" --web-dir=www
npx cap add android
npx cap sync android
```

### Plugin Setup (Optional)

The app includes two local Capacitor plugins:

```bash
# Already linked as local dependencies in package.json
# Just run npm install and they will be available
```

## Running the App

### Web (Development)

```bash
cd app
npm start
```

Opens at `http://localhost:8100`

### Android

```bash
cd app

# Development with livereload (recommended)
npm run start-android

# Or build and open in Android Studio
npm run build
npx cap open android
```

### iOS

```bash
cd app

# Development with livereload
ionic cap run ios --livereload

# Or build and open in Xcode
npm run build
npx cap open ios
```

### Production Builds

```bash
# Android APK
npm run release-android

# iOS (via Xcode)
ionic capacitor build ios --prod
```

## Project Structure

```
secrets/
├── app/                          # Main Ionic/Angular application
│   ├── src/
│   │   ├── app/                  # Application code
│   │   │   ├── shared/           # Shared components (autofill, cloud-sync)
│   │   │   ├── pages/            # Page components
│   │   │   └── services/          # Angular services
│   │   ├── assets/               # Static assets (icons, images, i18n)
│   │   └── environments/         # Environment configurations
│   └── package.json
├── capacitor-autofill-service/   # Native autofill plugin
│   ├── src/                      # Web interface
│   ├── ios/                      # iOS native code
│   └── android/                  # Android native code
└── capacitor-googleauth-plugin/  # Google OAuth plugin
    ├── src/                      # Web interface
    ├── ios/                      # iOS native code
    └── android/                  # Android native code
```

## Available Scripts

### Main App (app/)

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server on port 8100 |
| `npm run start:android` | Start Android with livereload |
| `npm run build` | Development build (outputs to www/) |
| `npm run build:prod` | Production build with optimizations |
| `npm test` | Run Jest tests in watch mode |
| `npm run lint` | Lint TypeScript and HTML files |
| `npm run e2e` | Run Protractor e2e tests |

### Capacitor Plugins

| Command | Description |
|---------|-------------|
| `npm run build` | Build the plugin |
| `npm run lint` | Run all linters |
| `npm run fmt` | Auto-fix linting and formatting |
| `npm run verify` | Verify iOS, Android, and web builds |

## Environment Configuration

Environment files are located in `src/environments/`:

- `environment.ts` - Development (default)
- `environment.prod.ts` - Production
- `environment.android.ts` - Android-specific overrides

## License

Copyright (C) 2024 secrets

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
