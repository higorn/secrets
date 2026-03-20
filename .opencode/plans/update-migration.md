# Migrating Ionic/Angular project to latest versions

**Session ID:** ses_2f832e21effeQscyA3TRhnObTH
**Created:** 3/19/2026, 9:32:56 PM
**Updated:** 3/19/2026, 9:55:07 PM

---

## User

This project was create many years ago using an old version of Ionic and Angular and Capacitor. I want to update to the most up-to-date versions of those frameworks/tools. Create a detailed plan to implement this change.

---

## Assistant

I'll explore your project to understand the current state and then create a detailed migration plan.

**Tool: task**

---

## Assistant

Now let me research the latest versions and create a detailed plan:

**Tool: context7_resolve-library-id**

**Tool: context7_resolve-library-id**

---

## Assistant

**Tool: context7_query-docs**

**Tool: context7_query-docs**

**Tool: context7_resolve-library-id**

---

## Assistant

**Tool: context7_query-docs**

---

## Assistant

Based on my exploration, this is a **substantial migration** - you're jumping 7+ major versions in Angular, Ionic, and Capacitor. Let me present my findings and ask some clarifying questions:

**Tool: question**

---

## Assistant

## Migration Plan: Ionic/Angular/Capacitor Upgrade

### Current State Summary
| Component | Current | Target |
|-----------|---------|--------|
| **Angular** | 11.2.0 | 18.x |
| **Ionic** | 5.5.2 | 8.x |
| **Capacitor** | 3.0.0 | 6.x |
| **TypeScript** | 4.0.2 | 5.x |
| **RxJS** | 6.6.0 | 7.x |

---

### Phase 1: Preparation & Backup
1. **Create a backup branch** - `git checkout -b backup-pre-migration`
2. **Backup vault encryption logic** - Document the node-forge RSA/AES implementation since it must remain compatible
3. **Audit custom plugins** - capacitor-autofill-service and capacitor-googleauth-plugin need iOS/Android updates

---

### Phase 2: Project Scaffolding (New structure)
1. **Create a fresh Ionic 8 + Angular 18 project** to examine modern conventions:
   ```bash
   npm i -g @ionic/cli@latest
   ionic start secrets-new blank --type=angular
   cd secrets-new && ng update @angular/core@18 @angular/cli@18
   ```
2. **Study new project structure** - Compare with your current `src/app/` layout

---

### Phase 3: Dependency Upgrades (Sequential)

**Step 3.1: Update TypeScript & RxJS first**
- TypeScript 4.0 → 5.x
- RxJS 6.6 → 7.x (many breaking changes to `toPromise()`, operators)

**Step 3.2: Angular 11 → 17 (iterative)**
Use Angular CLI migrations:
```bash
ng update @angular/cli@17 @angular/core@17 --allow-dirty --force
```
Then fix breaking changes. Repeat for 17→18.

**Key Angular breaking changes to address:**
- `@angular/common/http` - `HttpClientModule` deprecated, use `provideHttpClient()`
- Router - `CanLoad` deprecated, use `CanMatch`
- `@Output()` - Event emitter patterns changed
- Standalone components becoming default (Angular 17+)

**Step 3.3: Ionic 5 → 7 → 8**
```bash
npm install @ionic/angular@7 @ionic/angular-toolkit@9
# Then after Angular 18
npm install @ionic/angular@8
```

**Key Ionic breaking changes:**
- Toast/AlertController imports changed
- CSS variables renamed
- `IonicModule.forRoot()` replaced with `provideIonic()`

**Step 3.4: Capacitor 3 → 6**
```bash
npm i -D @capacitor/cli@latest-6
npx cap migrate
```

**Key Capacitor 6 changes:**
- `androidScheme` defaults to `https` - must set to `http` in capacitor.config.json
- Plugin API changes (Status Bar, Device)
- iOS minimum deployment target raised

---

### Phase 4: Codebase Refactoring

**4.1 Standalone Components (Angular 17+)**
- Convert all components to standalone
- Remove NgModule architecture
- Update `app.module.ts` → `app.config.ts`

**4.2 New Angular Patterns**
- Replace `HttpClientModule` with `provideHttpClient()`
- Update router guards to functional guards
- Replace `@ViewChild` with `viewChild()` signal
- Replace `@Output` EventEmitter with `output()` signal

**4.3 Ionic Updates**
- Replace `IonicModule.forRoot()` with `provideIonic()` in app.config.ts
- Update lazy loading syntax
- Fix CSS variable names (deprecated ones)

**4.4 RxJS 7 Updates**
- Replace `.toPromise()` with `firstValueFrom()` or `lastValueFrom()`
- Update operator imports

---

### Phase 5: Custom Capacitor Plugins Update

**5.1 Update plugin structure** for Capacitor 6:
- Update `@capacitor/core` to `^6.0.0`
- Update `@capacitor/android` to `^6.0.0`
- Update `@capacitor/ios` to `^6.0.0`
- Rebuild with `npm run build`

**5.2 iOS updates:**
- Update iOS deployment target to 13+
- Update Swift code for new Capacitor APIs
- Rebuild with updated SwiftLint

**5.3 Android updates:**
- Update Gradle files for Capacitor 6
- Update Kotlin code if needed
- Bump `android:minSdkVersion` if required

---

### Phase 6: Testing & Verification

1. **Unit tests** - Update Jest config and fix failing tests
2. **Build verification**:
   ```bash
   npm run build
   npm run build -- --configuration=production
   ```
3. **Capacitor sync & build**:
   ```bash
   npx cap sync android
   cd android && ./gradlew assembleDebug
   ```
4. **E2E tests** - Update Protractor if needed

---

### Phase 7: Native Platform Specifics

**Android:**
- Update `build.gradle` files
- Test APK on physical device
- Verify biometric auth still works
- Test autofill service

**iOS:**
- Update Podfile
- Run pod install
- Test on physical device (Xcode required)

---

### Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Vault data corruption | Keep node-forge crypto logic identical; test decryption with old data |
| Plugin breakage | Update plugins incrementally, test each after Cap 6 upgrade |
| Angular router changes | Heavy testing of navigation flows |
| iOS build failures | May need Xcode updates, minimum iOS 13 |

---

### Estimated Complexity: **Very High**
This is a 7+ year version jump across all frameworks. Expect **significant refactoring time** (possibly weeks depending on test coverage).

### Questions before proceeding:
1. Do you have a physical iOS device and Xcode for iOS testing?
2. Is there existing test coverage ( Jest/Protractor) that can guide regression testing?
3. Do you have a way to test the vault decryption with old data, or do you need a test fixture?

---

