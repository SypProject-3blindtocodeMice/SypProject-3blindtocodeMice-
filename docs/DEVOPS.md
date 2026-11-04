# FurnaView — Repository, testing, CI/CD and operations
**Recommendation only; reading does not authorize CI edits, installations, commits, pushes or deployment.** Read `AGENTS.md`.

## Recommended repository / contribution workflow
- **Monorepo** containing frontend, .NET solution, docs, tests and approved fixtures; no artificial microservice repositories.
- GitHub or existing hosted Git, protected `main` where available; short-lived feature branches and pull requests reviewed by at least one teammate when feasible.
- Commit an adopted `.editorconfig`, SDK pin `global.json`, lockfiles (`package-lock.json` / `pnpm-lock.yaml` chosen consistently), `.gitignore`, and README after explicit approval.
- Conventional commit messages are optional; meaningful changeset descriptions and a clear PR checklist are required.
- Use decision records (ADRs) for choices with cross-team impact. Preserve separation between 'approved stack' and 'approved coding action'.

## CI recommendation, phased
**CI stage 1 (first approved workflow, PR only):**
1. Checkout code on hosted Linux runner.
2. Set up supported pinned .NET SDK and Node LTS.
3. Restore from lockfiles with caching.
4. `.NET`: format/check, build, unit tests; `npm ci`, TypeScript typecheck, lint, Vitest tests.
5. Report failures and coverage if configured. **No secrets, deploy, artifact publication or automatic dependency PRs.**
**CI stage 2 (after stable application):** integration tests with disposable SQLite; small browser Playwright test, sample-input contract tests; license and dependency checks by approved tools.
**CD later:** only after formal deployment plan; favor manually triggered deployment to approved demonstration environment with credentials in CI secret store, environment approvals, rollback and backup procedure.

## Local developer setup
- Pin SDKs/runtime after adoption; use one package manager for JS.
- No Docker requirement for simplest in-process C# + Vite development. `compose.yaml` only if database or worker integration is approved.
- Provide commands in README **after** they are verified; never instruct agents to run unreviewed network bootstrap scripts.
- Separate synthetic test plans from privately supplied/copyright-protected real plans. No secrets or user plans in Git.

## Quality gates by layer
- C#: domain validation, geometry topology, unit conversion, immutable revision and CO₂ numerical reference cases.
- TypeScript: 2D/3D semantic selection and basic scenario/result interaction.
- Recognition: controlled sample corpus, correction time, predictable failures.
- API: error/validation status, revision conflicts, cancellation and lifecycle.
- Performance: representative 1–5 floors, 5–10 rooms, <=500k visible triangles is initial sizing assumption—not a production promise; measure FPS, interaction response, import and simulation time.

## Security and privacy
- Treat uploaded plans as potentially confidential; validate extensions/content/size, enforce path isolation, retention rules and logging hygiene.
- Do not add telemetry/analytics, external SaaS, cloud databases or AI inference without user decision.
- Review licenses and SBOM/dependency list for third-party native engines and assets before redistribution.

## Agent action gates
Before creating `.github/workflows/*.yml`, package manifests, Dockerfiles, migration scripts or deployment configs, request approval with exact path, command and trigger. Never enable CI/CD by inference. No autonomous push, merge, release, deployment or scheduled action.

## Small initial CI plan for approval
Create ONE PR-only workflow that runs adopted .NET tests and TS typecheck with known pinned versions. Human reviews workflow YAML before first push. The workflow must contain no deployment jobs or repository-write tokens.
