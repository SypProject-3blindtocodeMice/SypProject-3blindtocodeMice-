# FurnaView — Floor-plan import and recognition
**No execution authorization.** Read `AGENTS.md`; never install Python packages, download weights, open external plan datasets, or process private drawings without approval.

## Recommended selection
For first implementation, use a **two-path technical spike** on identical approved test inputs:
- **Baseline C#: OpenCvSharp** (native OpenCV wrapper). Advantage: avoids a new runtime, shares deployment with backend.
- **Research path Python: OpenCV + scikit-image**. Advantage: convenient image-processing exploration and ML ecosystem.
**Default decision rule:** keep recognition in C# if detection quality and iteration speed are comparable; adopt an isolated Python worker only if measured recognition accuracy, useful tooling or research iteration warrants it. Do not implement both permanently.

## Scope / supported inputs
- First: a known manually defined vector/JSON fixture, then PNG/JPEG plans from controlled examples with known scale.
- PDF/vector conversion can follow explicit file-format ADR and test samples.
- Never promise arbitrary scans, handwriting, or universal door/window recognition. Recognition is assistive and followed by review/correction.

## Proposed pipeline
1. Validate file/size/readability and usage rights.
2. Normalize resolution, orientation, thresholding; retain pixel-to-meter transform.
3. Detect candidate line segments and wall groups (classical CV).
4. Infer closed room candidates and openings only where confidence/evidence is adequate.
5. Return candidate semantic objects + confidence/evidence/issues, not final `BuildingModel`.
6. User edits candidates in 2D and invokes C# validation.
7. Only confirmed valid model becomes authoritative.

## Candidate DTOs
`RecognitionRequest`: input asset ID, optional explicit scale/reference length, detector/config version.
`DetectionCandidate`: candidate ID, type, pixel geometry, real-world geometry when calibration exists, confidence if meaningful, source regions/trace.
`RecognitionResult`: model candidate revision, coordinate transform, warnings, unsupported feature list, per-item issues.

## Measuring quality
- Prepare 10–20 usage-cleared plans; split across distinct drawing styles.
- Record wall precision/recall, room closure quality, missed openings, manual correction minutes, processing latency and failure mode.
- Include low-contrast and unusual cases; do not summarize performance as universal recognition accuracy.
- Label undetermined confidence as unknown instead of inventing a number.

## If a Python worker is approved
Prefer a bounded, local executable/process with JSON/file input and output in MVP; use HTTP only if streaming/concurrency justifies service complexity. Pin Python environment and model assets. Apply timeout, cancellation, error handling, CPU/memory limits and test against deterministic fixtures. Do not use remote inference or paid AI APIs without separate permission.

## First independently approvable spike
On three controlled sample plans, detect wall line segments and return a preview overlay + quantitative correction log, **without storing canonical building changes**.
