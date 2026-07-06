const GRADE_MAP = {
  'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
  'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0,
  'F': 0, 'FL': 0, 'ABS': 0
};

const EXCLUDED_GRADES = ['CON', 'I', 'W', 'FL', 'ABS'];

const RETAKE_MAX_GRADE = 'B+';
const RETAKE_MAX_POINTS = 3.2;

const TOTAL_REQUIRED_HOURS = 138;
const TRACK_ELIGIBLE_HOURS = 75;
const MAX_WARNINGS = 4;
const WARNING_GPA_THRESHOLD = 2.0;

const SUBJECT_LIMITS = [
  { maxCGPA: 1.0, limit: 4 },
  { maxCGPA: 1.8, limit: 5 },
  { maxCGPA: Infinity, limit: 6 }
];

const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 27 },
  { level: 2, min: 28, max: 61 },
  { level: 3, min: 62, max: 95 },
  { level: 4, min: 96, max: 138 }
];

const DEFAULT_CREDIT_HOURS = 3;
const CREDIT_HOUR_OPTIONS = [0, 2, 3];

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'FL', 'ABS', 'CON', 'I', 'W'];

const ALL_GRADE_OPTIONS = GRADE_OPTIONS;

function getAcademicLevel(hours) {
  for (const t of LEVEL_THRESHOLDS) {
    if (hours >= t.min && hours <= t.max) return t;
  }
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

function getSubjectLimit(cgpa) {
  for (const s of SUBJECT_LIMITS) {
    if (cgpa < s.maxCGPA) return s.limit;
  }
  return SUBJECT_LIMITS[SUBJECT_LIMITS.length - 1].limit;
}

function isTrackEligible(hours) {
  return hours >= TRACK_ELIGIBLE_HOURS;
}

function formatGPA(value) {
  return Number(value).toFixed(2);
}

function getGPAColor(gpa) {
  if (gpa >= 3.5) return 'var(--accent-success)';
  if (gpa >= 3.0) return 'var(--accent-teal)';
  if (gpa >= 2.5) return 'var(--accent-primary)';
  if (gpa >= 2.0) return 'var(--accent-warning)';
  return 'var(--accent-danger)';
}

function getGradeBadgeClass(grade) {
  const map = {
    'A+': 'aplus', 'A': 'a', 'A-': 'aminus',
    'B+': 'bplus', 'B': 'b', 'B-': 'bminus',
    'C+': 'cplus', 'C': 'c', 'C-': 'cminus',
    'D+': 'dplus', 'D': 'd', 'D-': 'dminus',
    'F': 'f', 'FL': 'fl', 'ABS': 'abs',
    'CON': 'con', 'I': 'i', 'W': 'w'
  };
  return 'grade-' + (map[grade] || 'f');
}

function getGradeOptions(isRetake) {
  if (isRetake) {
    return ALL_GRADE_OPTIONS.filter(g => {
      const pts = GRADE_MAP[g];
      return pts !== undefined && pts <= RETAKE_MAX_POINTS;
    });
  }
  return [...ALL_GRADE_OPTIONS];
}

function validateHours(total, nonGpa) {
  if (nonGpa > total) {
    return { valid: false, message: 'Non-GPA hours cannot exceed total hours' };
  }
  return { valid: true };
}

function getGradeColor(grade) {
  const pts = GRADE_MAP[grade];
  if (pts === undefined) return 'var(--text-muted)';
  if (pts >= 3.5) return '#34d399';
  if (pts >= 3.0) return '#67e8f9';
  if (pts >= 2.5) return '#a5b4fc';
  if (pts >= 2.0) return '#fbbf24';
  if (pts > 0) return '#f87171';
  return '#ef4444';
}
