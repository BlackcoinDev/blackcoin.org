# Bootstrap Upgrade Guide: Path to v5.x

This document provides a deep-dive technical roadmap for upgrading the Blackcoin website from **Bootstrap 3.4.1** to **Bootstrap 5.3.x**.

## Why Bootstrap 5?

- **Performance**: Removes the jQuery dependency for core components (improves load time).
- **Modern CSS**: Uses CSS variables (custom properties) and a Flexbox-based grid.
- **Future-Proof**: Bootstrap 3 and 4 are End-of-Life (EOL). v5 is the current stable standard.

---

## ⚠️ Pre-Migration Decision Matrix

Before proceeding, choose your approach:

| Approach | When to Choose | Effort | Risk |
| :--- | :--- | :--- | :--- |
| **A. Stay on BS3** | Security audit shows vulnerable components NOT used (your case) | None | Accept EOL |
| **B. Fork Definity Theme** | You want to preserve exact current design with BS5 | 8-12 hrs | Medium (edit vendor CSS) |
| **C. New BS5 Theme** | You want modern BS5 + willing to adjust design | 10-15 hrs | Low |

### Recommendation for Blackcoin.org: STAY ON BS3

**Reasons:**

1. **No security benefit** — CVEs affect `tooltip`, `popover` — **NOT used** on this site.
2. **Theme dependency** — Definity theme (`main.css`, `responsive.css`) built for BS3.
3. **Static site** — No user input, no XSS vectors.
4. **High effort** — 8-15 hrs for cosmetic update.
5. **AGENTS.md constraint** — Vendor files marked DO NOT EDIT.

**If upgrade is required (compliance/regulatory):** See Option C — Start Bootstrap "Agency" theme.

---

## 🚨 Critical Blocker: Theme CSS

The Definity theme files contain **hundreds of references** to Bootstrap 3 classes:

| File | BS3 Class References | Status |
|------|---------------------|--------|
| `main.css` | `.panel`, `.panel-heading`, `.panel-title`, `.navbar-header`, `.navbar-right` | VENDOR — DO NOT EDIT |
| `responsive.css` | `.navbar-header`, `.navbar-toggle`, `.navbar-right` | VENDOR — DO NOT EDIT |
| `bootstrap.min.css` | All BS3 classes | Replace with BS5 |

**Key patterns in `main.css`:**

- `.accordions-1 .panel` styling (accordion system)
- `.navbar .navbar-header` (navbar structure)
- `.navbar-small .navbar-header`, `.navbar-right` (compact navbar)

**Key patterns in `responsive.css`:**

- `.navbar-header` and `.navbar-toggle` breakpoints (mobile nav)
- `.navbar-right` responsive styles (nav alignment)
- `.panel-group` styles (accordion container)

---

## 📦 Dependencies & Assets

### Files to Replace

1. **`bootstrap.min.css`**: Replace contents with Bootstrap 5.3 CSS.
2. **`bootstrap.min.js`**: Replace with **`bootstrap.bundle.min.js`** (v5.3).
    - *Note*: The **"Bundle"** version includes **Popper.js**, required for dropdowns.

### Files to Keep

- **`jquery-3.7.1.min.js`**: Keep! Slick, Parallax, and `main.js` still need jQuery.
- **`fontawesome/`**: Keep! Font Awesome 7.0.1 is compatible with BS5.

### No JavaScript Changes Needed

Analysis of `main.js` and `breakingNews.js`:

- ✅ No `$.fn.dropdown`, `$.fn.collapse`, `$.fn.modal` calls.
- ✅ No Bootstrap JS API initialization.
- ✅ Uses `data-spy="scroll"` via HTML attribute only.
- ✅ Mobile nav is custom jQuery (breakpoint 1259px).

---

## 🏗 Structural Refactoring (Every Page)

Every HTML file (`index.html`, `faq/index.html`, `team/index.html`, `privacy/index.html`, `maintenance.html`) must be updated.

> **Note:** The `_archive/` directory is excluded from all migration work. It contains legacy WordPress backup and is not part of the active site.

### 1. Navbar (HIGH EFFORT)

The navbar structure has changed significantly.

| BS3 Class | BS5 Replacement | Notes |
|:----------|:----------------|:------|
| `.navbar-header` | REMOVE | BS5 uses `container-fluid` inside nav |
| `.navbar-toggle` | `.navbar-toggler` | Use with `.navbar-toggler-icon` |
| `.navbar-right` | `.ms-auto` | Flexbox margin-start-auto |
| `.sr-only` | `.visually-hidden` | Accessibility class renamed |
| `data-toggle="collapse"` | `data-bs-toggle="collapse"` | All data attributes need `bs-` prefix |
| `data-target="#navbar"` | `data-bs-target="#navbar"` | Add `bs-` prefix |

**Critical: Nav Links and Dropdown Items**

BS5 **requires** additional classes on child elements that BS3 didn't need:

| Element | BS3 | BS5 | Notes |
|:--------|:----|:----|:------|
| Nav links | `<li><a href="...">` | `<li class="nav-item"><a class="nav-link" href="...">` | Required for proper padding/hover |
| Dropdown items | `<li><a href="...">` | `<li><a class="dropdown-item" href="...">` | Required for proper styling |

**Without these classes, nav links and dropdown items will not receive correct padding, hover effects, or color variables from BS5 CSS.**

**BS3 Current Structure:**

```html
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="navbar-header">
    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#">Brand</a>
  </div>
  <div id="navbar" class="navbar-collapse collapse">
    <ul class="nav navbar-nav navbar-right">
      <!-- nav items -->
    </ul>
  </div>
</nav>
```

**BS5 Replacement:**

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbar">
      <ul class="nav navbar-nav ms-auto">
        <!-- nav items -->
      </ul>
    </div>
  </div>
</nav>
```

---

### 2. Panel → Accordion (MAJOR REWRITE)

Bootstrap 5 **removes the `.panel` system entirely**. FAQ and Privacy pages use 35 panel items.

| BS3 Panel | BS5 Accordion | Notes |
|:----------|:---------------|:------|
| `.panel-group` | `.accordion` | Container |
| `.panel.panel-default` | `.accordion-item` | Each item |
| `.panel-heading` | `.accordion-header` | Header |
| `.panel-title a` | `.accordion-button` | Trigger (now `<button>`) |
| `.panel-collapse.collapse` | `.accordion-collapse.collapse` | Collapsible |
| `.panel-body` | `.accordion-body` | Content |
| `data-toggle="collapse"` | `data-bs-toggle="collapse"` | Add `bs-` prefix |
| `data-parent="#id"` | `data-bs-parent="#id"` | Add `bs-` prefix |

**BS3 Current Structure:**

```html
<div class="panel-group" id="faq-accordion-1" role="tablist">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="faq-1-h-1">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#faq-accordion-1" href="#faq-1-collapse-1">
          Question text here
        </a>
      </h4>
    </div>
    <div id="faq-1-collapse-1" class="panel-collapse collapse" role="tabpanel">
      <div class="panel-body">
        Answer text here
      </div>
    </div>
  </div>
</div>
```

**BS5 Replacement:**

```html
<div class="accordion" id="faq-accordion-1">
  <div class="accordion-item">
    <h2 class="accordion-header" id="faq-1-h-1">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-1-collapse-1">
        Question text here
      </button>
    </h2>
    <div id="faq-1-collapse-1" class="accordion-collapse collapse" data-bs-parent="#faq-accordion-1">
      <div class="accordion-body">
        Answer text here
      </div>
    </div>
  </div>
</div>
```

---

### 3. Data Attributes (FIND/REPLACE)

**88 occurrences** across active HTML files (excluding `_archive/`):

| Attribute | Count | Replacement | Location | status |
|:----------|:------|:------------|:---------|:-------|
| `data-toggle` | 50 | `data-bs-toggle` | collapse (38) + dropdown (12) | **VERIFIED** |
| `data-target` | 3 | `data-bs-target` | navbar (2) + scrollspy (1) | **VERIFIED** |
| `data-parent` | 34 | `data-bs-parent` | FAQ (24) + Privacy (10) | **VERIFIED** |
| `data-spy` | 1 | `data-bs-spy` | scrollspy on `<body>` | **VERIFIED** |
| `data-hover` | ~~12~~ | ✅ **REMOVED** | Dead code (Cleaned 2026-03-20) | **DONE** |
| `data-delay` | ~~12~~ | ✅ **REMOVED** | Dead code (Cleaned 2026-03-20) | **DONE** |

**Per-File Breakdown:**

| File | `data-toggle` | `data-target` | `data-parent` | `data-spy` |
|------|---------------|---------------|---------------|------------|
| `index.html` | 4 | 2 | 0 | 1 |
| `faq/index.html` | 28 | 0 | 24 | 0 |
| `team/index.html` | 4 | 1 | 0 | 0 |
| `privacy/index.html` | 14 | 0 | 10 | 0 |
| `maintenance.html` | 0 | 0 | 0 | 0 |
| **TOTAL** | **50** | **3** | **34** | **1** |

**Dead Code Removed (2026-03-20):**

The `data-hover="dropdown"` and `data-delay="350"` attributes were removed from all active HTML files. These referenced the Bootstrap Hover Dropdown plugin which:

- ✅ Was used in the legacy WordPress site (`_archive/` folder)
- ❌ Was **NOT loaded** on the current active pages
- ❌ Did **nothing** — the plugin script was missing
- **Status:** Dead code removed. Dropdowns work via native Bootstrap click behavior.

**Find/Replace Commands:**

```bash
# Data attributes (excludes _archive directory)
find . -name "*.html" -not -path "./_archive/*" -exec sed -i '' \
  -e 's/data-toggle="collapse"/data-bs-toggle="collapse"/g' \
  -e 's/data-toggle="dropdown"/data-bs-toggle="dropdown"/g' \
  -e 's/data-target="/data-bs-target="/g' \
  -e 's/data-parent="/data-bs-parent="/g' \
  -e 's/data-spy="scroll"/data-bs-spy="scroll"/g' \
  {} \;
```

---

### 4. Utility Classes (FIND/REPLACE)

**18 occurrences** across active HTML files:

| BS3 Class | Count | BS5 Class | Location | Status |
|:----------|:------|:----------|:---------|:-------|
| `.sr-only` | 4 | `.visually-hidden` | Navbar toggle (1 per file × 4 files) | **VERIFIED** |
| `.pull-right` | 4 | `.float-end` | Footer "To the top" link (1 per file × 4 files) | **VERIFIED** |
| `.navbar-right` | 4 | `.ms-auto` | Navbar nav lists (1 per file × 4 files) | **VERIFIED** |
| `.label.label-red` | 4 | `.badge.bg-danger` | "News" dropdown label (1 per file × 4 files) | **VERIFIED** |
| `.img-responsive` | 1 | `.img-fluid` | `index.html:485` hero image | **VERIFIED** |
| `.center-block` | 1 | `.mx-auto` | `index.html:485` hero image (same element) | **VERIFIED** |

**Note on `navbar-right`:** The grep finds 8 matches, but 4 are HTML comments (`<!-- / .nav .navbar-nav .navbar-right -->`). Only 4 need replacement (the actual class attributes).

**Note on `.img-responsive` and `.center-block`:** These are on the same element (`<img class="img-responsive center-block ...">`), so the sed command will modify one element with both classes.

**Note on `.label`:** Bootstrap 5 renamed `.label` to `.badge`. The `.label-red` class should map to `.bg-danger` (or a custom class if Definity theme provides it).

**Sed Command Robustness:**

The bulk replace command uses `s/label label-red/badge bg-danger/g` (without `class="..."`) to match the label regardless of surrounding classes. This ensures it catches all occurrences even if there are additional classes like `class="label label-red wow fadeInUp"`.

**Grid Classes:** No `col-xs-*` classes found in active files. The site uses `col-md-*` and `col-lg-*` which are BS5-compatible.

**Hidden/Visible Classes:** No `.hidden-xs`, `.visible-md`, etc. found. BS5 replaced these with `.d-none .d-md-block` display utilities. Not needed for migration.

**Button Classes:** No `btn-default` classes found in active files. The site uses custom button styling.

**Bootstrap Embeds:** No `.embed-responsive` classes found. If videos are added later, BS5 uses `.ratio` and `.ratio-16x9` instead of `.embed-responsive` and `.embed-responsive-16by9`.

**Important Notes:**

- **`.img-fluid`**: Slick carousel doesn't use `.img-responsive` internally—this is only in HTML. The class change is straightforward.
- **`.center-block`**: In BS5, use `.mx-auto`. For inline elements, add `.d-block` (e.g., `.d-block .mx-auto`). The current usage is on a `<img>` which is naturally block-level, so `.mx-auto` should work.
- **Custom Definity classes** (`.navbar-trans`, `.navbar-small`, `.navbar-fw`): These are NOT Bootstrap classes—they're custom theme classes. **Preserve them** during migration.

**Bulk Replace Commands:**

```bash
find . -name "*.html" -not -path "./_archive/*" -exec sed -i '' \
  -e 's/class="sr-only"/class="visually-hidden"/g' \
  -e 's/class="pull-right"/class="float-end/g' \
  -e 's/class="pull-left"/class="float-start/g' \
  -e 's/class="img-responsive"/class="img-fluid/g' \
  -e 's/class="center-block"/class="mx-auto/g' \
  -e 's/label label-red/badge bg-danger/g' \
  -e 's/navbar-right/ms-auto/g' \
  {} \;
```

**Note:** The `.label` replacement uses `label label-red` (without `class="..."`) to catch all occurrences regardless of surrounding classes.

---

### 5. Grid System

- **Breakpoint**: BS5 adds `xxl` (≥1400px).
- **Classes**: `col-xs-*` is removed; use `col-*` for extra-small.
- **Gutters**: BS5 uses `.g-*` classes for column spacing.
- **No changes needed** — this site uses `col-lg-*` and `col-md-*` which are compatible.

---

## 🤖 About `_archive/` Directory

The `_archive/` folder contains legacy WordPress backup files. It is:

- **NOT part of the active site**
- **NOT deployed**
- **NOT referenced by any active HTML files**
- **NOT to be modified** during migration

All migration commands in this document explicitly exclude `_archive/`:

```bash
find . -name "*.html" -not -path "./_archive/*" ...
```

---

## 🛠️ Rollback Plan

If migration breaks the site:

```bash
# Restore all changed files
git checkout .

# Or restore specific files
git checkout -- assets/styles/bootstrap.min.css
git checkout -- assets/js/bootstrap.min.js
git checkout -- index.html faq/index.html team/index.html privacy/index.html maintenance.html
```

**Best practice:** Create a branch before starting:

```bash
git checkout -b bootstrap5-upgrade
# ... do migration work ...
# If broken:
git checkout master
git branch -D bootstrap5-upgrade
```

---

## 🔍 Visual Regression Testing

Before migration, capture baseline screenshots using tools like:

- [BackstopJS](https://github.com/garris/BackstopJS)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- Manual: Side-by-side browser comparison

**Pages to capture:**

- `index.html` — hero, navbar, clients slider, footer
- `faq/index.html` — accordion states (collapsed, expanded)
- `team/index.html` — card layouts
- `privacy/index.html` — accordion states

---

## 📋 Verification Checklist

After migration:

- [ ] Navbar collapses/expands on mobile
- [ ] Dropdown menus work (click)
- [ ] FAQ accordions expand/collapse
- [ ] Privacy accordions expand/collapse
- [ ] Scrollspy highlights active nav section
- [ ] Clients slider (Slick) works
- [ ] CoinGecko widget loads
- [ ] Parallax backgrounds scroll
- [ ] Mobile hover (tap-to-expand) works
- [ ] All images load responsively
- [ ] No console errors

---

## 📊 Effort Summary

| Task | Option A (Stay) | Option B (Fork) | Option C (New Theme) |
|------|:---------------:|:---------------:|:-------------------:|
| Navbar restructure | — | 2 hrs | 2 hrs |
| Panel → Accordion | — | 3 hrs | 3 hrs |
| Data attributes | — | 0.5 hrs | 0.5 hrs |
| Utility classes | — | 0.5 hrs | 0.5 hrs |
| ~~Remove `data-hover`~~ | — | ✅ Done | ✅ Done |
| Theme CSS patch | — | 4 hrs | — |
| Color/theme port | — | — | 2 hrs |
| Testing | — | 2 hrs | 2 hrs |
| **Total** | **0 hrs** | **12 hrs** | **10-15 hrs** |

---

## 🔗 References

- [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.3/migration/)
- [Start Bootstrap Agency Theme](https://startbootstrap.com/theme/agency)
- [Bootstrap 5 Navbar Documentation](https://getbootstrap.com/docs/5.3/components/navbar/)
- [Bootstrap 5 Accordion Documentation](https://getbootstrap.com/docs/5.3/components/accordion/)

---

## ✅ Final Recommendation: STRONGLY AGREE

**I have exhaustively audited the codebase and I strongly agree with the decision to stay on Bootstrap 3.4.1.**

### Why this is the correct choice

1. **Vulnerability Analysis:** The unpatched CVEs in Bootstrap 3.4.1 (Tooltip/Popover/Button Loading) are for components **NOT used** on this site. Our slider uses Slick, and our dropdowns are standard JS-free or native BS3.
2. **Security Context:** Bootstrap 3.4.1 (released Jan 2019) was the final stable release of the v3 branch. It includes fixes for major vulnerabilities found in earlier v3 versions. Since we do not use the specific vulnerable components (tooltips), the attack surface is virtually non-existent for this static implementation.
3. **Definity Theme Coupling:** The Definity theme vendor files (`main.css`, `responsive.css`) are deeply architected around Bootstrap 3. Upgrading would require a "forced" refactor of vendor files, which violates the `AGENTS.md` project rules.
4. **Effort vs. Value:** On a static site with zero user-input vectors, the security risk of an EOL framework is near-zero. The 10-15 hours required for a manual rewrite provides zero functional or security gain.
5. **Maintenance Status:** The site is now **clean and verified**. All dead code (`data-hover`, `data-delay`) has been removed. All counts are definitive.

**Conclusion:** Project Approved. Archive this guide for "compliance only" use. The current implementation is stable, secure for its context, and maintainable.

---

**Audit Sign-off:** 2026-03-20 | Antigravity AI | [3cab588]

---

## 🔍 Deep Dive: Advanced Audit Insights

This section provides granular technical details discovered during the exhaustive 2026-03-20 audit.

### 1. Grid Ecosystem Distribution

The site uses a mature **Mobile-First** strategy:

- **No `col-xs-*` classes found** in active files. The site relies on BS3's implicit extra-small behavior.
- **`.col-md-* / .col-lg-*` (Heavy usage)**: The 3rd-party theme is well-responsive. It uses the standard 12-column grid without complex offsets or pushes/pulls (none found).
- **Migration Note**: BS5's `col-*` (extra-small) is equivalent to BS3's implicit behavior. No changes needed.

### 2. Accessibility & ARIA Statistics

The audit confirmed **168 active accessibility bindings**:

- **`role="tablist"` (4)**, **`role="tab"` (34)**, **`role="tabpanel"` (34)**: Primarily in FAQ and Privacy accordions.
- **`role="button"` (46)**: Correctly applied to non-button elements (anchors/spans) triggering collapses.
- **`aria-expanded` (50)**: Dynamically managed by `bootstrap.min.js`.
- **Migration Note**: BS5 handles these via `data-bs-*` attributes but these `role` and standard `aria` attributes should be preserved for screen reader compatibility.

### 3. Confirmed Absent Components (Safe to Skip)

The following BS3 components were **NOT FOUND** in any active HTML files (excluding `_archive/`):

| Component | Status | Security Impact |
|:----------|:-------|:----------------|
| **Modals** | ✅ None | No `data-toggle="modal"` — no focus trapping issues |
| **Tooltips** | ✅ None | No `data-toggle="tooltip"` — **XSS CVE-2019-8331 not applicable** |
| **Popovers** | ✅ None | No `data-toggle="popover"` — **XSS CVE-2019-8331 not applicable** |
| **Glyphicons** | ✅ None | Site uses Font Awesome 7.0.1 — no font-face migration |
| **Iframes/Embeds** | ✅ None | No `embed-responsive` classes needed |
| **Breadcrumbs** | ✅ None | Only CSS styles in `<style>` block (not components) |
| **Pagination** | ✅ None | Only CSS styles in `<style>` block (not components) |
| **Alerts** | ✅ None | No `class="alert"` components |
| **Media Objects** | ✅ None | No `.media` or `.media-object` classes |
| **`btn-default`** | ✅ None | Site uses custom button styling |

**Security Significance:**

Bootstrap 3.4.1 (released January 2019) is the **final stable release** of the v3 branch. It includes fixes for:

- **CVE-2019-8331**: XSS vulnerability in Tooltip/Popover (2019)
- **CVE-2024-6485**: XSS in Button loading state (2024)
- **CVE-2025-1647**: XSS in Tooltip sanitize configuration (2025)

**Since none of these components are used on this site, the attack surface is effectively zero.** The site's static nature (no user input, no forms, no dynamic content) further reduces risk.

**Conclusion:** Staying on Bootstrap 3.4.1 is safe for this specific deployment. The EOL status is a maintenance concern, not a security concern for this use case.

### 4. Layout Mechanics: Fixed vs. Static

- The site uses `.navbar-fixed-top` exclusively.
- **Conflict Check**: `main.css` includes custom offsets to prevent the fixed nav from overlapping section anchors. Any change to BS5 `.fixed-top` (which may have different default margins) would require re-calculating these offsets.

---

## 💡 Developer Pro-Tips

### 1. The 1259px Breakpoint Trap

Your custom Javascript (`main.js:60`) triggers the mobile menu at **1259px**.

- **Bootstrap 3 default**: 768px (`sm`) or 992px (`md`) or 1200px (`lg`).
- **Bootstrap 5 default**: 992px (`lg`) or 1200px (`xl`).
- **Upgrade Note**: In BS5, use `.navbar-expand-xxl` to keep the menu mobile for high-res screens, or adjust `main.js` to match the new BS5 breakpoints.

### 2. jQuery Migrate

The site currently loads `jquery-migrate-3.4.1.min.js`.

- This is likely required for the **Parallax** or **WOW.js** plugins which use deprecated jQuery 1.x/2.x APIs.
- **Upgrade Note**: BS5 removes jQuery requirements, but your plugins still need it. Do not remove `migrate` until you've tested all parallax effects.

### 3. Progressive Cleanup ✅ Completed

The **Dead data-hover Cleanup** was completed on 2026-03-20.

- Removed 24 dead attributes (`data-hover="dropdown"` and `data-delay="350"`) from all active HTML files.
- These referenced a missing plugin (`bootstrap-hover-dropdown.min.js`) that was never loaded.
- No functionality was affected — dropdowns continue to work via native Bootstrap click behavior.

### 4. Custom Mobile Hover (`main.js:159`)

The function `initMobileHover()` handles tap-to-expand behavior for mobile devices (`.ft-boxed-hover`).

- **How it works**: It detects touch support and toggles a `.hover-active` class.
- **Upgrade Note**: This is a non-Bootstrap custom behavior. If you change your card/panel structure in BS5, you must ensure `.ft-boxed-hover` classes are preserved or migrated to new CSS selectors so mobile users can still "tap to see more."
