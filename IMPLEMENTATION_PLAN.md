# Bootstrap 5 Implementation Plan

**Status:** Ready for Execution  
**Estimated Effort:** 10-15 hours  
**Approach:** Fork Definity Theme (Option B)

**Reference Document:** `BOOTSTRAP_UPGRADE.md` — Contains detailed analysis of all changes, per-file breakdowns, and verified counts.

**Note:** Git operations (branching, committing) are **not** part of this implementation plan. Version control is handled separately.

---

## ⚠️ Before You Begin

This plan **violates** the AGENTS.md constraint "DO NOT EDIT vendor files (`main.css`, `responsive.css`)".

To proceed, you must accept that you will be forking the Definity theme.

---

## 📋 Phase 1: Preparation (15 min)

### Step 1.1: Fork Vendor CSS Files

```bash
# Create editable copies of vendor CSS
cp assets/styles/main.css assets/styles/main.bs5.css
cp assets/styles/responsive.css assets/styles/responsive.bs5.css
```

### Step 1.2: Download Bootstrap 5.3

```bash
# Download Bootstrap 5.3 (use curl or manual download)
# Current stable: Bootstrap 5.3.3

# Option A: Download from CDN and save locally
curl -o assets/styles/bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
curl -o assets/js/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js

# Note: You'll need to update the CSS cascade order in HTML files
```

### Step 1.3: Capture Baseline Screenshots

Before making changes, capture screenshots of key pages for comparison:

- `index.html` (hero, navbar, clients slider, footer)
- `faq/index.html` (accordion states: collapsed, expanded)
- `team/index.html` (card layouts)
- `privacy/index.html` (accordion states)

---

## 📋 Phase 2: CSS Theme Migration (4-5 hrs)

### Step 2.1: Update HTML CSS Links

Edit all 5 HTML files to use the new CSS files:

```html
<!-- OLD (in all HTML files) -->
<link rel="stylesheet" href="assets/styles/bootstrap.min.css">
<link rel="stylesheet" href="assets/styles/main.css">
<link rel="stylesheet" href="assets/styles/responsive.css">

<!-- NEW -->
<link rel="stylesheet" href="assets/styles/bootstrap.min.css">
<link rel="stylesheet" href="assets/styles/main.bs5.css">
<link rel="stylesheet" href="assets/styles/responsive.bs5.css">
```

**Files to edit:**

- `index.html`
- `faq/index.html`
- `team/index.html`
- `privacy/index.html`
- `maintenance.html`

### Step 2.2: Patch main.bs5.css

**Critical panel replacements:**

```bash
# Panel → Accordion classes
sed -i '' \
  -e 's/\.panel-group/.accordion/g' \
  -e 's/\.panel\.panel-default/.accordion-item/g' \
  -e 's/\.panel-heading/.accordion-header/g' \
  -e 's/\.panel-title/.accordion-button/g' \
  -e 's/\.panel-collapse/.accordion-collapse/g' \
  -e 's/\.panel-body/.accordion-body/g' \
  assets/styles/main.bs5.css
```

**Navbar replacements:**

```bash
# Navbar class changes
sed -i '' \
  -e 's/\.navbar-header/.navbar-container/g' \
  -e 's/\.navbar-right/.ms-auto/g' \
  -e 's/\.navbar-toggle/.navbar-toggler/g' \
  assets/styles/main.bs5.css
```

**NOTE:** These sed commands are a starting point. The Definity theme has complex selectors like `.accordions-1 .panel` that will need manual CSS review. Expect to manually edit `main.bs5.css` after running sed.

### Step 2.3: Patch responsive.bs5.css

```bash
# Responsive navbar fixes
sed -i '' \
  -e 's/\.navbar-header/.navbar-container/g' \
  -e 's/\.navbar-toggle/.navbar-toggler/g' \
  -e 's/\.navbar-right/.ms-auto/g' \
  assets/styles/responsive.bs5.css
```

### Step 2.4: Manual CSS Review

After sed commands, manually review and fix:

1. **Accordion styles** — Check `.accordions-1` section in `main.bs5.css`
2. **Navbar breakpoints** — Check `@media` queries in `responsive.bs5.css`
3. **Visibility classes** — BS3 `.hidden-xs` → BS5 `.d-none .d-sm-block`

**This step requires visual testing.** Open `index.html` in a browser and check:

- Navbar appearance (desktop and mobile)
- Accordion appearance (FAQ page)
- Responsive breakpoints

### Step 2.5: Z-Index Conflict Check (CRITICAL)

Bootstrap 5 sets `.fixed-top { z-index: 1030 }`. The Definity theme may have custom stacking contexts that conflict.

**Check these elements:**

| Element | Potential Issue |
|---------|-----------------|
| Slick Carousel arrows | May appear behind navbar |
| News Ticker (`.breaking-news`) | May be clipped by fixed navbar |
| Dropdown submenus | May appear behind hero section |
| Parallax layers | May overlap navbar incorrectly |

**Add to `blackcoin.css` if needed:**

```css
/* Navbar z-index override */
.navbar-fixed-top {
  z-index: 1030;
}

/* Slick carousel z-index override */
.slick-prev, .slick-next {
  z-index: 1000;
}

/* Breaking news ticker z-index */
.breaking-news {
  z-index: 1020;
}
```

**Test:** Scroll each page and verify no elements clip behind or over the navbar unexpectedly.

---

## 📋 Phase 3: HTML Structure Migration (3-4 hrs)

### Step 3.1: Data Attributes

**Reference:** See `BOOTSTRAP_UPGRADE.md` section "3. Data Attributes" for detailed per-file breakdown.

**Total: 88 occurrences** (excluding `data-hover`/`data-delay` which were already removed):

| Attribute | Count | Replacement |
|:----------|:------|:------------|
| `data-toggle` | 50 | `data-bs-toggle` |
| `data-target` | 3 | `data-bs-target` |
| `data-parent` | 34 | `data-bs-parent` |
| `data-spy` | 1 | `data-bs-spy` |

```bash
# Run from project root
find . -name "*.html" -not -path "./_archive/*" -exec sed -i '' \
  -e 's/data-toggle="collapse"/data-bs-toggle="collapse"/g' \
  -e 's/data-toggle="dropdown"/data-bs-toggle="dropdown"/g' \
  -e 's/data-target="/data-bs-target="/g' \
  -e 's/data-parent="/data-bs-parent="/g' \
  -e 's/data-spy="scroll"/data-bs-spy="scroll"/g' \
  {} \;
```

### Step 3.2: Utility Classes

**Reference:** See `BOOTSTRAP_UPGRADE.md` section "4. Utility Classes" for detailed per-file breakdown.

**Total: 18 occurrences** across active HTML files:

| BS3 Class | Count | BS5 Class |
|:----------|:------|:----------|
| `.sr-only` | 4 | `.visually-hidden` |
| `.pull-right` | 4 | `.float-end` |
| `.navbar-right` | 4 | `.ms-auto` |
| `.label.label-red` | 4 | `.badge.bg-danger` |
| `.img-responsive` | 1 | `.img-fluid` |
| `.center-block` | 1 | `.mx-auto` |

**⚠️ Important: Word-Boundary Pattern**

Some classes appear on the same element (e.g., `class="img-responsive center-block wow"`). Using `class="..."` patterns will miss these. Use word-boundary patterns instead:

```bash
# Run from project root
# Note: Using word boundaries (\b) to match class names regardless of surrounding classes
find . -name "*.html" -not -path "./_archive/*" -exec sed -i '' \
  -e 's/\bsr-only\b/visually-hidden/g' \
  -e 's/\bpull-right\b/float-end/g' \
  -e 's/\bpull-left\b/float-start/g' \
  -e 's/\bimg-responsive\b/img-fluid/g' \
  -e 's/\bcenter-block\b/mx-auto/g' \
  -e 's/label label-red/badge bg-danger/g' \
  -e 's/\bnavbar-right\b/ms-auto/g' \
  {} \;
```

**Why word boundaries work better:**
- `class="img-responsive center-block wow"` → `class="img-fluid mx-auto wow"` ✅
- The old pattern `class="center-block"` would fail because after the first replacement, the string is `class="img-fluid center-block"`

### Step 3.3: Navbar Restructure (MANUAL)

**This cannot be automated — must edit each file manually.**

Open each HTML file and restructure the navbar:

**BS3 Current Structure (search for this pattern):**

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
      ...
    </ul>
  </div>
</nav>
```

**BS5 Replacement Structure:**

```html
<nav class="navbar navbar-dark bg-dark fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav ms-auto">
        ...
      </ul>
    </div>
  </div>
</nav>
```

**⚠️ Important Navbar Class Changes:**

| BS3 Class | BS5 Class | Why |
|:----------|:----------|:----|
| `navbar-default` | `navbar-dark` + `bg-dark` | BS5 removed `navbar-default`/`navbar-inverse` |
| `navbar-fixed-top` | `fixed-top` | Same effect, but class name unchanged |
| `navbar-header` | **REMOVE** | BS5 uses `container-fluid` inside nav |

**Changes required:**

1. Wrap content in `<div class="container-fluid">`
2. Remove `.navbar-header` wrapper
3. Move brand link outside the header
4. Change button to `.navbar-toggler` with `.navbar-toggler-icon`
5. Add `.nav-item` and `.nav-link` to nav links
6. Add `.dropdown-item` to dropdown links

**Files to edit:**

- `index.html` (lines ~207-340)
- `faq/index.html` (lines ~63-180)
- `team/index.html` (lines ~66-185)
- `privacy/index.html` (lines ~63-185)
- `maintenance.html` (entire navbar section)

### Step 3.4: Panel → Accordion (MANUAL)

**This cannot be automated — must edit each file manually.**

Open `faq/index.html` and `privacy/index.html` and convert each panel:

**BS3 Current Structure:**

```html
<div class="panel-group" id="faq-accordion-1" role="tablist">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="faq-1-h-1">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#faq-accordion-1" href="#faq-1-collapse-1">
          Question text
        </a>
      </h4>
    </div>
    <div id="faq-1-collapse-1" class="panel-collapse collapse" role="tabpanel">
      <div class="panel-body">
        Answer text
      </div>
    </div>
  </div>
</div>
```

**BS5 Replacement Structure:**

```html
<div class="accordion" id="faq-accordion-1">
  <div class="accordion-item">
    <h2 class="accordion-header" id="faq-1-h-1">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-1-collapse-1">
        Question text
      </button>
    </h2>
    <div id="faq-1-collapse-1" class="accordion-collapse collapse" data-bs-parent="#faq-accordion-1">
      <div class="accordion-body">
        Answer text
      </div>
    </div>
  </div>
</div>
```

**Files to edit:**
- `faq/index.html` — 24 accordion items in 2 accordion groups (lines ~210-850)
- `privacy/index.html` — 10 accordion items in 2 accordion groups (lines ~209-500)
- **Total: 34 accordion items across 4 accordion groups**

**⚠️ Important: Accordion Containers**

Each `.panel-group` container must change to `.accordion`:

| BS3 | BS5 | Count |
|:----|:----|:------|
| `<div class="panel-group" id="...">` | `<div class="accordion" id="...">` | 4 total (2 per file) |

**Don't forget:** You need to update both the accordion items (`.panel` → `.accordion-item`) AND the accordion containers (`.panel-group` → `.accordion`).

### Step 3.5: Nav Links and Dropdown Items (MANUAL)

**Add required classes to navigation elements:**

```html
<!-- BS3 -->
<li><a href="...">Home</a></li>

<!-- BS5 -->
<li class="nav-item"><a class="nav-link" href="...">Home</a></li>

<!-- BS3 Dropdown -->
<li><a href="...">Link</a></li>

<!-- BS5 Dropdown -->
<li><a class="dropdown-item" href="...">Link</a></li>
```

**Files to edit:** All 5 HTML files, navigation sections.

---

## 📋 Phase 4: JavaScript Updates (30 min)

### Step 4.1: Replace Bootstrap JS

Update all 5 HTML files:

```html
<!-- OLD -->
<script src="assets/js/bootstrap.min.js"></script>

<!-- NEW -->
<script src="assets/js/bootstrap.bundle.min.js"></script>
```

### Step 4.2: Verify No Changes Needed

The following were verified to NOT need changes:

- `main.js` — No Bootstrap JS API calls
- `breakingNews.js` — No Bootstrap JS API calls
- `data-spy="scroll"` — Works with HTML attribute only

### Step 4.3: Scrollspy Root Margin (MAYBE NEEDED)

Bootstrap 5's scrollspy is more sensitive to root margins. Since the navbar height changes between desktop (60px) and mobile (variable with custom 1259px breakpoint), you may need to add a root margin.

**Current HTML:**

```html
<body id="page-top" data-spy="scroll" data-target=".navbar">
```

**If scrollspy highlights wrong sections, add root margin:**

```html
<body id="page-top" data-bs-spy="scroll" data-bs-target=".navbar" data-bs-root-margin="0px 0px -25%">
```

**Why -25%?** This accounts for the navbar height and ensures the correct section highlights when scrolling. Adjust as needed during testing.

---

## 📋 Phase 5: Testing (2-3 hrs)

### Step 5.1: Visual Comparison

Compare each page against the baseline screenshots:

**index.html:**

- [ ] Navbar appears correctly (desktop)
- [ ] Navbar collapses on mobile
- [ ] Hero section displays
- [ ] Clients slider works
- [ ] Footer displays
- [ ] Scrollspy highlights active nav

**faq/index.html:**

- [ ] Accordion items expand/collapse
- [ ] All 24 accordion items work
- [ ] Accordion containers (.accordion class) styled correctly
- [ ] Smooth animation

**team/index.html:**

- [ ] Card layouts display
- [ ] Images responsive

**privacy/index.html:**

- [ ] Accordion items expand/collapse
- [ ] All 10 accordion items work
- [ ] Accordion containers (.accordion class) styled correctly

**All pages:**

- [ ] Dropdown menus work (click)
- [ ] No console errors
- [ ] Mobile menu works (tap)

### Step 5.2: Browser Testing

Test in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

### Step 5.3: Breakpoint Testing

Test at widths:

- [ ] 320px (mobile)
- [ ] 768px (tablet)
- [ ] 992px (desktop)
- [ ] 1200px (large)
- [ ] 1400px (xl)

---

## 📋 Phase 6: Cleanup

### Step 6.1: Remove Old Files

After testing passes:

```bash
# Delete old Bootstrap 3 files
rm assets/styles/bootstrap.min.css  # Will be replaced with BS5
rm assets/js/bootstrap.min.js        # Will be replaced with BS5 bundle
```

### Step 6.2: Update CSS Links

Update HTML files to use `bootstrap.min.css` (BS5) instead of the old one.

---

## 📊 Effort Breakdown

| Phase | Estimated Time | Risk Level |
|-------|---------------|------------|
| 1. Preparation | 15 min | Low |
| 2. CSS Migration | 4-5 hrs | **High** (theme dependency) |
| 3. HTML Structure | 3-4 hrs | Medium |
| 4. JavaScript | 30 min | Low |
| 5. Testing | 2-3 hrs | Medium |
| 6. Cleanup | 15 min | Low |
| **Total** | **10-15 hrs** | **Medium-High** |

---

## ⚠️ Known Issues & Risks

### High Risk: Theme CSS

The Definity theme (`main.css`, `responsive.css`) uses Bootstrap 3 class names extensively. After running sed commands, you will likely see:

- **Broken accordion styling** — Accordion items may not display correctly
- **Navbar misalignment** — Mobile menu may not expand correctly
- **Spacing issues** — Margins/padding may be inconsistent

**Mitigation:** Test early and often. Keep BS3 CSS files as backup.

### Medium Risk: Accordion Animation

Bootstrap 5 accordions use different CSS transitions than Bootstrap 3 panels. You may need to add custom CSS:

```css
/* Add to blackcoin.css if accordions don't animate smoothly */
.accordion-button:not(.collapsed) {
  background-color: transparent;
}

.accordion-collapse {
  transition: height 0.35s ease;
}
```

### Low Risk: JavaScript

No Bootstrap JavaScript API calls were found in `main.js` or `breakingNews.js`. jQuery Migrate is still required for Parallax and WOW.js plugins.

---

## 📚 Reference Links

- [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.3/migration/)
- [Bootstrap 5 Navbar Documentation](https://getbootstrap.com/docs/5.3/components/navbar/)
- [Bootstrap 5 Accordion Documentation](https://getbootstrap.com/docs/5.3/components/accordion/)
- [Bootstrap 5 Utilities](https://getbootstrap.com/docs/5.3/utilities/)

---

## ✅ Success Criteria

The migration is complete when:

1. All 5 HTML pages render correctly in Chrome, Firefox, Safari, Edge
2. Mobile navigation expands/collapses
3. All accordions (FAQ: 24, Privacy: 10) expand/collapse
4. No console errors
5. Scrollspy highlights active navigation section
6. Clients slider (Slick) still works
7. Parallax backgrounds still animate
8. CoinGecko widget still loads
9. Images are responsive
10. Visual comparison matches baseline within acceptable tolerance

---

## 📖 Cross-Reference

This plan should be used alongside `BOOTSTRAP_UPGRADE.md`, which contains:

- Detailed per-file breakdowns (lines 228-235 for data attributes, 267-272 for utility classes)
- Security significance analysis (Bootstrap 3.4.1 CVE context)
- Confirmed absent components (Modals, Tooltips, Popovers, etc.)
- Developer pro-tips (1259px breakpoint, jQuery Migrate, custom mobile hover)

**When in doubt, consult `BOOTSTRAP_UPGRADE.md` for the authoritative analysis.**

---

**Good luck!** This is a significant migration. Test frequently and don't hesitate to rollback if issues arise.
