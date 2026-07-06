const STORAGE_KEY = 'ecu-gpa-data';

const defaultState = {
  lang: 'en',
  student: {
    totalHoursCompleted: 0,
    nonGPAHours: 0,
    currentCGPA: 0.0,
    warnings: 0,
    setupComplete: false
  },
  semesters: [],
  planner: {
    targetCGPA: null,
    inputMode: 'individual',
    courses: [],
    lockedIndices: []
  }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { ...defaultState };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultState };
}

function addSemester(state, semesterData) {
  const semGPA = calculateSemesterGPA(semesterData.courses);
  const triggeredWarning = semGPA.gpa < WARNING_GPA_THRESHOLD && semGPA.gpaCountedHours > 0;

  const semester = {
    id: Date.now().toString(),
    name: semesterData.name || `Semester ${state.semesters.length + 1}`,
    courses: semesterData.courses,
    gpa: semGPA.gpa,
    totalHours: semGPA.totalHours,
    gpaCountedHours: semGPA.gpaCountedHours,
    totalPoints: semGPA.totalPoints,
    triggeredWarning,
    createdAt: new Date().toISOString()
  };

  state.semesters.push(semester);

  const totalCompleted = state.semesters.reduce((sum, s) => sum + s.totalHours, 0);
  const totalGPAHours = state.semesters.reduce((sum, s) => sum + s.gpaCountedHours, 0);
  const totalPoints = state.semesters.reduce((sum, s) => sum + s.totalPoints, 0);

  state.student.totalHoursCompleted = totalCompleted + state.student.nonGPAHours;
  state.student.currentCGPA = totalGPAHours > 0 ? totalPoints / totalGPAHours : 0;

  if (triggeredWarning) {
    state.student.warnings = Math.min(state.student.warnings + 1, MAX_WARNINGS);
  }

  saveState(state);
  return { semester, triggeredWarning };
}

function deleteSemester(state, semesterId) {
  state.semesters = state.semesters.filter(s => s.id !== semesterId);

  const totalCompleted = state.semesters.reduce((sum, s) => sum + s.totalHours, 0);
  const totalGPAHours = state.semesters.reduce((sum, s) => sum + s.gpaCountedHours, 0);
  const totalPoints = state.semesters.reduce((sum, s) => sum + s.totalPoints, 0);

  state.student.totalHoursCompleted = totalCompleted + state.student.nonGPAHours;
  state.student.currentCGPA = totalGPAHours > 0 ? totalPoints / totalGPAHours : 0;

  let warnings = 0;
  for (const sem of state.semesters) {
    if (sem.triggeredWarning) warnings++;
  }
  state.student.warnings = warnings;

  saveState(state);
}

function updateStudentProfile(state, data) {
  state.student.totalHoursCompleted = data.totalHoursCompleted;
  state.student.nonGPAHours = data.nonGPAHours;
  state.student.currentCGPA = data.currentCGPA;
  state.student.warnings = data.warnings;
  state.student.setupComplete = true;
  saveState(state);
}

function savePlannerState(state, plannerData) {
  state.planner = { ...state.planner, ...plannerData };
  saveState(state);
}
