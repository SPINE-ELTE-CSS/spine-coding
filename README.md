# SPINE coding interface

Web interface for human coding of SPINE panel posts with the proselytism codebook (v1.1 and later versions).
ELTE Centre for Social Sciences, SPINE WP4.

**Live:** https://spine-elte-css.github.io/spine-coding/

## What it does
- Step-by-step coding along the codebook's decision tree (EN/HU interface), blind to other coders and to the sampling key
- Every save is logged (append-only audit trail); codebook version stored with each coding
- Inter-coder agreement: Krippendorff's alpha per decision node (nominal; MASI for code sets; interval for confidence), per-post heatmap, first point of divergence, coder-pair confusion matrices
- Adjudication into a gold standard
- Analysis by metadata (country, panel, stratum…), codebook-issue list
- Exports (XLSX): per coder, all codings long/wide, gold standard, agreement report, log, codebook versions
- Admin: data import (XLSX/CSV, any time), assignment with overlap, coder roles, codebook editor with versioning and recoding requests

## Architecture
Single static page (`index.html`) + Supabase (Postgres, Auth, Row Level Security). The publishable key in the page is public by design; access is enforced by RLS in the database. No data is stored in this repository.

## Editing
Edit files in `src/`, then run `python build.py` to regenerate `index.html`.

## References
Krippendorff, K. (2018). *Content Analysis* (4th ed.). Sage. · Hayes, A. F. & Krippendorff, K. (2007). *Communication Methods and Measures* 1(1). · Passonneau, R. (2006). Measuring agreement on set-valued items (MASI). *LREC 2006*.
