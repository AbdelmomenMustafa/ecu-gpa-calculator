# Instructions for AI Agent — ECU GPA Calculator Fixes & Improvements

You are working on an ECU University GPA Calculator website. Below are the bugs and feature improvements that need to be implemented. **Do NOT rewrite the entire project from scratch** — modify the existing code to fix these issues.

Read the full codebase first before making any changes.

---

## 1. Dashboard — Graduation Roadmap

The dashboard needs to show the student a clear roadmap to graduation. Make each of these a **separate visual card or section** so they work independently:

### 1A. Academic Level Display
- Show what **year/level** the student is currently in based on completed credit hours:
  - 1st Level: 0–27 hours
  - 2nd Level: 28–61 hours
  - 3rd Level: 62–95 hours
  - 4th Level: 96–138 hours

### 1B. Graduation Progress (Hours Remaining)
- Show **how many credit hours are left** to reach 138 (graduation requirement)
- Display as: "You have completed X hours. You need Y more hours to graduate."

### 1C. Track Specialization Progress
- **If the student has completed fewer than 75 hours**:
  - Show: "You need Z more hours to be eligible for track specialization (75 hours required)"
  - Also show: "After specialization, you'll need W more hours to graduate"
  - Show **two milestones**: first 75h (track), then 138h (graduation)
- **If the student has 75 or more hours**:
  - Show: "✅ You are eligible to choose your specialization track"
  - Show only the remaining hours to graduate

### 1D. Best-Case Semester Projection
Calculate and display how many **semesters** and **summer courses** the student needs to finish in the best-case scenario:

**Rules:**
- A regular semester allows a **maximum of 18 credit hours** (6 subjects × 3 hours)
- A **summer course** allows a **maximum of 9 credit hours** (3 subjects × 3 hours)
- The academic year has **2 regular semesters + 1 summer**

**Calculation logic:**
```
remainingHours = 138 - completedHours

// Try to figure out the fastest path:
// Each academic year = 2 regular semesters (18h each) + 1 summer (9h) = 45h max per year
// But we want to break it down:

fullYears = Math.floor(remainingHours / 45)
leftoverAfterYears = remainingHours % 45

// Then distribute the leftover across semesters and summers
// Regular semester first (up to 18h), then another regular (up to 18h), then summer (up to 9h)
```

Display something like:
- "Best case: **3 regular semesters** and **1 summer course** to graduate"
- Or: "Best case: **2 academic years** (4 regular semesters + 2 summers)"

Make it visual — use a timeline or step indicators showing each semester.

---

## 2. Semester Calculator — Flexibility Improvements

### 2A. CGPA-Based Subject Limit
The semester calculator should **ask the student for their current CGPA** (or pull it from saved state if available) and then **automatically determine** how many subjects they can register:

| CGPA Range | Max Subjects |
|------------|-------------|
| Less than 1.0 | 4 subjects |
| 1.0 – less than 1.8 | 5 subjects |
| 1.8 and above | 6 subjects |

- Show the limit clearly: "Based on your CGPA of X.XX, you can register up to Y subjects"
- **Disable the "Add Course" button** when the limit is reached

### 2B. Extra Subject with Approved Request
- Add a **checkbox** labeled: "I have an approved request to add an extra subject" (or similar)
- When this checkbox is checked, the subject limit **increases by 1** (e.g., from 6 to 7)
- The extra course row should have a **subtle visual distinction** (e.g., dashed border or different background) to show it's the extra approved one

### 2C. Live TGPA and CGPA Updates
As the student enters or changes grades for their subjects, the following should update **in real-time** (on every input change):

- **Semester GPA (TGPA)**: Calculated from only the courses entered in this semester
- **Projected CGPA**: What their new cumulative GPA would be after this semester
  - Formula: `newCGPA = (currentCGPA × currentGPAHours + semesterGPA × semesterGPAHours) / (currentGPAHours + semesterGPAHours)`
- Show the **change**: Current CGPA → New CGPA with an arrow and color (green if up, red if down)
- **Warning**: If the semester GPA is below 2.0, show: "⚠️ This semester GPA would trigger an academic warning"

---

## 3. Target GPA Planner — Fix the Grade Distribution Algorithm ⭐ CRITICAL

### The Problem
Currently, when a student sets a target GPA (e.g., 3.0) and adds 6 subjects, the system assigns **A+ to every subject**, which results in a **4.0 GPA** — NOT the requested 3.0. The system is ignoring the target and just maxing everything out.

### The Fix
The algorithm must assign the **minimum grades needed** to achieve the target GPA, not the maximum. The goal is to distribute grades as **close to the target as possible** without going significantly over.

### How the Algorithm Should Work

**Given:**
- `currentCGPA` = student's current cumulative GPA
- `currentGPAHours` = student's current GPA-counted hours
- `targetCGPA` = the student's desired CGPA
- `courses[]` = array of planned courses (each with `creditHours` and `isRetake`)

**Step 1: Calculate the total quality points needed from the new courses**
```
totalNewHours = sum of all course credit hours (exclude 0-hour courses)
requiredTotalPoints = targetCGPA × (currentGPAHours + totalNewHours) - currentCGPA × currentGPAHours
```

**Step 2: Check feasibility**
```
maxPossiblePoints = sum of (each course's max grade points × credit hours)
  // max is 4.0 for normal courses, 3.2 for retake courses
minPossiblePoints = 0 (all F grades)

if requiredTotalPoints > maxPossiblePoints → IMPOSSIBLE (show warning)
if requiredTotalPoints < minPossiblePoints → already above target (assign all minimum passing grades)
```

**Step 3: Distribute grades to hit the target (not exceed it)**

The key insight: find the **lowest combination of grades** that reaches the target.

```
Available grades (sorted lowest to highest):
F=0, D-=1.0, D=1.5, D+=2.0, C-=2.2, C=2.4, C+=2.6, B-=2.8, B=3.0, B+=3.2, A-=3.4, A=3.7, A+=4.0

Algorithm:
1. Calculate requiredAverage = requiredTotalPoints / totalNewHours
2. Find the two adjacent grades that BRACKET this average:
   - lowerGrade = the highest grade ≤ requiredAverage
   - upperGrade = the lowest grade > requiredAverage
3. For each unlocked course, assign grades such that the weighted average equals the target:
   - Calculate how many courses need the upperGrade vs lowerGrade
   - nUpper × upperGrade × hours + nLower × lowerGrade × hours = requiredTotalPoints
   - Solve for nUpper (the rest get lowerGrade)
4. If all courses have the same credit hours (e.g., all 3h):
   - nUpper = (requiredTotalPoints - lowerGrade × totalNewHours) / ((upperGrade - lowerGrade) × hoursPerCourse)
   - nLower = totalCourses - nUpper
5. For mixed credit hours, use a greedy approach:
   - Start by assigning lowerGrade to all courses
   - Calculate the deficit = requiredTotalPoints - (lowerGrade × totalNewHours)
   - For each course, upgrade from lowerGrade to upperGrade adds (upperGrade - lowerGrade) × creditHours points
   - Upgrade courses one by one until the deficit is covered
6. For retake courses: cap at B+ (3.2). If the required average is above 3.2, a retake course cannot go higher.
```

**Example — Target 3.0 CGPA, 6 subjects × 3 hours each, current CGPA 2.8 with 60 GPA hours:**
```
requiredTotalPoints = 3.0 × (60 + 18) - 2.8 × 60 = 234 - 168 = 66
requiredAverage = 66 / 18 = 3.67

Bracketing grades: A (3.7) and A- (3.4)
nUpper courses needing A (3.7): solve → some get A, rest get A-
Result: e.g., 3 courses get A (3.7) and 3 courses get A- (3.4)
Check: (3.7×9 + 3.4×9) = 33.3 + 30.6 = 63.9 → close to 66... 

(adjust algorithm for exactness — may need to mix in one A+ to make up the difference)
```

**A simpler alternative algorithm (fill from bottom up):**
```
1. Start all unlocked courses at the LOWEST grade (F = 0)
2. Calculate current total points = 0
3. While currentPoints < requiredTotalPoints:
   a. Find the course with the lowest current grade
   b. Upgrade it by ONE grade level (F → D- → D → D+ → C- → ... → A+)
   c. If it's a retake course, stop upgrading at B+
   d. Recalculate currentPoints
4. This naturally produces the MINIMUM grades needed to hit the target
```

This "fill from bottom up" approach is simpler to implement and guarantees the **minimum grades** to achieve the target. It will produce results like:
- Target 3.0 with 6 courses → might give: B, B, B, B, B, B (if that's exactly 3.0)
- Target 3.5 with 6 courses → might give: A-, A-, A-, A, A-, A-

### Step 4: Interactive Lock/Unlock (existing feature, make sure it works with new algorithm)
- When a student **manually changes** a grade on one course → that course becomes **locked**
- Recalculate the required points from the **remaining unlocked courses**
- Re-run the distribution algorithm on only the unlocked courses
- If the target becomes impossible with the locked grades → show: "⚠️ With your selected grades, the best possible CGPA is X.XX (target was Y.YY)"
- Student can **unlock** a grade to let the system recalculate it

### Step 5: Live Updates
- As grades change (whether by system or student), continuously update:
  - Projected semester GPA
  - Projected new CGPA
  - Feasibility status (✅ Achievable / ⚠️ Tight / ❌ Impossible)

---

## Summary of All Changes

| Area | What to Fix/Add |
|------|----------------|
| **Dashboard** | Add graduation roadmap: level display, remaining hours, track eligibility (75h), best-case semester + summer projection (max 18h/semester, 9h/summer) |
| **Semester Calculator** | Ask for CGPA to set subject limit (< 1.0 → 4, < 1.8 → 5, ≥ 1.8 → 6), add "approved extra subject" checkbox (+1), live TGPA and CGPA updates |
| **Target GPA Planner** | **FIX the algorithm** — distribute MINIMUM grades to hit target, NOT all A+. Use bottom-up fill or bracketing approach. Ensure lock/unlock recalculation works correctly |

## Important Notes
- All text must work in **both English and Arabic** (the site is bilingual with RTL support)
- Keep the existing dark-mode glassmorphism design — don't change the visual style
- Test the grade distribution algorithm with these cases:
  - Target 3.0, 6 courses × 3h, current 3.0/60h → should NOT give all A+
  - Target 2.0, 4 courses × 3h, current 1.5/30h → should give reasonable low grades
  - Target 3.5, 6 courses with 1 retake, current 3.2/45h → retake capped at B+
  - Lock 2 courses manually, verify others recalculate correctly
