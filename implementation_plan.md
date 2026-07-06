# ECU University GPA Calculator — Implementation Plan (v3)

A bilingual (English/Arabic) single-page web application for **Egyptian Chinese University (ECU)** — Faculty of Computers and Information Systems — that helps students calculate, track, and **plan** their GPA with an interactive Target GPA Planner.

Built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools.

---

## Background & Domain Rules

### University Info
- **Full name**: Egyptian Chinese University (ECU) — الجامعة المصرية الصينية
- **Faculty**: Faculty of Computers and Information Systems — كلية الحاسبات ونظم المعلومات
- **Motto**: "Education New Era"
- Logo will be provided later; use placeholder for now

### Credit Hour System
- **Total required**: 138 credit hours to graduate
- **Academic Levels** (based on completed credit hours):
  - 1st Level: 0–27 hours
  - 2nd Level: 28–61 hours
  - 3rd Level: 62–95 hours
  - 4th Level: 96–138 hours
- **Track Selection**: Students need to complete **75 hours** to be eligible to choose a specialization track. This must be displayed prominently.
- Some courses don't count toward CGPA (e.g., Chinese Language). Student enters a single number for non-GPA hours.

### Semester Subject Limits (based on CGPA)

| CGPA Range | Max Subjects Allowed |
|------------|---------------------|
| Less than 1.0 | 4 subjects |
| 1.0 – less than 1.8 | 5 subjects |
| 1.8 and above | 6 subjects (normal) |

- Students **can request** to take more subjects than their limit (special request to administration) — this is informational only
- The website should **enforce** the limit in the semester calculator (warn if exceeded) and **explain** the rule

### Academic Warning System

> [!CAUTION]
> If a student fails to achieve **2.0 in their semester GPA (TGPA)**, they receive an **academic warning**.
> ECU allows a maximum of **4 warnings**. After the 4th warning, the student is **dismissed** from the university.

- The website should track warnings and display them on the dashboard
- When the student saves a semester with GPA < 2.0, show a prominent warning banner
- Display warning count: "⚠️ Warning X of 4"

### Credit Hours Per Course
- Default: **3 credit hours**
- Can be changed to: **2** or **0** credit hours
- 0-hour courses exist (e.g., orientation, training) — they don't affect GPA calculation hours

### Course Name
- **Optional** — student can leave it blank

### Grading Scale

| Points | Grade | Percentage Range |
|--------|-------|------------------|
| 4.0 | A+ | 96% and above |
| 3.7 | A | 92% – less than 96% |
| 3.4 | A- | 88% – less than 92% |
| 3.2 | B+ | 84% – less than 88% |
| 3.0 | B | 80% – less than 84% |
| 2.8 | B- | 76% – less than 80% |
| 2.6 | C+ | 72% – less than 76% |
| 2.4 | C | 68% – less than 72% |
| 2.2 | C- | 64% – less than 68% |
| 2.0 | D+ | 60% – less than 64% |
| 1.5 | D | 55% – less than 60% |
| 1.0 | D- | 50% – less than 55% |
| 0.0 | F | Total less than 50% |
| 0.0 | FL | Total ≥ 50% but final exam < 12/40 |
| 0.0 | ABS | Absent from final exam without accepted excuse |

**Special non-point grades** (excluded from GPA):

| Code | Meaning |
|------|---------|
| CON | Course continued next semester |
| I | Incomplete |
| W | Withdrawal |

### F vs FL — Detailed Explanation (from ECU official document)

The final grade in a course is out of **100 points** (Coursework + Final Exam out of 40). To **pass**, the student must meet **BOTH** conditions:
1. Score at least **50 points total** (coursework + final exam)
2. Score at least **12 points out of 40** on the final exam paper

**Quick Rule**:
```
Total < 50                          → F   (Failed)
Total ≥ 50, but Final Exam < 12/40 → FL  (Failed — didn't meet exam minimum)
Total ≥ 50, and Final Exam ≥ 12/40 → Pass (grade based on total percentage)
```

**F Examples**:
| Coursework | Final Exam (out of 40) | Total | Grade |
|------------|----------------------|-------|-------|
| 25 | 20 | 45 | F |
| 35 | 10 | 45 | F |
| 15 | 30 | 45 | F |

**FL Examples**:
| Coursework | Final Exam (out of 40) | Total | Grade |
|------------|----------------------|-------|-------|
| 42 | 10 | 52 | FL |
| 45 | 8 | 53 | FL |
| 40 | 11 | 51 | FL |

**Pass Examples**:
| Coursework | Final Exam (out of 40) | Total | Grade |
|------------|----------------------|-------|-------|
| 38 | 12 | 50 | Pass |
| 30 | 20 | 50 | Pass |
| 45 | 25 | 70 | Pass |

> Both F and FL carry **0 points** and both trigger the **retake cap rule** (max B+ on retake).

### Retake Rule

> [!IMPORTANT]
> If a student previously received **F** or **FL** in a course and is retaking it, the **maximum grade they can achieve is B+ (3.2)**. Enforced in both the calculator and the planner.

### GPA Formulas
```
Semester GPA = Σ (grade_points × credit_hours) / Σ (credit_hours)
CGPA = Σ (all_grade_points × credit_hours) / Σ (all_counted_credit_hours)
```
- Only courses with numeric point grades are included
- CON, I, W are completely excluded
- 0-credit-hour courses don't affect the calculation (0 × anything = 0 in both numerator and denominator)
- Non-GPA hours are excluded

---

## Bilingual Support (English / Arabic)

> [!IMPORTANT]
> The entire website must support **both English and Arabic** with a language toggle.

### Implementation Approach
- **Language toggle button** in the navigation bar (🌐 EN / AR)
- When Arabic is selected:
  - Page direction switches to **RTL** (`dir="rtl"` on `<html>`)
  - All text content switches to Arabic translations
  - Layout mirrors horizontally (CSS `direction: rtl`)
  - Font changes to one that supports Arabic well (e.g., `IBM Plex Sans Arabic` or `Noto Sans Arabic` from Google Fonts)
- **Translation file**: A JS object (`translations.js`) containing all UI strings in both languages
- **Approach**: All text rendered via JS uses translation keys: `t('dashboard.title')` → "Dashboard" or "لوحة المعلومات"
- **Data is language-independent**: Course names entered by the student stay as-is regardless of language
- **localStorage** remembers the user's language preference

### Translation Scope
All of these need Arabic translations:
- Navigation labels
- All headings, subheadings, descriptions
- Form labels, placeholders, validation messages
- Button text
- Toast notifications
- Modal dialogs
- Info/educational section (F vs FL, rules, GPA scale)
- Tooltips and help text
- Feasibility status messages in the planner

---

## Proposed Changes

### File Structure

```
GPA Calc/
├── index.html                # Main HTML shell with all views
├── css/
│   ├── variables.css         # Design tokens
│   ├── base.css              # Reset, body, background
│   ├── layout.css            # Nav, sections, responsive grid
│   ├── components.css        # Cards, buttons, inputs, tables, gauges
│   ├── animations.css        # Keyframes, transitions
│   └── rtl.css               # RTL overrides for Arabic layout
├── js/
│   ├── app.js                # Entry point, hash router, init
│   ├── gpa.js                # Pure GPA calculation logic
│   ├── planner.js            # Target GPA Planner engine
│   ├── state.js              # State management + localStorage
│   ├── ui.js                 # DOM rendering for all views
│   ├── translations.js       # EN/AR translation strings
│   ├── i18n.js               # Internationalization helper (t() function, RTL toggle)
│   └── utils.js              # Constants, helpers, grade map, validation
└── assets/
    └── favicon.svg           # ECU placeholder icon
```

---

### Design System (CSS)

#### [NEW] [variables.css](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/css/variables.css)

CSS custom properties on `:root`:

- **Color palette** (dark mode):
  - Background: deep navy/charcoal (`#0a0e1a`, `#111827`)
  - Surface: semi-transparent with blur (`rgba(17, 24, 39, 0.7)`)
  - Primary accent: blue → purple gradient (`#6366f1` → `#8b5cf6`)
  - Secondary: teal/cyan (`#06b6d4`)
  - Success: `#10b981`, Warning: `#f59e0b`, Danger: `#ef4444`
  - Text: white `#f9fafb`, muted `#9ca3af`
- **Typography**:
  - English: `Inter` (400, 500, 600, 700)
  - Arabic: `IBM Plex Sans Arabic` or `Noto Sans Arabic` (400, 500, 600, 700)
  - CSS variable `--font-family` switches based on language
- **Spacing**: 4px base
- **Border radius**: 8/12/16px + pill
- **Glassmorphism**: `backdrop-filter: blur(16px)`, subtle white border

#### [NEW] [base.css](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/css/base.css)

- CSS reset, smooth scrolling, dark background with decorative gradient blobs
- Font defaults, selection color, themed scrollbars
- `[dir="rtl"]` base adjustments

#### [NEW] [layout.css](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/css/layout.css)

- **Nav**: Fixed top, glassmorphism, ECU branding + nav links + **language toggle** (🌐 EN | AR)
- **Content**: Centered, max-width 1100px
- **Views**: `<section>` toggled via JS
- **Responsive**: CSS Grid dashboard, Flexbox forms, mobile-first

#### [NEW] [components.css](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/css/components.css)

- Cards, buttons (gradient primary, outlined secondary, danger, ghost), form inputs with focus glow
- Grade badges (color-coded pills)
- Progress bars (graduation progress, track eligibility at 75h)
- Circular GPA gauge (SVG)
- Course rows (flexible, with retake checkbox)
- Warning banner (for academic warnings, TGPA < 2.0)
- Info accordion/panels (for educational content)
- Toast notifications, modals
- Planner lock/unlock toggle per course

#### [NEW] [animations.css](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/css/animations.css)

- `fadeInUp`, `slideDown`, `pulse`, `countUp`, `progressFill`, `shimmer`
- Hover transitions on interactive elements

#### [NEW] [rtl.css](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/css/rtl.css)

RTL-specific overrides:
- Mirror padding/margin (logical properties where possible: `margin-inline-start` etc.)
- Flip icons that have directional meaning (arrows, etc.)
- Fix any layout issues that CSS `direction: rtl` doesn't handle automatically
- Adjust text alignment where needed
- Reverse flex `row` directions where explicitly set

---

### HTML Structure

#### [NEW] [index.html](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/index.html)

Single HTML file. `<html lang="en" dir="ltr">` (JS toggles to `lang="ar" dir="rtl"`).

- **`<head>`**: Meta tags, both Google Fonts (Inter + Arabic font), CSS imports, favicon
- **Title**: "ECU GPA Calculator" / "حاسبة المعدل التراكمي - الجامعة المصرية الصينية"

**Navigation bar**:
- ECU logo/name
- Links: Dashboard | Semester Calculator | Target GPA Planner ⭐ | Student Guide | GPA Scale
- **Language toggle**: 🌐 EN | عربي

---

**View: Welcome Hero** (`#welcome`)
- Animated headline: "Know Your GPA. Own Your Future." / "اعرف معدلك. امتلك مستقبلك."
- ECU University branding
- "Get Started" CTA → Setup
- Decorative gradient orbs

---

**View: Student Setup** (`#setup`)
- Profile form:
  - Total credit hours completed (0–138)
  - Non-GPA hours (tooltip explains: e.g., Chinese Language)
  - Current CGPA (0.00–4.00)
  - Number of academic warnings received (0–4, default 0)
- Validation: non-GPA hours ≤ total hours
- "Save & Continue" → Dashboard

---

**View: Dashboard** (`#dashboard`)

**Row 1 — Main Stats** (4 cards):
| Card | Content |
|------|---------|
| CGPA Gauge | Large SVG circular gauge (0–4.0), color-coded, animated |
| Completed Hours | X / 138 with progress bar |
| **Remaining Hours** | 138 − completed, prominently displayed |
| Academic Level | 1st–4th level badge |

**Row 2 — Important Alerts**:
- **Track Eligibility**: 
  - If hours < 75: "🔒 You need X more hours to choose your specialization track"
  - If hours ≥ 75: "✅ You are eligible to choose a specialization track"
- **Subject Limit**: Shows current max subjects allowed based on CGPA tier
- **Academic Warnings**: "⚠️ Warning X of 4" (red, prominent if warnings > 0)
  - If warnings = 4: "🚨 CRITICAL: You have used all 4 warnings. Next failure to achieve 2.0 TGPA may result in dismissal."

**Row 3 — Semester History**:
- Expandable accordion list of saved semesters
- Each shows: semester name, date, GPA, hours, course count
- Semesters where GPA < 2.0 flagged with ⚠️ warning icon
- Expand to see individual course details

**Quick Actions**: "Add Semester", "Plan Target GPA", "Edit Profile", "Reset Data"

---

**View: Semester Calculator** (`#semester`)

- **Header**: "New Semester"
- **Subject limit notice**: Shows the student's max based on CGPA (e.g., "You can take up to 6 subjects" or "⚠️ Your CGPA is below 1.8 — you can take up to 5 subjects. You may request more from administration.")

- **Course rows** (start with 1, add up to the CGPA-based limit):
  - Course name (text input, **optional** — placeholder "Course name (optional)")
  - Credit hours (dropdown: **default 3**, options: 0, 2, 3)
  - Grade (dropdown: A+ through W, including FL and ABS)
  - **Retake checkbox**: "Retake (F/FL)" — **unchecked by default**
    - When checked: grade dropdown caps at B+, orange border visual
  - Remove button (trash icon)
- **"+ Add Course" button**: Disabled when subject limit reached; shows message explaining why
- **Override note**: Small text "Need more subjects? You can request this from administration."

- **Live Preview Panel** (updates on every input change):
  - **Semester GPA** (large, color-coded)
  - **CGPA Change**: Current CGPA → Projected CGPA with ↑↓ arrow and color
  - **Warning Alert**: If semester GPA < 2.0, shows "⚠️ This semester GPA would trigger an academic warning (Warning X+1 of 4)"
  - Total semester hours
  - Updated remaining hours
  - Updated academic level (if it changes)

- **"Save Semester" button**: Saves to state, updates dashboard

---

**View: Target GPA Planner** (`#planner`) ⭐

**Step 1 — Set Your Target**:
- Shows current CGPA and GPA-counted hours
- Input: "Target CGPA" (0.00–4.00)
- **Two input modes** (radio buttons):
  - **"Add courses individually"**: Student adds courses one by one
  - **"Enter remaining hours"**: Student enters total remaining hours → system auto-creates courses distributed as 3-hour subjects (e.g., 15 hours → 5 courses of 3h each)
- Instant feasibility: "You need an average GPA of X.XX" / "❌ Impossible — would require above 4.0"

**Step 2 — Course Rows**:
- Same UI as semester calculator:
  - Name (optional), hours (default 3, can be 2 or 0), grade dropdown
  - Retake checkbox (caps at B+)
  - **Lock/unlock toggle**: 🔒 locked = student's manual choice; 🔓 unlocked = system controls
- "+ Add Course" button
- Grades **auto-filled** by system on all unlocked courses

**Step 3 — Interactive Adjustment**:
- When student changes a grade:
  1. That course becomes **locked**
  2. System **recalculates** all unlocked courses to still hit the target
  3. If impossible → warning: "With these locked grades, target is unreachable. Best possible CGPA: X.XX"
- Student can **unlock** a grade to let the system recalculate it

**Live Summary Panel**:
- Target CGPA vs. Projected CGPA (visual comparison bar)
- Feasibility status: ✅ Achievable / ⚠️ Tight / ❌ Impossible
- Locked courses count vs. system-managed count
- Total planned hours, remaining after plan

---

**View: Student Guide** (`#guide`) 📚 **NEW — Educational Info Section**

An informational page explaining key academic rules. Each topic in a collapsible accordion panel. Content in both English and Arabic.

**Panels**:

1. **Understanding F vs FL Grades**
   - Full explanation from the official ECU document
   - The two conditions for passing (50+ total AND 12/40 on final exam)
   - F vs FL comparison with examples table (from the photo)
   - Pass examples
   - Quick rule summary
   - Note: Both carry 0 points, both trigger B+ retake cap

2. **GPA Grading Scale**
   - Full table with points, grades, percentages
   - Color-coded grade badges
   - Explanation of special grades (CON, I, W, ABS)

3. **How GPA is Calculated**
   - Semester GPA formula with worked example
   - CGPA formula with worked example
   - What counts and what doesn't (non-GPA hours, excluded grades)

4. **Credit Hours & Academic Levels**
   - 138 total hours required
   - Level thresholds table
   - Remaining hours explanation

5. **Track Selection Requirement**
   - Students need **75 completed hours** to choose a specialization track
   - How to check eligibility on the dashboard

6. **Subject Limits Per Semester**
   - CGPA-based limits (< 1.0 → 4, < 1.8 → 5, ≥ 1.8 → 6)
   - How to request more subjects from administration

7. **Academic Warnings**
   - Semester GPA < 2.0 = warning
   - Maximum 4 warnings before dismissal
   - How to track warnings in the app

8. **Retake Rule**
   - F/FL courses can be retaken
   - Maximum grade on retake: B+ (3.2)
   - How this affects GPA planning

---

**View: GPA Scale Reference** (`#scale`)
- Beautiful styled table with grades, points, percentages
- Color-coded grade badges
- This can be a simpler version if the full detail is in the Student Guide

---

### JavaScript

#### [NEW] [utils.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/utils.js)

```js
GRADE_MAP = {
  'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
  'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0,
  'F': 0, 'FL': 0, 'ABS': 0
}
EXCLUDED_GRADES = ['CON', 'I', 'W']
RETAKE_MAX_GRADE = 'B+'  // 3.2 points
TOTAL_REQUIRED_HOURS = 138
TRACK_ELIGIBLE_HOURS = 75
MAX_WARNINGS = 4
WARNING_GPA_THRESHOLD = 2.0

SUBJECT_LIMITS = [
  { maxCGPA: 1.0, limit: 4 },
  { maxCGPA: 1.8, limit: 5 },
  { maxCGPA: Infinity, limit: 6 }
]

LEVEL_THRESHOLDS = [
  { level: 1, label: 'First Level',  labelAr: 'المستوى الأول', min: 0, max: 27 },
  { level: 2, label: 'Second Level', labelAr: 'المستوى الثاني', min: 28, max: 61 },
  { level: 3, label: 'Third Level',  labelAr: 'المستوى الثالث', min: 62, max: 95 },
  { level: 4, label: 'Fourth Level', labelAr: 'المستوى الرابع', min: 96, max: 138 }
]

DEFAULT_CREDIT_HOURS = 3
CREDIT_HOUR_OPTIONS = [0, 2, 3]
```

- `getAcademicLevel(hours)` → level object
- `getSubjectLimit(cgpa)` → max subjects number
- `isTrackEligible(hours)` → boolean
- `formatGPA(value)` → 2 decimal places
- `getGPAColor(gpa)` → color string
- `getGradeBadgeColor(grade)` → grade-specific color
- `getGradeOptions(isRetake)` → available grades array (capped at B+ if retake)
- `validateHours(total, nonGpa)` → validation result

#### [NEW] [translations.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/translations.js)

Complete translation object for all UI strings:

```js
const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      semester: "Semester Calculator",
      planner: "Target GPA Planner",
      guide: "Student Guide",
      scale: "GPA Scale"
    },
    welcome: {
      title: "Know Your GPA. Own Your Future.",
      subtitle: "Calculate, track, and plan your academic journey at ECU",
      cta: "Get Started"
    },
    dashboard: {
      title: "Dashboard",
      cgpa: "Current CGPA",
      completed: "Completed Hours",
      remaining: "Remaining Hours",
      level: "Academic Level",
      trackEligible: "✅ You are eligible to choose a specialization track",
      trackNotEligible: "🔒 You need {hours} more hours to choose your track",
      warningCount: "⚠️ Academic Warning {current} of {max}",
      subjectLimit: "You can take up to {limit} subjects per semester",
      // ... etc.
    },
    // ... all sections
  },
  ar: {
    nav: {
      dashboard: "لوحة المعلومات",
      semester: "حاسبة الفصل الدراسي",
      planner: "مخطط المعدل المستهدف",
      guide: "دليل الطالب",
      scale: "جدول التقديرات"
    },
    welcome: {
      title: "اعرف معدلك. امتلك مستقبلك.",
      subtitle: "احسب وتابع وخطط لمسيرتك الأكاديمية في الجامعة المصرية الصينية",
      cta: "ابدأ الآن"
    },
    // ... full Arabic translations for every string
  }
}
```

#### [NEW] [i18n.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/i18n.js)

Internationalization helper:

- `getCurrentLang()` → 'en' or 'ar' (from localStorage)
- `setLang(lang)` → saves to localStorage, updates `<html>` dir/lang attributes, re-renders page
- `t(key, params)` → returns translated string, supports `{placeholder}` interpolation
  - e.g., `t('dashboard.trackNotEligible', { hours: 15 })` → "🔒 You need 15 more hours..."
- `isRTL()` → `true` if Arabic
- Adds/removes `rtl` class on body for CSS targeting

#### [NEW] [gpa.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/gpa.js)

Pure calculation functions (same as before):

- `calculateSemesterGPA(courses)` → `{ gpa, totalHours, gpaCountedHours }`
- `calculateCGPA(prevCGPA, prevGPAHours, newSemGPA, newGPAHours)` → new CGPA
- `calculateCGPAFromAllSemesters(semesters)` → overall CGPA
- `getRemainingHours(totalCompleted)` → `138 − total`
- `getGPACountedHours(total, nonGPA)` → `total − nonGPA`
- 0-credit-hour courses: included in numerator (0 × points = 0) but not in denominator

#### [NEW] [planner.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/planner.js) ⭐

Target GPA Planner engine:

- **`calculateRequiredAverage(currentCGPA, currentGPAHours, targetCGPA, plannedHours)`**
  - `requiredAvg = (target × (current + planned) − currentCGPA × current) / planned`
  - Returns `{ requiredAverage, isPossible, bestPossibleCGPA }`

- **`distributeGrades(courses, requiredTotalPoints, lockedCourses)`**
  - Core algorithm:
    1. Sum locked course points
    2. Calculate remaining points needed from unlocked courses
    3. Calculate required average for unlocked courses
    4. Greedy grade fill: find bracketing grades, distribute higher/lower grades across courses to achieve exact target
    5. Respect B+ cap for retake courses
    6. Skip 0-credit-hour courses (they don't affect GPA)
  - Returns `{ gradedCourses, projectedCGPA, isExact, feasibility }`

- **`recalculateOnLock(courses, targetCGPA, currentCGPA, currentGPAHours)`**
  - Called when student locks/changes a grade
  - Returns updated course array + feasibility

- **`createCoursesFromHours(totalHours)`**
  - Distributes hours as 3-hour courses: e.g., 15h → 5 courses × 3h
  - If not divisible by 3, last course gets remainder (2h)

- **`getFeasibilityStatus(requiredAvg)`**
  - `'achievable'` (avg ≤ 3.4), `'tight'` (avg 3.4–4.0), `'impossible'` (avg > 4.0)

#### [NEW] [state.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/state.js)

```js
{
  lang: 'en',
  student: {
    totalHoursCompleted: 0,
    nonGPAHours: 0,
    currentCGPA: 0.0,
    warnings: 0,
    setupComplete: false
  },
  semesters: [{
    id, name, courses: [{ name, creditHours, grade, isRetake }],
    gpa, totalHours, gpaCountedHours, triggeredWarning, createdAt
  }],
  planner: {
    targetCGPA: null,
    inputMode: 'individual', // or 'hours'
    courses: [],
    lockedIndices: []
  }
}
```

- `loadState()` / `saveState()` — localStorage
- `resetState()` — with confirmation
- `addSemester(data)` — appends, recalculates totals, checks if warning triggered
- `deleteSemester(id)` — removes, recalculates
- `updateStudentProfile(data)`
- `savePlannerState(data)`

#### [NEW] [ui.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/ui.js)

DOM rendering:

- All text rendered via `t()` translation function
- `renderWelcome()`, `renderSetup(state)`, `renderDashboard(state)`
- `renderSemesterCalculator(state)`:
  - Enforces subject limit based on CGPA
  - Live preview with CGPA change indicator
  - Warning alert if semester GPA < 2.0
- `renderPlanner(state)`:
  - Two input modes (individual / bulk hours)
  - Auto-fill grades, lock/unlock, real-time recalculation
- `renderGuide()`: Educational accordion panels
- `renderGPAScale()`: Grading table
- `showToast()`, `showModal()`, `animateCounter()`
- `renderCGPAChange(current, projected)`: Arrow + color diff

#### [NEW] [app.js](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/js/app.js)

- Hash router: `#welcome`, `#setup`, `#dashboard`, `#semester`, `#planner`, `#guide`, `#scale`
- Init: load state → check setup → route
- Language toggle handler: calls `setLang()`, re-renders current view
- Global event delegation

---

### Assets

#### [NEW] [favicon.svg](file:///c:/Users/engab/Desktop/Projects/GPA%20Calc/assets/favicon.svg)

Placeholder SVG icon until ECU logo is provided.

---

## Verification Plan

### Calculation Spot-Checks

| Scenario | Expected |
|----------|----------|
| 3 courses: A+ (3h), B (3h), C (3h) | GPA = (12 + 9 + 7.2) / 9 = **3.13** |
| 2 courses: A (2h), F (3h) | GPA = (7.4 + 0) / 5 = **1.48** |
| 4 courses: B+ (3h), W (3h), A- (3h), CON (2h) | GPA = (9.6 + 10.2) / 6 = **3.30** |
| Course with 0 credit hours + A+ | GPA unchanged (0 in both num/denom) |
| CGPA: prev 3.0/60h, new sem 3.5/15h | (180 + 52.5) / 75 = **3.10** |
| Retake: student picks A → capped at B+ (3.2) | ✅ |
| Planner: target 3.5, current 3.0/60h, 15h | reqAvg = (262.5−180)/15 = **5.5** → ❌ |
| Planner: target 3.2, current 3.0/60h, 15h | reqAvg = (240−180)/15 = **4.0** → ⚠️ Tight |
| Planner: target 3.1, current 3.0/60h, 15h | reqAvg = (232.5−180)/15 = **3.5** → ✅ A- |

### Subject Limit Testing

| CGPA | Expected Limit | Test |
|------|----------------|------|
| 0.8 | 4 subjects | Try adding 5th → blocked with message |
| 1.5 | 5 subjects | Try adding 6th → blocked with message |
| 2.5 | 6 subjects | Can add 6, 7th blocked |

### Manual Testing

1. **First-time flow**: Welcome → Setup → Dashboard
2. **Language toggle**: Switch EN ↔ AR, verify RTL layout, all text translates
3. **Dashboard alerts**: Track eligibility, warning count, subject limit — all display correctly
4. **Semester calculator**: Subject limit enforced, retake caps at B+, live preview works
5. **Warning detection**: Save semester with GPA < 2.0, verify warning count increments
6. **Planner**: Both input modes (individual + bulk hours), lock/unlock, feasibility alerts
7. **Student Guide**: All accordion panels open/close, content matches official document
8. **Persistence**: Refresh → data retained, language retained
9. **Responsive**: 375px mobile, 1440px desktop
10. **Edge cases**: All W courses, 0-credit courses, 0 completed hours, 138 completed hours
