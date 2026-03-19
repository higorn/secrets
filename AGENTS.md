# AGENTS.md - secrets Codebase Guide

## Repository Structure

This is a monorepo containing:
- `/app` - Main Ionic/Angular application (Capacitor-based)
- `/capacitor-autofill-service` - Native autofill Capacitor plugin
- `/capacitor-googleauth-plugin` - Google auth Capacitor plugin

## Application Overview

secrets is a password/secrets manager with the following features:
- **Vault**: Encrypted storage for passwords and sensitive data, secured by a master password
- **Crypto**: Uses `node-forge` for RSA key pair generation and AES-CBC encryption
- **Biometric auth**: Native biometric authentication via `capacitor-native-biometric`
- **Cloud sync**: Google Drive backup/restore via `capacitor-googleauth-plugin`
- **Autofill**: Native autofill service via `capacitor-autofill-service`
- **i18n**: Supports English and Portuguese translations
- **Platforms**: iOS, Android, and PWA via Capacitor

### Capacitor Plugins Relationship

Each plugin is linked as a local dependency in `app/package.json`:
```json
"capacitor-autofill-service": "file:../capacitor-autofill-service",
"capacitor-googleauth-plugin": "file:../capacitor-googleauth-plugin"
```

| Plugin | Purpose | Used By |
|--------|---------|---------|
| `capacitor-autofill-service` | Native OS autofill (fill passwords into other apps) | `src/app/shared/autofill/` |
| `capacitor-googleauth-plugin` | Google OAuth for cloud sync | `src/app/shared/cloud-sync/` |

Each plugin has its own native iOS/Android code (`ios/Plugin/`, `android/`), web interface (`src/`), and build configuration.

## Build/Lint/Test Commands

### Main App (app/)

```bash
cd app

# Initial setup (first time only)
npm install
npx cap init "secrets" "com.secrets.app" --web-dir=www
npx cap add android
npx cap sync android

# Development
npm start                    # Start dev server on port 8100
npm run start-android        # Start Android with livereload

# Build
npm run build                # Development build (outputs to www/)
npm run build:prod           # Production build with optimizations

# Testing (Jest)
npm test                     # Run tests in watch mode
npm run test -- --watchAll=false --detectOpenHandles  # Run tests once (CI)
npm run test -- <file-path>  # Run a single test file

# Linting
npm run lint                 # Lint TypeScript and HTML files

# E2E
npm run e2e                  # Run Protractor e2e tests
```

### Capacitor Plugins

```bash
# capacitor-autofill-service
cd capacitor-autofill-service
npm run build                # Build the plugin
npm run lint                 # Run all linters (eslint, prettier, swiftlint)
npm run fmt                  # Auto-fix linting and formatting
npm run verify               # Verify iOS, Android, and web builds

# capacitor-googleauth-plugin
cd capacitor-googleauth-plugin
npm run build                # Build the plugin
npm run lint                 # Run all linters
npm run fmt                  # Auto-fix linting and formatting
npm run verify               # Verify iOS, Android, and web builds
```

## Code Style Guidelines

### General

- **Indentation**: 2 spaces (configured in `.editorconfig`)
- **Character encoding**: UTF-8
- **Line endings**: LF
- **Trailing whitespace**: Trimmed
- **Final newline**: Inserted
- **Quotes**: Single quotes for TypeScript (`quote_type = single` in `.editorconfig`)
- **Markdown**: Trailing whitespace NOT trimmed, max line length off

### Angular/Ionic Conventions

#### Components
- Use `Page` or `Component` suffix for component classes (enforced by ESLint)
- Selector prefix: `app` (e.g., `<app-root>`)
- Component selector style: `kebab-case`
- Directive selector style: `camelCase`
- Template URL and style URLs use array syntax:
  ```typescript
  @Component({
    selector: 'app-example',
    templateUrl: 'example.component.html',
    styleUrls: ['example.component.scss'],
  })
  ```

#### Services
- Use `@Injectable({ providedIn: 'root' })` for services
- Constructor injection for dependencies

#### Imports
- Angular core imports first (`@angular/*`)
- Third-party imports second (e.g., `rxjs`, `node-forge`)
- Local imports last, using relative paths
- Organize imports in logical groups with blank lines between groups

```typescript
import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
```

### TypeScript

- Use strict mode where possible
- Prefer `interface` over `type` for object shapes
- Use proper typing; avoid `any` when possible
- Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate

### Error Handling

- Use `try/catch` blocks for async operations
- Return meaningful error messages
- For vault/crypto operations, throw descriptive `Error` objects

### File Naming Conventions

- TypeScript files: `kebab-case.ts` (e.g., `vault.service.ts`)
- Spec/test files: `*.spec.ts`
- Component files: `*.component.ts`, `*.component.html`, `*.component.scss`
- Page files: `*.page.ts`, `*.page.html`, `*.page.scss`

### Test Conventions (Jest)

- Test files co-located with source files using `*.spec.ts` suffix
- Use `waitForAsync` from `@angular/core/testing` for async tests
- Mock objects defined at top of describe block
- Use `jest.fn()` for spy functions
- Use `TestBed.configureTestingModule` for Angular component testing

```typescript
describe('AppComponent', () => {
  const spyRouter = { navigate: jest.fn() };
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: Router, useValue: spyRouter }],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.debugElement.componentInstance).toBeTruthy();
  });
});
```

### Capacitor Plugins Additional Guidelines

- Follow `@ionic/eslint-config` and `@ionic/prettier-config`
- Use Prettier with `@ionic/prettier-config`
- iOS code must pass SwiftLint
- Build outputs to `dist/` directory
- Generate docs using `docgen` before building

### Linting Configuration

The main app uses:
- `@angular-eslint` for Angular-specific rules
- ESLint 7 with TypeScript support
- Component class suffix enforcement (`Page`, `Component`)
- HTML templates linted separately with `@angular-eslint/template`

### Git Workflow

- Branch naming: Use descriptive names (e.g., `feature/`, `fix/`, `refactor/`)
- Commit messages: Clear, concise descriptions of changes
- No force pushes to main/master branches

### Working with Native Code

#### iOS (Swift)
- Follow SwiftLint rules as configured
- Use `@ionic/swiftlint-config`

#### Android (Java/Kotlin)
- Follow existing code style in the project
- Ensure Gradle builds pass: `./gradlew clean build test`

### Environment Configuration

- Environment files in `src/environments/`
- `environment.ts` - Development (default)
- `environment.prod.ts` - Production
- `environment.android.ts` - Android-specific overrides

### Assets and Resources

- Icons: `src/assets/icons/` (various sizes for PWA/app icons)
- Images: `src/assets/img/`
- i18n: `src/assets/i18n/` (JSON files for translations)
- Splash screens: `resources/` directory
