function calculateSemesterGPA(courses) {
  let totalPoints = 0;
  let totalHours = 0;
  let gpaCountedHours = 0;

  for (const course of courses) {
    const pts = GRADE_MAP[course.grade];
    if (pts === undefined || EXCLUDED_GRADES.includes(course.grade)) continue;

    const hours = course.creditHours || 0;
    totalPoints += pts * hours;
    totalHours += hours;

    if (hours > 0) {
      gpaCountedHours += hours;
    }
  }

  const gpa = gpaCountedHours > 0 ? totalPoints / gpaCountedHours : 0;
  return { gpa, totalHours, gpaCountedHours, totalPoints };
}

function calculateCGPA(prevCGPA, prevGPAHours, newSemGPA, newGPAHours) {
  if (prevGPAHours + newGPAHours === 0) return 0;
  return ((prevCGPA * prevGPAHours) + (newSemGPA * newGPAHours)) / (prevGPAHours + newGPAHours);
}

function calculateCGPAFromAllSemesters(semesters) {
  let totalPoints = 0;
  let totalHours = 0;

  for (const sem of semesters) {
    if (!sem.courses) continue;
    for (const course of sem.courses) {
      const pts = GRADE_MAP[course.grade];
      if (pts === undefined || EXCLUDED_GRADES.includes(course.grade)) continue;
      const hours = course.creditHours || 0;
      totalPoints += pts * hours;
      totalHours += hours;
    }
  }

  return totalHours > 0 ? totalPoints / totalHours : 0;
}

function getRemainingHours(totalCompleted) {
  return Math.max(0, TOTAL_REQUIRED_HOURS - totalCompleted);
}

function getGPACountedHours(total, nonGPA) {
  return Math.max(0, total - nonGPA);
}

function getTotalGPAPoints(semesters) {
  let total = 0;
  for (const sem of semesters) {
    if (!sem.courses) continue;
    for (const course of sem.courses) {
      const pts = GRADE_MAP[course.grade];
      if (pts === undefined || EXCLUDED_GRADES.includes(course.grade)) continue;
      total += pts * (course.creditHours || 0);
    }
  }
  return total;
}
