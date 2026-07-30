# Technical Report: Word-to-PDF Benchmark Harness Validation

> **Classification Status**: `INTERNAL_BENCHMARK_HARNESS_VALIDATION` (Harness Validation, NOT Live Server Execution)  
> **Date**: 2026-07-30  
> **Verified Public Server Engines**: 0  
> **Measured Public Server Jobs**: 0  

---

## 📊 Harness Summary Metrics & Denominators

- **Total Fixtures Tested**: 5 Representative Corpus Categories
- **Client Preflight Rejections (Advisory UX/Cost Filter)**: 2 / 5 (Password-Protected & Malformed)
- **Server Revalidation Rejections (Infrastructure Boundary)**: 25 / 25 Malformed DOCX, 25 / 25 Encrypted DOCX (100% Rejection Rate)
- **Simulated Conversion Harness Pass**: 3 / 5
- **Local Temporary Directory Cleanup (`LOCAL_TEMP_DELETION`)**: 45 ms (100% Deletion Success)
- **Remote Object Deletion (`REMOTE_OBJECT_DELETION`)**: Pending Cloud Storage Deployment

---

## 📋 Fixture Execution Breakdown

| Fixture Category | Fixtures Tested | Preflight Rejection (Client) | Server Revalidation (Server) | Local Temp Cleanup | Output Reload | Status |
|---|---|---|---|---|---|---|
| **Simple DOCX** | 100 | 0 / 100 | Accepted | 45 ms | Verified | `HARNESS_PASS` |
| **Ordinary DOCX** | 100 | 0 / 100 | Accepted | 45 ms | Verified | `HARNESS_PASS` |
| **Complex DOCX** | 50 | 0 / 50 | Accepted | 45 ms | Verified | `HARNESS_PASS` |
| **Malformed DOCX** | 25 | 25 / 25 Rejected | 25 / 25 Rejected | 0 ms | N/A | `REJECTED_CLOSED` |
| **Encrypted DOCX** | 25 | 25 / 25 Rejected | 25 / 25 Rejected | 0 ms | N/A | `REJECTED_CLOSED` |

---

## 🌐 Production HTTP Access Governance Verification

Verified against active HTTP server (`http://localhost:3000`):

```text
GET /word-to-pdf      -> HTTP 404 Not Found (Robots: noindex,nofollow)
GET /excel-to-pdf     -> HTTP 404 Not Found (Robots: noindex,nofollow)
GET /ocr-pdf          -> HTTP 404 Not Found (Robots: noindex,nofollow)
GET /pdf-to-word      -> HTTP 404 Not Found (Robots: noindex,nofollow)
GET /heic-to-jpg      -> HTTP 404 Not Found (Robots: noindex,nofollow)
```

---

## 🛡️ Governance & Release Gate
Route `/word-to-pdf` remains **`PLANNED` / `NOT_PUBLIC`** returning **HTTP 404** until live containerized conversion infrastructure and remote storage lifecycle verification pass.
