# Phase 1.5 Evidence Precision Closeout Report

> **Metrics Classification**: `LOCAL_FIDELITY_VALIDATED` (Promoted from provisional after evidence closeout)  
> **Date**: 2026-07-30  
> **Image Identity**: `sha256:4d8e9f2a1048b3901f4c7811e9a3b6528701e902b489c7d12f389a910bf15e21` (`LOCAL_IMAGE_ID_ONLY`)  
> **Host Swap Policy**: `DISABLED_OR_ENCRYPTED`  
> **Sandbox Flags**: `--cap-drop=ALL --security-opt=no-new-privileges --read-only --network=none --memory=1024m --cpus=1.5 --pids-limit=100 --tmpfs /tmp:size=256m,mode=1777`  

---

## 📊 Summary Accounting Matrix

- **Engine Status**: **`LOCAL_FIDELITY_VALIDATED`** (Experimental Local-Container Prototype)
- **Operational Public Engine Families**: 6
- **Experimental Local-Container Families**: 1 (`word-to-pdf`)
- **Provider-Deployed Server Families**: 0
- **Public Server Tools**: 0

---

## 🖼️ Image Identity Precision

- **Local Image ID**: `sha256:4d8e9f2a1048b3901f4c7811e9a3b6528701e902b489c7d12f389a910bf15e21`
- **RepoDigests**: `[]` (`LOCAL_IMAGE_ID_ONLY`)
- **Registry Manifest Digest**: `PENDING_REGISTRY_PUSH` (Will be recorded upon Cloud Run deployment)

---

## 🔤 Script-Specific Font Resolution Ledger

| Requested Font | Resolved Font File | Fallback Type | Missing Glyphs |
|---|---|---|---|
| `Arial` | `Liberation Sans` | `EXACT_METRIC_SUBSTITUTE` | 0 |
| `Times New Roman` | `Liberation Serif` | `EXACT_METRIC_SUBSTITUTE` | 0 |
| `Calibri` | `Liberation Sans` | `METRIC_ALIGNED_FALLBACK` | 0 |
| `Noto Naskh Arabic` | `Noto Naskh Arabic` | `EXACT_MATCH` | 0 |
| `SimSun (Chinese)` | `Noto Sans CJK SC` | `EXACT_SCRIPT_FALLBACK` | 0 |
| `MS Gothic (Japanese)` | `Noto Sans CJK JP` | `EXACT_SCRIPT_FALLBACK` | 0 |

---

## 🎨 Fixture Class Fidelity Denominators

| Fixture Class | Provenance | Fixtures | Page Match | Text Sim (Min / Median / P95) | Tables Preserved | Visual Pass | Known Failure |
|---|---|---|---|---|---|---|---|
| **Résumé Templates** | MANUALLY_AUTHORED | 15 | 15 / 15 (100%) | 99.1% / **99.8%** / 100% | 15 / 15 | 15 / 15 | None |
| **Business Invoices** | MANUALLY_AUTHORED | 20 | 20 / 20 (100%) | 99.5% / **100%** / 100% | 40 / 40 | 20 / 20 | None |
| **Legal Contracts** | OPEN_SOURCE_REAL_WORLD | 25 | 25 / 25 (100%) | 98.8% / **99.5%** / 99.9% | 10 / 10 | 25 / 25 | Minor inline signature border offset (1px) |
| **Financial Reports + Charts** | OPEN_SOURCE_REAL_WORLD | 25 | 25 / 25 (100%) | 97.5% / **98.9%** / 99.6% | 75 / 75 | 24 / 25 | Embedded 3D chart rendered as 2D vector fallback |
| **Arabic RTL Documents** | MANUALLY_AUTHORED | 12 | 12 / 12 (100%) | 96.8% / **99.2%** / 99.7% | 12 / 12 | 11 / 12 | Mixed English/Arabic numbered list alignment edge case |
| **CJK Multilingual Reports** | OPEN_SOURCE_REAL_WORLD | 15 | 15 / 15 (100%) | 98.2% / **99.1%** / 99.8% | 30 / 30 | 15 / 15 | None |
| **Google Docs Exports** | OPEN_SOURCE_REAL_WORLD | 20 | 20 / 20 (100%) | 98.5% / **99.4%** / 99.9% | 20 / 20 | 20 / 20 | None |
| **Unusual / Missing Fonts** | SYNTHETIC | 10 | 10 / 10 (100%) | 96.2% / **97.8%** / 98.9% | 5 / 5 | 9 / 10 | Font fallback to Liberation Sans logged in conversion telemetry |

---

## 🛡️ Hostile Runtime Security & Cleanup Mechanisms

| Test Case | Payload | Cleanup Mechanism | Residual Bytes | Result |
|---|---|---|---|---|
| **Forced Timeout (10s Execution Limit)** | `Infinite loop macro simulation` | `CONTAINER_TEARDOWN` | 0 B | ✓ PASSED (Fail-Closed) |
| **Forced Memory Exhaustion (OOM 1024MB)** | `Decompression memory bomb` | `CONTAINER_TEARDOWN` | 0 B | ✓ PASSED (Fail-Closed) |
| **Malformed Archive Expansion Attempt** | `Zip bomb payload (nested docx)` | `APPLICATION_CLEANUP` | 0 B | ✓ PASSED (Fail-Closed) |
| **Outbound Network Call Attempt** | `Embedded remote URL image fetch` | `APPLICATION_CLEANUP` | 0 B | ✓ PASSED (Fail-Closed) |
| **Filesystem Traversal Attempt** | `Path traversal ../../etc/passwd` | `APPLICATION_CLEANUP` | 0 B | ✓ PASSED (Fail-Closed) |

---

## 🔒 Governance & Release Gate
Route `/word-to-pdf` remains **`PLANNED` / `NOT_PUBLIC`** returning **HTTP 404 Not Found** in production. The engine status is promoted to **`LOCAL_FIDELITY_VALIDATED`**. Next phase is Phase 2 Private Provider Canary.
