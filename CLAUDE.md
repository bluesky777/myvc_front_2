# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                 # ng serve → http://localhost:4200
npm test                  # Karma + Jasmine, watch mode in Chrome
ng test --watch=false --browsers=ChromeHeadless          # single CI-style run
ng test --include='**/piar.component.spec.ts'            # run one spec file
npm run watch             # ng build --watch --configuration development
```

There is no lint script and no ESLint config. Formatting is Prettier (`.prettierrc` only sets the `angular` parser for `*.html`); the VS Code workspace sets Prettier as the default formatter.

### Builds are per-school

There is no `environment.ts`. Each school gets its own build only because of `--base-href`:

```bash
npm run buildCasb    # casb.micolevirtual.com
npm run buildCoab    # coab.micolevirtual.com
npm run buildCads    # cads.micolevirtual.com
npm run buildJordan  # coljordan.micolevirtual.com
npm run buildLal     # lalvirtual.edu.co
npm run buildCoal    # coal.micolevirtual.com
```

Output lands in `dist/myvc_front_2/`. The app is served from the `/plus` sub-path of each school domain (`src/index.html` has `<base href="/plus">`, and `src/.htaccess` is copied as an asset to give Apache the SPA rewrite for `/plus/`). Adding a school = adding a `buildX` script.

## Architecture

Angular 17 standalone app (no NgModules anywhere). Bootstrap is `src/main.ts` → `app.config.ts`, which wires the router, `HttpClient` with two functional interceptors, animations, and ngx-toastr.

### Multi-tenancy is resolved at runtime, not build time

[CONSTANTS_URL.ts](src/app/core/CONSTANTS_URL.ts) derives every URL from `window.location.hostname`: `BACK_URL` is `/api` on localhost and `/8myvc/public/api` on a school domain, plus `UPLOADS_URL`, `IMAGES_URL`, and `GENDER_URL` (default avatars). All services import `BACK_URL` from here directly — never hardcode an API host.

### This is a plug-in to a legacy host app

There is no login screen and no auth guard. `authInterceptor` reads `localStorage.xtoken` — written by the surrounding legacy MyVC app — and attaches it as a Bearer token. [DashboardComponent](src/app/pages/dashboard/dashboard.component.ts) calls `POST /login` with an empty body via `ProfileService.getData()`; the backend answers with the `Profile` or with an **empty array**, which is how the app detects "not authorized" and renders the unauthorized state. `DashboardComponent.isProductNotActivated()` additionally hardcodes a hostname denylist that decides whether the sidenav starts open.

`jsonContentTypeInterceptor` sets `Content-Type: application/json` on every request **except** when the body is `FormData` — uploads depend on this so the browser can set the multipart boundary.

### Domain

PIAR (Plan Individual de Ajustes Razonables) — Colombian inclusive-education support plans. The domain vocabulary is Spanish throughout (alumno, grupo, titular = homeroom teacher, asignatura = subject, acudiente = guardian, acta de acuerdo = agreement record, matrícula = enrollment year). Keep new code in the same language; user-facing toasts are Spanish.

Routing is shallow: `/` → `DashboardComponent` (shell with sidenav), with `piar` and `configuration` as children. `ConfigurationComponent` is an empty placeholder.

### The main data flow (PIAR page)

[PiarComponent](src/app/pages/piar/piar.component.ts) is the orchestrator:

1. `GET /grupos` fills the group selector.
2. Picking a group calls `GET /piars-grupos/contexto-de-grupo/{group_id}`, which returns `{ familiarContext, alumnos, alumnos_piar, grupo }` in one payload.
3. The join happens **client-side**: each `alumno` is matched to its `alumnos_piar` row and attached as `Student.studentPiar`.
4. [TablePiarComponent](src/app/pages/piar/components/table-piar/table-piar.component.ts) then filters to students that actually have `studentPiar.id`, and each expanded row hosts the per-student editors.

`YearsService` is the shared config store: `getYears()` and `getPiarConfig()` are fired once from the dashboard and pushed into `BehaviorSubject`s that components read via `yearsService.piarConfig` / `currentYear`. `ProfileService` caches the logged-in `Profile` on the instance so any component can do sync permission checks.

Note that `*matCellDef="let element"` rows are untyped `any`, so the `Student` / `StudentPiar` interfaces are incomplete relative to what templates actually use (`nee`, `nee_descripcion`, `matriculas` are read in the table template but absent from the models). `strictTemplates` is on but does not catch these.

### Saving text: one generic field-update endpoint per table

Every rich-text block goes through [DynamicTextareaComponent](src/app/pages/piar/components/dynamic-textarea/dynamic-textarea.component.ts) (ngx-editor + a shared toolbar in [toolbar-options.ts](src/app/shared/config/toolbar-options.ts)). It emits `{ id, field, text }` (`DynamicTextareaObject`) and picks the service by field name: `apoyo_razonable` / `seguimientos` → `PUT /piars-asignaturas/field`, everything else → `PUT /piars-alumnos/field`. Adding a subject-level field means adding it to that whitelist. `InformePedagogicoComponent` bypasses the shared component but posts the same `{id, field: 'reporte', text}` shape.

### Uploads

[FileUploadComponent](src/app/pages/piar/components/file-upload/file-upload.component.ts) is dual-mode: if a parent has subscribed to the `handleUpload` output (checked with `this.handleUpload.observed`), it delegates and does nothing else; otherwise it runs `defaultHandleUpload` against `POST /piars-alumnos/document`. Actas de acuerdo use the delegating path so [ActasDeAcuerdoComponent](src/app/pages/piar/components/actas-de-acuerdo/actas-de-acuerdo.component.ts) can add `year_id` and hit `/piars-actas-acuerdo/document` instead. Both services build the multipart body through the shared [buildFileRequest](src/app/pages/piar/components/file-upload/utils/build-file-request.ts) and translate `HttpEvent`s into `{status: 'UploadStatus.UPLOADED' | 'IN_PROGRESS' | 'ERROR'}` strings that callers switch on. Deletes send the identifying payload in the DELETE `body`.

`documento2` (the old single acta field) is deprecated — the table only renders it when a legacy value exists; new work goes to the per-matrícula actas.

### Permissions are computed in components, not centralized

Each component decides for itself, off `ProfileService.user`: `tipo === 'Usuario'` means admin, `tipo === 'Profesor'` plus `persona_id === titular_id` means homeroom teacher, `is_superuser` overrides. The same logic is duplicated in `TablePiarComponent.hasTitularOrAdminPermissions`, `FileUploadComponent.hasEditingPermissions`, `ActasDeAcuerdoComponent.hasEditingPermissions`, and `ApoyoAjustesComponent.hasDocenteOrAdminPermissions` — change one and check the others.

### Printing

The pedagogical report is produced by the browser's print dialog, not a PDF library. `src/styles.scss` holds the `@media print` rules and the `hidden-print` / `hidden-screen` / `no-break-print` / `page-vertical` class contract that templates use to swap between screen and paper layout. (`core/styles/print-styles.scss` is imported but currently empty.)

## Conventions

- Standalone components only; declare dependencies in the component's own `imports` array. Material modules are imported per component.
- `@UntilDestroy()` + `.pipe(untilDestroyed(this))` from `@ngneat/until-destroy` for subscription cleanup; constructor injection (not `inject()`) is the norm.
- SCSS per component (`styleUrl`), configured as the schematic default.
- Feature layout: `core/` (cross-cutting services, models, interceptors, URL constants), `features/` (sidenav, asignaturas), `pages/` (routed screens, each owning its `components/`, `services/`, `models/` subfolders).
- Spec files are unmodified CLI scaffolds ("should create"); several components have no spec at all.
