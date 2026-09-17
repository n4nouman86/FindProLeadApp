---
name: findproleadapp
description: 'Use when working on the FindProLeadApp workspace (FindProLead.Api ASP.NET Core minimal API + FindProLead.WebUI React/Vite frontend). Covers project structure, build/run commands, and conventions for this repo.'
---

# FindProLeadApp

## Structure
- `FindProLead.Api/` — ASP.NET Core Web API (.NET 10) using MVC controllers organized by Vertical Slice Architecture in `Features/<FeatureName>/`, `Program.cs` entry point, OpenAPI enabled in Development.
- `FindProLead.WebUI/` — React 19 + Vite frontend, TypeScript (`react-ts` Vite template, ESLint flat config `eslint.config.js`), organized by feature folders under `src/features/<FeatureName>/` (mirrors backend vertical slices), with `src/shared/` for cross-feature code (e.g. `shared/api/apiClient.ts`).

## Commands
API (from `FindProLead.Api/`):
- `dotnet run` — start the API
- `dotnet build` — build only

WebUI (from `FindProLead.WebUI/`):
- `npm install` — install deps
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Conventions
- API uses Vertical Slice Architecture: each feature lives in its own folder under `Features/<FeatureName>/`, containing its controller, models, and related logic together (not split across shared `Controllers/`, `Models/` folders).
- Controllers use `[ApiController]`, `ControllerBase`; add new endpoints as controller actions, not minimal API routes.
- Frontend also uses Vertical Slice / feature-folder architecture: each feature (auth, users, leads, etc.) lives under `src/features/<FeatureName>/` with its own components, pages, and hooks together (not split across generic `components/`, `pages/` folders). Only truly cross-feature code goes in `src/shared/`.
- Frontend is TypeScript (`.tsx`/`.ts`, not JSX); React context objects/values must live in a separate file from the component (e.g. `authContextDefinition.ts`) and hooks in their own file (e.g. `useAuth.ts`) to satisfy the `react-refresh/only-export-components` ESLint rule.
- No test projects currently exist in either app.
- No EF Core migrations — the user manages the database schema manually (tables are created via raw SQL). Do not run `dotnet ef migrations add`/`remove` or create a `Migrations/` folder; just define the entity + `DbSet` in `AppDbContext.cs` to match the existing table.
- Use `[MaxLength]` data annotations on entity properties (not `IEntityTypeConfiguration`/`OnModelCreating` fluent config) to express column string lengths — keep `AppDbContext` free of `OnModelCreating` overrides.

## CRUD Rules
- Create and Update flows use a centered modal dialog (MUI `Dialog`) in the WebUI, not a side drawer/panel and not a separate page/route.
- Delete is never implemented for any entity — do not add delete endpoints, delete buttons, or delete UI.

