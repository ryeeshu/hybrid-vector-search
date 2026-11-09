# CPU–GPU Vector Search

Academic project website for **Heterogeneous CPU–GPU Graph-Based Vector Search with Memory-Aware Execution**.

- **Team:** R Yeeshu Dhurandhar (`rdhurand`) and Christian Yu (`cjyu`)
- **Course:** 15-618 — Parallel Computer Architecture and Programming, Fall 2026
- **Institution:** Carnegie Mellon University

## Structure

```text
index.html                  Project homepage
proposal/index.html         Complete formal proposal
assets/styles.css           Shared responsive and print styles
assets/main.js              Print control and deployment URL enhancement
assets/architecture.svg     Standalone technical architecture figure
scripts/check_site.py       HTML, internal link, and asset checks
.github/workflows/deploy.yml GitHub Pages deployment
```

Plain HTML and CSS with minimal JavaScript. No dependencies, backend, build tool, external fonts, or analytics. Page content and navigation work without JavaScript; the browser's Print command remains available.

## Local preview

From the repository root:

```sh
python3 -m http.server 8000
```

Visit <http://localhost:8000/> and <http://localhost:8000/proposal/>.

Validate all local pages, asset paths, and anchor links:

```sh
python3 scripts/check_site.py
```

Tables and the detailed architecture figure scroll within their own regions on small screens. These regions are keyboard-focusable. Both pages have skip navigation, visible focus indicators, and reduced-motion support.

## GitHub Pages deployment

The existing Git remote is `github.com:ryeeshu/hybrid-vector-search`. Its expected Pages address is **https://ryeeshu.github.io/hybrid-vector-search/**. Creating these files does not publish the website.

1. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Commit and push these files to `main`.
3. The **Deploy project website** workflow validates the site, stages only the public files, and deploys them. You can also run it from the **Actions** tab with **Run workflow**.
4. Confirm the deployment URL returned by GitHub Pages.

The workflow uses the Pages-provided URL in the printable proposal. The source includes the URL derived from the existing remote as a fallback for local previews. When visiting another HTTP(S) deployment, the small script derives the homepage URL from the current origin and path. Navigation and assets use relative paths, supporting both root-domain hosting and repository subpaths without editing displayed project content.

For branch-based hosting instead, choose **Deploy from a branch**, `main`, and `/ (root)`. The `.nojekyll` file supports direct static serving; the custom workflow is then unnecessary. GitHub's workflow setup is documented at <https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>.

## Printing the proposal

On `/proposal/`, select **Print / Save as PDF** or use the browser's Print command. Choose **Save as PDF**, Letter paper, and 100% scale. Disable browser-generated headers and footers to avoid local preview URLs in page margins.

The print stylesheet hides navigation and controls, prints the full proposal and reference list, keeps the project URL visible, and removes horizontal scrolling from the schedule. There is no separately generated PDF or empty PDF download link.

## Verification

Checked in Chrome at desktop and 390-pixel mobile widths, including homepage-to-proposal navigation and keyboard scrolling within the mobile proposal table. Reviewed the seven-page print preview, including the full schedule. Static checks cover both pages and all 32 local links and asset references; the formal proposal was compared against all 107 supplied text blocks. No public deployment has been performed.

## Content and future deliverables

The formal proposal preserves the supplied text, including all eight sections, four Goals and Deliverables subsections, lists, full schedule, and eight reference URLs. The 1.5× target is explicitly tentative. No measured results or completed-report claims are added.

Only the proposal is currently linked in **Project Deliverables**. Add milestone, final report, poster, and source-code links once the actual files or publication destinations exist. Replace each Upcoming label only when its status is supported. Keep the scheduled deadlines visible.

Reference checks reached the six arXiv, NVIDIA, and Faiss destinations. Both supplied USENIX URLs returned HTTP 403 to automated fetching; they are retained exactly as provided and should be checked manually before submission.
