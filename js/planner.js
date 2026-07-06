function calculateRequiredAverage(currentCGPA, currentGPAHours, targetCGPA, plannedHours) {
  if (plannedHours <= 0) return { requiredAverage: 0, isPossible: false, bestPossibleCGPA: currentCGPA };

  const requiredTotalPoints = targetCGPA * (currentGPAHours + plannedHours);
  const currentTotalPoints = currentCGPA * currentGPAHours;
  const neededPoints = requiredTotalPoints - currentTotalPoints;
  const requiredAvg = neededPoints / plannedHours;

  const isPossible = requiredAvg <= 4.0;
  const bestPossibleCGPA = isPossible
    ? targetCGPA
    : (currentTotalPoints + 4.0 * plannedHours) / (currentGPAHours + plannedHours);

  return { requiredAverage: requiredAvg, isPossible, bestPossibleCGPA };
}

const GRADES_WITH_POINTS = [
  ['F', 0], ['D-', 1.0], ['D', 1.5], ['D+', 2.0],
  ['C-', 2.2], ['C', 2.4], ['C+', 2.6], ['B-', 2.8],
  ['B', 3.0], ['B+', 3.2], ['A-', 3.4], ['A', 3.7], ['A+', 4.0]
];

function findBracketingGrades(requiredAvg, maxPoints) {
  let lower = GRADES_WITH_POINTS[0];
  let upper = GRADES_WITH_POINTS[GRADES_WITH_POINTS.length - 1];

  for (let i = 0; i < GRADES_WITH_POINTS.length; i++) {
    const [g, p] = GRADES_WITH_POINTS[i];
    if (p > maxPoints) break;
    if (p <= requiredAvg) {
      lower = [g, p];
    }
    if (p >= requiredAvg && upper[1] > p) {
      upper = [g, p];
    }
  }

  if (requiredAvg <= lower[1]) return { lower, upper: lower };
  if (requiredAvg >= upper[1]) return { lower: upper, upper };

  return { lower, upper };
}

function distributeGrades(courses, targetCGPA, currentCGPA, currentGPAHours) {
  let lockedPoints = 0;
  let unlockedHours = 0;
  let totalPlannedHours = 0;

  const processed = courses.map((c, i) => ({
    ...c,
    index: i,
    points: GRADE_MAP[c.grade] !== undefined ? GRADE_MAP[c.grade] : null,
    isLocked: c.isLocked || false,
    isRetake: c.isRetake || false
  }));

  for (const c of processed) {
    totalPlannedHours += c.creditHours || 0;
    if (c.isLocked && c.points !== null && !EXCLUDED_GRADES.includes(c.grade)) {
      lockedPoints += c.points * (c.creditHours || 0);
    } else if (!EXCLUDED_GRADES.includes(c.grade)) {
      unlockedHours += c.creditHours || 0;
    }
  }

  const requiredTotalPoints = targetCGPA * (currentGPAHours + totalPlannedHours);
  const currentTotalPoints = currentCGPA * currentGPAHours;
  const neededFromUnlocked = requiredTotalPoints - currentTotalPoints - lockedPoints;

  const unlockedCourses = processed.filter(c => !c.isLocked && !EXCLUDED_GRADES.includes(c.grade));
  const count = unlockedCourses.length;

  if (unlockedHours === 0 || count === 0) {
    const projectedCGPA = (currentTotalPoints + lockedPoints) / (currentGPAHours + totalPlannedHours);
    return { gradedCourses: processed, projectedCGPA, isExact: true, feasibility: getFeasibilityStatus(projectedCGPA), lockedPoints };
  }

  const requiredAvg = neededFromUnlocked / unlockedHours;

  if (requiredAvg > 4.0) {
    for (const c of unlockedCourses) {
      c.grade = c.isRetake ? RETAKE_MAX_GRADE : 'A+';
      c.points = c.isRetake ? RETAKE_MAX_POINTS : 4.0;
    }
    const bestProjected = (currentTotalPoints + lockedPoints + unlockedCourses.reduce((sum, c) => sum + c.points * (c.creditHours || 0), 0)) / (currentGPAHours + totalPlannedHours);
    return { gradedCourses: processed, projectedCGPA: bestProjected, isExact: false, feasibility: 'impossible', lockedPoints };
  }

  if (neededFromUnlocked <= 0) {
    for (const c of unlockedCourses) {
      c.grade = 'C';
      c.points = 2.4;
    }
    const pts = unlockedCourses.reduce((sum, c) => sum + c.points * (c.creditHours || 0), 0);
    const projectedCGPA = (currentTotalPoints + lockedPoints + pts) / (currentGPAHours + totalPlannedHours);
    return { gradedCourses: processed, projectedCGPA: Math.min(projectedCGPA, targetCGPA), isExact: false, feasibility: 'achievable', lockedPoints };
  }

  const maxAllowedPoints = unlockedCourses.some(c => c.isRetake) ? RETAKE_MAX_POINTS : 4.0;
  const { lower, upper } = findBracketingGrades(requiredAvg, maxAllowedPoints);

  let totalAssignedPoints = 0;

  if (lower[1] === upper[1]) {
    for (const c of unlockedCourses) {
      c.grade = lower[0];
      c.points = lower[1];
      totalAssignedPoints += lower[1] * (c.creditHours || 0);
    }
  } else {
    const allGetLower = unlockedCourses.reduce((sum, c) => sum + lower[1] * (c.creditHours || 0), 0);
    const deficit = neededFromUnlocked - allGetLower;
    const upgradePerCourse = (upper[1] - lower[1]);

    let coursesToUpgrade = [];
    for (const c of unlockedCourses) {
      coursesToUpgrade.push({ course: c, upgradeValue: upgradePerCourse * (c.creditHours || 0) });
    }
    coursesToUpgrade.sort((a, b) => b.upgradeValue - a.upgradeValue);

    let upgradedPoints = 0;
    const upgradedSet = new Set();

    for (const item of coursesToUpgrade) {
      if (upgradedPoints >= deficit) break;
      upgradedPoints += item.upgradeValue;
      upgradedSet.add(item.course.index);
    }

    for (const c of unlockedCourses) {
      if (upgradedSet.has(c.index)) {
        c.grade = upper[0];
        c.points = upper[1];
      } else {
        c.grade = lower[0];
        c.points = lower[1];
      }

      if (c.isRetake && c.points > RETAKE_MAX_POINTS) {
        c.grade = RETAKE_MAX_GRADE;
        c.points = RETAKE_MAX_POINTS;
      }

      totalAssignedPoints += c.points * (c.creditHours || 0);
    }
  }

  const projectedPoints = currentTotalPoints + lockedPoints + totalAssignedPoints;
  const projectedHours = currentGPAHours + totalPlannedHours;
  const projectedCGPA = projectedHours > 0 ? projectedPoints / projectedHours : 0;

  const diff = Math.abs(projectedCGPA - targetCGPA);
  const isExact = diff <= 0.02;

  let feasibility;
  if (requiredAvg > 4.0) feasibility = 'impossible';
  else if (requiredAvg > 3.4) feasibility = 'tight';
  else feasibility = 'achievable';

  return { gradedCourses: processed, projectedCGPA, isExact, feasibility, lockedPoints };
}

function recalculateOnLock(courses, targetCGPA, currentCGPA, currentGPAHours) {
  return distributeGrades(courses, targetCGPA, currentCGPA, currentGPAHours);
}

function createCoursesFromHours(totalHours) {
  const courses = [];
  let remaining = totalHours;

  while (remaining >= 3) {
    courses.push({ name: '', creditHours: 3, grade: 'C', isRetake: false, isLocked: false });
    remaining -= 3;
  }

  if (remaining > 0) {
    courses.push({ name: '', creditHours: remaining, grade: 'C', isRetake: false, isLocked: false });
  }

  return courses;
}

function getFeasibilityStatus(requiredAvg) {
  if (requiredAvg > 4.0) return 'impossible';
  if (requiredAvg > 3.4) return 'tight';
  return 'achievable';
}
