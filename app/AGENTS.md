# AGENTS.md - e-Secrets Development Guide

## Project Overview

This is an Ionic/Angular 11 mobile application for managing secrets (passwords, cards, bank accounts, identities, etc.). Built with Capacitor for native mobile deployment.

## Build/Lint/Test Commands

### Development
```bash
npm start                    # Start dev server (http://localhost:8100)
npm run start-android        # Run on Android device/emulator with live reload
```

### Build
```bash
npm run build                # Development build (outputs to www/)
npm run build-prod           # Production build with optimization
npm run release-android      # Build release APK for Android
```

### Testing
```bash
npm test                     # Run Jest tests in watch mode
```

### Running a Single Test
```bash
# To run a single test file, use Jest's --testPathPattern flag:
npx jest --testPathPattern="vault.service.spec.ts"

# Or to run a specific test:
npx jest --testPathPattern="vault.service.spec.ts" --testNamePattern="should encode and decode"
```

### Linting
```bash
npm run lint                 # Run ESLint on src/**/*.ts and src/**/*.html
```

### Other
```bash
npm run e2e                 # Run Protractor e2e tests
```

## Code Style Guidelines

### General
- **Indentation**: 2 spaces (configured in `.editorconfig`)
- **Quotes**: Single quotes in TypeScript files
- **Charset**: UTF-8
- **Line endings**: Unix (LF)
- **Trailing whitespace**: Trimmed
- **Final newline**: Inserted

### TypeScript Conventions

#### Naming
- **Classes**: PascalCase (e.g., `VaultService`, `SecretRepository`)
- **Interfaces**: PascalCase (e.g., `Entity`, `Secret`)
- **Variables/functions**: camelCase (e.g., `getAll()`, `storageService`)
- **Constants**: camelCase or PascalCase for enums (e.g., `FormType.password`)
- **Component selectors**: `kebab-case` with `app` prefix
- **Directive selectors**: `camelCase` with `app` prefix

#### Component/Class Suffixes
Angular components must use either `Page` or `Component` suffix:
```typescript
export class SecretDetailPage implements OnInit { }  // Page components
export class MasterBtnComponent implements OnInit { } // UI components
```

#### Import Organization
1. Angular core imports (`@angular/*`)
2. Third-party libraries (`rxjs`, `ionicons`, etc.)
3. App imports (relative paths: `../shared/`, `src/app/shared/`)

Example:
```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { TranslatorService } from 'src/app/shared/translator.service';
import { v4 as uuid } from 'uuid';
import { FormType, Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';
import { MasterBtnService } from 'src/app/shared/master-btn.service';
```

#### Decorators
- Use `@Injectable({ providedIn: 'root' })` for singleton services
- Use `@Component` with `selector`, `templateUrl`, `styleUrls`
- Use standard Angular lifecycle hooks: `ngOnInit`, `ngOnDestroy`

#### Access Modifiers
- Use `private` for internal class members
- Use `public` only when needed for template access
- Constructor injection is preferred:
```typescript
constructor(
  private repository: SecretRepository,
  private fb: FormBuilder,
  private route: ActivatedRoute,
) {}
```

### HTML/Template Conventions

- Use Ionic components (`<ion-header>`, `<ion-content>`, `<ion-list>`, etc.)
- Use `*ngIf` and `*ngFor` with `ngSwitch` when needed
- Event binding: `(click)="handler()"`
- Property binding: `[property]="value"`
- Two-way binding: `[(ngModel)]` or `[formControlName]`
- Translation: `{{ 'key' | translate }}`

### RxJS Patterns
- Use Observables with pipeable operators
- Use `async` pipe in templates when possible
- Use `Subscription` management (unsubscribe in `ngOnDestroy`)
```typescript
private subscription: Subscription;
// In ngOnDestroy:
this.subscription && this.subscription.unsubscribe();
```

### Testing Conventions
- Test files: `*.spec.ts` suffix
- Use Jest with `jest-preset-angular`
- Use `fakeAsync` + `tick` for async testing
- Use `TestBed.configureTestingModule` for component tests
- Mock services by extending them:
```typescript
export class MockStorageService extends StorageService {
  getItem(key: string): Observable<any> { ... }
}
```
- Use `ActivatedRouteStub` from `src/app/testing/activated-route-stub.ts` for routing tests

### Angular Strictness
The project enables strict mode in `tsconfig.json`:
- `strictInjectionParameters`
- `strictInputAccessModifiers`
- `strictTemplates`

## Project Structure

```
src/app/
├── app.component.ts          # Root component
├── app.module.ts             # Root module
├── app-routing.module.ts     # Root routing
├── cloud-sync/               # Cloud sync feature
├── password-creation/        # Password creation feature
├── secrets/                  # Secrets management feature
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page components
│   └── shared/               # Secrets-specific services/models
├── settings/                 # Settings feature
├── shared/                    # Shared code across app
│   ├── cloud-sync/           # Cloud sync abstraction
│   ├── repo/                # Repository base classes
│   ├── storage/              # Storage abstraction
│   ├── vault/                # Vault encryption service
│   └── *.service.ts          # Shared services
├── start/                    # App start/entry
├── tabs/                     # Tab navigation
├── testing/                  # Test utilities
│   ├── activated-route-stub.ts
│   └── mock-storage-service.ts
└── wellcome/                # Welcome/onboarding feature
```

## Architecture Patterns

### Repository Pattern
Data access is abstracted through repositories:
- `CrudRepository<T>` - Base CRUD operations
- `SecureRepository<T>` - Extends CrudRepository with vault encryption
- `SecretRepository` - App-specific repository for secrets

### Service Pattern
Services are injectable singletons (`providedIn: 'root'`):
- `VaultService` - Encryption/decryption via node-forge
- `StorageService` - Abstract storage interface
- `CloudSyncService` - Cloud backup/restore interface

## Technology Stack

- **Framework**: Angular 11.2 + Ionic 5.5
- **Language**: TypeScript 4.0.2
- **State**: RxJS 6.6
- **Storage**: @ionic/storage-angular + SQLite
- **Encryption**: node-forge
- **Testing**: Jest 26 + jest-preset-angular
- **Linting**: ESLint 7 + @angular-eslint
- **Mobile**: Capacitor 3
- **Build**: Angular CLI + @ionic/angular-toolkit
