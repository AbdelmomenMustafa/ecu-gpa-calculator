function renderWelcome() {
  const container = document.getElementById('app');
  container.innerHTML = `
    <section class="view active" id="welcome">
      <div class="welcome-hero">
        <div class="animate-float" style="font-size: 3rem; margin-bottom: 16px;">🎓</div>
        <h1>${t('welcome.title')}</h1>
        <p>${t('welcome.subtitle')}</p>
        <button class="btn btn-primary btn-lg" onclick="navigateTo('setup')">${t('welcome.cta')}</button>
        <div class="welcome-features">
          <div class="card hover-lift">
            <div style="font-size: 2rem; margin-bottom: 8px;">📊</div>
            <h3 style="margin-bottom: 4px;">${t('welcome.feature1Title')}</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">${t('welcome.feature1Desc')}</p>
          </div>
          <div class="card hover-lift">
            <div style="font-size: 2rem; margin-bottom: 8px;">🎯</div>
            <h3 style="margin-bottom: 4px;">${t('welcome.feature2Title')}</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">${t('welcome.feature2Desc')}</p>
          </div>
          <div class="card hover-lift">
            <div style="font-size: 2rem; margin-bottom: 8px;">📚</div>
            <h3 style="margin-bottom: 4px;">${t('welcome.feature3Title')}</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">${t('welcome.feature3Desc')}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSetup(state) {
  const s = state.student;
  const container = document.getElementById('app');
  container.innerHTML = `
    <section class="view active" id="setup" style="max-width: 600px; margin: 0 auto;">
      <h2 class="section-title">${t('setup.title')}</h2>
      <p class="section-subtitle">${t('setup.subtitle')}</p>
      <div class="card">
        <div class="form-group">
          <label class="form-label">${t('setup.totalHours')}</label>
          <input type="number" class="form-input" id="setup-hours" min="0" max="138" value="${s.totalHoursCompleted}">
          <span class="form-hint">${t('setup.totalHoursHint')}</span>
        </div>
        <div class="form-group">
          <label class="form-label">${t('setup.nonGpaHours')}</label>
          <input type="number" class="form-input" id="setup-nongpa" min="0" max="138" value="${s.nonGPAHours}">
          <span class="form-hint">${t('setup.nonGpaHoursHint')}</span>
        </div>
        <div class="form-group">
          <label class="form-label">${t('setup.currentCGPA')}</label>
          <input type="number" class="form-input" id="setup-cgpa" min="0" max="4" step="0.01" value="${s.currentCGPA}">
          <span class="form-hint">${t('setup.currentCGPAHint')}</span>
        </div>
        <div class="form-group">
          <label class="form-label">${t('setup.warnings')}</label>
          <input type="number" class="form-input" id="setup-warnings" min="0" max="4" value="${s.warnings}">
          <span class="form-hint">${t('setup.warningsHint')}</span>
        </div>
        <div id="setup-error" style="color: var(--accent-danger); font-size: 0.85rem; margin-bottom: 12px;"></div>
        <button class="btn btn-primary" onclick="handleSetupSave()">${t('setup.save')}</button>
      </div>
    </section>
  `;

  document.getElementById('setup-hours').addEventListener('input', validateSetup);
  document.getElementById('setup-nongpa').addEventListener('input', validateSetup);
  document.getElementById('setup-cgpa').addEventListener('input', validateSetup);
}

function validateSetup() {
  const hours = parseInt(document.getElementById('setup-hours').value) || 0;
  const nonGpa = parseInt(document.getElementById('setup-nongpa').value) || 0;
  const cgpa = parseFloat(document.getElementById('setup-cgpa').value) || 0;
  const errEl = document.getElementById('setup-error');

  if (nonGpa > hours) {
    errEl.textContent = t('setup.validation.nonGpaExceeds');
    return false;
  }
  if (cgpa < 0 || cgpa > 4) {
    errEl.textContent = t('setup.validation.invalidCGPA');
    return false;
  }
  if (hours < 0 || hours > 138) {
    errEl.textContent = t('setup.validation.invalidHours');
    return false;
  }
  errEl.textContent = '';
  return true;
}

function handleSetupSave() {
  if (!validateSetup()) return;
  const state = AppState;
  updateStudentProfile(state, {
    totalHoursCompleted: parseInt(document.getElementById('setup-hours').value) || 0,
    nonGPAHours: parseInt(document.getElementById('setup-nongpa').value) || 0,
    currentCGPA: parseFloat(document.getElementById('setup-cgpa').value) || 0,
    warnings: parseInt(document.getElementById('setup-warnings').value) || 0
  });
  showToast(t('common.save') + ' ✓', 'success');
  navigateTo('dashboard');
}

function calculateBestCaseProjection(remainingHours) {
  const SEMESTER_MAX = 18;
  const SUMMER_MAX = 9;

  let semesters = 0;
  let summers = 0;
  let left = remainingHours;

  while (left > 0) {
    if (left >= SEMESTER_MAX) {
      semesters++;
      left -= SEMESTER_MAX;
    } else if (left >= SUMMER_MAX) {
      summers++;
      left -= SUMMER_MAX;
    } else if (left >= 3) {
      semesters++;
      left -= SEMESTER_MAX;
    } else {
      semesters++;
      left = 0;
    }
  }

  const years = Math.ceil(semesters / 2);
  return { semesters, summers, years };
}

function renderDashboard(state) {
  const s = state.student;
  const completedHours = s.totalHoursCompleted - s.nonGPAHours;
  const remaining = getRemainingHours(completedHours);
  const level = getAcademicLevel(completedHours);
  const limit = getSubjectLimit(s.currentCGPA);
  const progress = (s.totalHoursCompleted / TOTAL_REQUIRED_HOURS) * 100;
  const trackRemaining = Math.max(0, TRACK_ELIGIBLE_HOURS - completedHours);
  const isTrackElig = isTrackEligible(completedHours);
  const bestCase = calculateBestCaseProjection(remaining);

  const container = document.getElementById('app');
  container.innerHTML = `
    <section class="view active" id="dashboard">
      <h2 class="section-title">${t('dashboard.title')}</h2>

      <div class="grid-4" style="margin-bottom: 24px;">
        <div class="card card-primary">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <span class="card-title">${t('dashboard.cgpa')}</span>
          </div>
          <div class="card-value" style="color: ${getGPAColor(s.currentCGPA)}">${formatGPA(s.currentCGPA)}</div>
          <div class="card-subtitle">${t('dashboard.level')} ${level.level}</div>
        </div>
        <div class="card card-teal">
          <div class="card-header">
            <div class="card-icon">✅</div>
            <span class="card-title">${t('dashboard.completed')}</span>
          </div>
          <div class="card-value">${completedHours}</div>
          <div class="progress-container" style="margin-top: 8px;">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <div class="progress-bar-label">
              <span>${TOTAL_REQUIRED_HOURS}h total</span>
              <span>${Math.round(progress)}%</span>
            </div>
          </div>
        </div>
        <div class="card card-warning">
          <div class="card-header">
            <div class="card-icon">⏳</div>
            <span class="card-title">${t('dashboard.remaining')}</span>
          </div>
          <div class="card-value">${remaining}</div>
          <div class="card-subtitle">${t('dashboard.hours')}</div>
        </div>
        <div class="card card-success">
          <div class="card-header">
            <div class="card-icon">🏫</div>
            <span class="card-title">${t('dashboard.level')}</span>
          </div>
          <div class="card-value">${level.level}</div>
          <div class="card-subtitle">${['', 'First', 'Second', 'Third', 'Fourth'][level.level]} Level</div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 16px; padding: 20px;">
        <h3 style="margin-bottom: 12px; font-size: 1.1rem;">🎓 ${currentLang === 'ar' ? 'مسار التخرج' : 'Graduation Roadmap'}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
          ${currentLang === 'ar'
            ? `لقد أكملت ${completedHours} ساعة. تحتاج ${remaining} ساعة إضافية للتخرج.`
            : `You have completed ${completedHours} hours. You need ${remaining} more hours to graduate.`}
        </p>

        <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">${currentLang === 'ar' ? 'التقدم نحو التخصص' : 'Track Specialization Progress'}</div>
            <div style="position: relative; height: 32px; background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;">
              <div style="height: 100%; width: ${Math.min((completedHours / TRACK_ELIGIBLE_HOURS) * 100, 100)}%; background: ${isTrackElig ? 'var(--accent-success)' : 'var(--accent-primary)'}; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; min-width: 40px; transition: width 0.6s ease;">
                ${completedHours}/${TRACK_ELIGIBLE_HOURS}h
              </div>
              <div style="position: absolute; top: 50%; left: ${(TRACK_ELIGIBLE_HOURS / TOTAL_REQUIRED_HOURS) * 100}%; transform: translate(-50%, -50%); width: 2px; height: 40px; background: var(--accent-warning);"></div>
            </div>
            ${isTrackElig
              ? `<div style="color: var(--accent-success); font-size: 0.85rem; margin-top: 4px;">✅ ${currentLang === 'ar' ? 'أنت مؤهل لاختيار تخصص' : 'You are eligible to choose your track'}</div>`
              : `<div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">🔒 ${currentLang === 'ar' ? `تحتاج ${trackRemaining} ساعة إضافية لتكون مؤهلاً` : `You need ${trackRemaining} more hours to be eligible`}</div>`
            }
          </div>
        </div>

        ${!isTrackElig ? `
          <div style="padding: 12px; background: rgba(99, 102, 241, 0.08); border-radius: 8px; margin-bottom: 12px;">
            <div style="font-size: 0.85rem; color: var(--text-secondary);">
              ${currentLang === 'ar'
                ? `بعد التخصص، ستحتاج ${Math.max(0, remaining - (TRACK_ELIGIBLE_HOURS - completedHours))} ساعة إضافية للتخرج`
                : `After specialization, you'll need ${Math.max(0, remaining - (TRACK_ELIGIBLE_HOURS - completedHours))} more hours to graduate`}
            </div>
          </div>
        ` : ''}

        <div style="padding: 12px; background: rgba(16, 185, 129, 0.08); border-radius: 8px;">
          <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">${currentLang === 'ar' ? 'أفضل سيناريو' : 'Best-Case Projection'}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            ${currentLang === 'ar'
              ? `${bestCase.semesters} فصل دراسي و ${bestCase.summers} صيفي — حوالي ${bestCase.years} ${bestCase.years > 1 ? 'سنوات' : 'سنة'}`
              : `${bestCase.semesters} regular semesters and ${bestCase.summers} summer courses — about ${bestCase.years} ${bestCase.years > 1 ? 'years' : 'year'}`}
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            ${Array.from({ length: bestCase.semesters }, (_, i) =>
              `<div style="padding: 4px 10px; background: rgba(99, 102, 241, 0.15); border-radius: 6px; font-size: 0.75rem; color: var(--accent-primary);">📚 ${currentLang === 'ar' ? 'فصل' : 'Semester'} ${i + 1}</div>`
            ).join('')}
            ${Array.from({ length: bestCase.summers }, (_, i) =>
              `<div style="padding: 4px 10px; background: rgba(6, 182, 212, 0.15); border-radius: 6px; font-size: 0.75rem; color: var(--accent-teal);">☀️ ${currentLang === 'ar' ? 'صيفي' : 'Summer'} ${i + 1}</div>`
            ).join('')}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        ${s.warnings > 0 ? `
          <div class="alert alert-danger" style="margin-bottom: 8px;">
            <span class="alert-icon">⚠️</span>
            ${s.warnings >= MAX_WARNINGS
              ? t('dashboard.warningCritical')
              : t('dashboard.warningCount', { current: s.warnings, max: MAX_WARNINGS })}
          </div>
        ` : ''}
        <div class="alert alert-warning">
          <span class="alert-icon">📋</span>
          ${t('dashboard.subjectLimit', { limit })}
        </div>
      </div>

      <h3 style="margin-bottom: 16px; font-size: 1.2rem;">${t('dashboard.semesterHistory')}</h3>
      ${state.semesters.length === 0
        ? `<div class="card" style="text-align: center; padding: 40px;">
            <div style="font-size: 2rem; margin-bottom: 8px;">📝</div>
            <p style="color: var(--text-muted);">${t('dashboard.noSemesters')}</p>
          </div>`
        : state.semesters.slice().reverse().map(sem => `
          <div class="card" style="margin-bottom: 8px;">
            <div class="flex-between">
              <div>
                <strong>${sem.name}</strong>
                ${sem.triggeredWarning ? '<span class="badge badge-danger" style="margin-left: 8px;">⚠️ ' + t('dashboard.triggeredWarning') + '</span>' : ''}
              </div>
              <div class="flex-row">
                <span class="badge badge-primary">${t('dashboard.semesterGpa')}: ${formatGPA(sem.gpa)}</span>
                <span class="badge badge-teal">${sem.totalHours}h</span>
                <span class="badge badge-success">${sem.courses.length} ${t('dashboard.courses')}</span>
                <button class="btn btn-danger btn-sm" onclick="handleDeleteSemester('${sem.id}')">${t('dashboard.deleteSemester')}</button>
              </div>
            </div>
          </div>
        `).join('')
      }

      <div class="flex-row" style="margin-top: 24px; gap: 12px; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="navigateTo('semester')">➕ ${t('dashboard.addSemester')}</button>
        <button class="btn btn-secondary" onclick="navigateTo('planner')">🎯 ${t('dashboard.planGPA')}</button>
        <button class="btn btn-secondary" onclick="navigateTo('setup')">✏️ ${t('dashboard.editProfile')}</button>
        <button class="btn btn-danger" onclick="handleResetData()">🗑️ ${t('dashboard.resetData')}</button>
      </div>
    </section>
  `;
}

function handleDeleteSemester(id) {
  if (!confirm(t('dashboard.deleteConfirm'))) return;
  deleteSemester(AppState, id);
  renderDashboard(AppState);
  showToast(t('common.delete') + ' ✓', 'success');
}

function handleResetData() {
  if (!confirm(t('dashboard.resetConfirm'))) return;
  Object.assign(AppState, resetState());
  navigateTo('welcome');
  showToast(t('dashboard.resetData') + ' ✓', 'info');
}

let semesterCourses = [];
let hasExtraSubjectApproval = false;
let semesterCGPA = null;
let semesterHours = null;

function renderSemesterCalculator(state) {
  const s = state.student;
  if (semesterCGPA === null) semesterCGPA = s.currentCGPA;
  if (semesterHours === null) semesterHours = s.totalHoursCompleted - s.nonGPAHours;

  const baseLimit = getSubjectLimit(semesterCGPA);
  const effectiveLimit = hasExtraSubjectApproval ? baseLimit + 1 : baseLimit;

  if (semesterCourses.length === 0) {
    semesterCourses = [{ name: '', creditHours: DEFAULT_CREDIT_HOURS, grade: 'A+', isRetake: false }];
  }

  const container = document.getElementById('app');
  container.innerHTML = `
    <section class="view active" id="semester">
      <div style="display: grid; grid-template-columns: 1fr 320px; gap: 24px;">
        <div>
          <h2 class="section-title">${t('semester.title')}</h2>
          <p class="section-subtitle">${t('semester.subtitle')}</p>

          <div class="card" style="margin-bottom: 20px;">
            <h3 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--text-secondary);">${currentLang === 'ar' ? 'معلوماتك الحالية' : 'Your Current Info'}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: end;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">${currentLang === 'ar' ? 'المعدل التراكمي الحالي' : 'Current CGPA'}</label>
                <input type="number" class="form-input" id="sem-cgpa" min="0" max="4" step="0.01" value="${semesterCGPA}">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">${currentLang === 'ar' ? 'الساعات المكتملة' : 'Hours Completed'}</label>
                <input type="number" class="form-input" id="sem-hours" min="0" max="138" value="${semesterHours}">
              </div>
              <button class="btn btn-primary" onclick="handleSemesterCalculate()" style="height: 42px; margin-bottom: 1px;">${currentLang === 'ar' ? 'احسب' : 'Calculate'}</button>
            </div>
          </div>

          <div id="semester-limit-alert" class="alert alert-info" style="margin-bottom: 16px;">
            <span class="alert-icon">📋</span>
            ${currentLang === 'ar'
              ? `بمعدلك التراكمي ${formatGPA(semesterCGPA)}، يمكنك التسجيل في ${effectiveLimit} مقررات كحد أقصى`
              : `Based on your CGPA of ${formatGPA(semesterCGPA)}, you can register up to ${effectiveLimit} subjects`}
            ${hasExtraSubjectApproval ? ` <span style="color: var(--accent-success);">(${currentLang === 'ar' ? '+1 بموافقة' : '+1 approved'})</span>` : ''}
          </div>

          <div style="margin-bottom: 16px;">
            <label class="course-retake-toggle" style="font-size: 0.9rem; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: inline-flex;">
              <input type="checkbox" ${hasExtraSubjectApproval ? 'checked' : ''} onchange="toggleExtraSubjectApproval(this.checked)">
              ${currentLang === 'ar' ? 'لدي موافقة مسبقة على إضافة مقرر إضافي' : 'I have an approved request to add an extra subject'}
            </label>
          </div>

          <div id="semester-courses">
            ${semesterCourses.map((c, i) => renderCourseRow(c, i, false)).join('')}
          </div>

          <div style="margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="add-course-btn" onclick="addSemesterCourse()" ${semesterCourses.length >= effectiveLimit ? 'disabled' : ''}>+ ${t('semester.addCourse')}</button>
            <span id="semester-limit-msg" style="color: var(--text-muted); font-size: 0.85rem; align-self: center;"></span>
          </div>

          <div style="margin-top: 24px;">
            <button class="btn btn-primary btn-lg" onclick="handleSaveSemester()">${t('semester.save')}</button>
          </div>
        </div>

        <div class="preview-panel" id="semester-preview"></div>
      </div>
    </section>
  `;

  updateSemesterPreview();
}

function handleSemesterCalculate() {
  const cgpaInput = document.getElementById('sem-cgpa');
  const hoursInput = document.getElementById('sem-hours');
  semesterCGPA = parseFloat(cgpaInput.value) || 0;
  semesterHours = parseInt(hoursInput.value) || 0;

  const baseLimit = getSubjectLimit(semesterCGPA);
  const effectiveLimit = hasExtraSubjectApproval ? baseLimit + 1 : baseLimit;

  const alertEl = document.getElementById('semester-limit-alert');
  if (alertEl) {
    alertEl.innerHTML = `
      <span class="alert-icon">📋</span>
      ${currentLang === 'ar'
        ? `بمعدلك التراكمي ${formatGPA(semesterCGPA)}، يمكنك التسجيل في ${effectiveLimit} مقررات كحد أقصى`
        : `Based on your CGPA of ${formatGPA(semesterCGPA)}, you can register up to ${effectiveLimit} subjects`}
      ${hasExtraSubjectApproval ? ` <span style="color: var(--accent-success);">(${currentLang === 'ar' ? '+1 بوية' : '+1 approved'})</span>` : ''}
    `;
  }

  const addBtn = document.getElementById('add-course-btn');
  const limitMsg = document.getElementById('semester-limit-msg');
  if (addBtn) {
    addBtn.disabled = semesterCourses.length >= effectiveLimit;
  }
  if (limitMsg) {
    limitMsg.textContent = semesterCourses.length >= effectiveLimit
      ? (currentLang === 'ar' ? `وصلت للحد الأقصى ${effectiveLimit} مقررات` : `Reached the limit of ${effectiveLimit} subjects`)
      : '';
  }

  renderSemesterCourses();
  updateSemesterPreview();
}

function toggleExtraSubjectApproval(checked) {
  hasExtraSubjectApproval = checked;
  renderSemesterCalculator(AppState);
}

function renderCourseRow(course, index, isPlanner) {
  const gradeOpts = getGradeOptions(course.isRetake);
  const isExtraCourse = !isPlanner && !hasExtraSubjectApproval && index >= getSubjectLimit(semesterCGPA);
  return `
    <div class="course-row ${course.isRetake ? 'retake' : ''}" data-index="${index}" ${isExtraCourse ? 'style="border: 1px dashed var(--accent-success); background: rgba(16, 185, 129, 0.05);"' : ''}>
      <div class="course-fields">
        <input type="text" class="form-input course-name-input" placeholder="${isPlanner ? t('planner.courseName') : t('semester.courseName')}"
          value="${course.name || ''}" onchange="updateCourse(${index}, 'name', this.value, ${isPlanner})">
        <select class="form-select course-credit-select" onchange="updateCourse(${index}, 'creditHours', parseInt(this.value), ${isPlanner})">
          ${CREDIT_HOUR_OPTIONS.map(h => `<option value="${h}" ${course.creditHours === h ? 'selected' : ''}>${h}h</option>`).join('')}
        </select>
        <select class="form-select course-grade-select" onchange="updateCourse(${index}, 'grade', this.value, ${isPlanner})"
          ${course.isRetake ? 'style="border-color: rgba(245, 158, 11, 0.5);"' : ''}>
          ${gradeOpts.map(g => `<option value="${g}" ${course.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
        <label class="course-retake-toggle">
          <input type="checkbox" ${course.isRetake ? 'checked' : ''} onchange="toggleRetake(${index}, this.checked, ${isPlanner})">
          ${isPlanner ? t('planner.retake') : t('semester.retake')}
        </label>
      </div>
      <button class="course-remove" onclick="removeCourse(${index}, ${isPlanner})" title="${isPlanner ? t('planner.removeCourse') : t('semester.removeCourse')}">✕</button>
    </div>
  `;
}

function updateCourse(index, field, value, isPlanner) {
  const courses = isPlanner ? AppState.planner.courses : semesterCourses;
  if (courses[index]) {
    courses[index][field] = value;
  }
  if (field === 'grade' && isPlanner) {
    courses[index].isLocked = true;
    recalculatePlanner();
  }
  if (!isPlanner) {
    renderSemesterCourses();
    updateSemesterPreview();
  }
}

function toggleRetake(index, checked, isPlanner) {
  const courses = isPlanner ? AppState.planner.courses : semesterCourses;
  if (courses[index]) {
    courses[index].isRetake = checked;
    if (checked && GRADE_MAP[courses[index].grade] > RETAKE_MAX_POINTS) {
      courses[index].grade = RETAKE_MAX_GRADE;
    }
  }
  if (isPlanner) {
    renderPlannerCourses();
    recalculatePlanner();
  } else {
    renderSemesterCourses();
    updateSemesterPreview();
  }
}

function removeCourse(index, isPlanner) {
  const courses = isPlanner ? AppState.planner.courses : semesterCourses;
  if (courses.length <= 1) return;
  courses.splice(index, 1);
  if (isPlanner) {
    renderPlannerCourses();
    recalculatePlanner();
  } else {
    renderSemesterCourses();
    updateSemesterPreview();
  }
}

function addSemesterCourse() {
  const baseLimit = getSubjectLimit(semesterCGPA);
  const effectiveLimit = hasExtraSubjectApproval ? baseLimit + 1 : baseLimit;
  if (semesterCourses.length >= effectiveLimit) return;
  semesterCourses.push({ name: '', creditHours: DEFAULT_CREDIT_HOURS, grade: 'A+', isRetake: false });
  renderSemesterCourses();
  updateSemesterPreview();
}

function renderSemesterCourses() {
  const el = document.getElementById('semester-courses');
  if (el) {
    el.innerHTML = semesterCourses.map((c, i) => renderCourseRow(c, i, false)).join('');
  }
  const addBtn = document.getElementById('add-course-btn');
  const limitMsg = document.getElementById('semester-limit-msg');
  const baseLimit = getSubjectLimit(semesterCGPA);
  const effectiveLimit = hasExtraSubjectApproval ? baseLimit + 1 : baseLimit;
  if (addBtn) {
    addBtn.disabled = semesterCourses.length >= effectiveLimit;
  }
  if (limitMsg) {
    limitMsg.textContent = semesterCourses.length >= effectiveLimit
      ? (currentLang === 'ar' ? `وصلت للحد الأقصى ${effectiveLimit} مقررات` : `Reached the limit of ${effectiveLimit} subjects`)
      : '';
  }
}

function updateSemesterPreview() {
  const el = document.getElementById('semester-preview');
  if (!el) return;

  const result = calculateSemesterGPA(semesterCourses);
  const gpaCountedHours = semesterHours;
  const projectedCGPA = calculateCGPA(semesterCGPA, gpaCountedHours, result.gpa, result.gpaCountedHours);
  const remaining = getRemainingHours(semesterHours + result.totalHours);
  const wouldWarn = result.gpa < WARNING_GPA_THRESHOLD && result.gpaCountedHours > 0;

  const gpaDiff = projectedCGPA - semesterCGPA;
  const arrow = gpaDiff > 0.005 ? '↑' : gpaDiff < -0.005 ? '↓' : '';
  const diffColor = gpaDiff > 0.005 ? 'var(--accent-success)' : gpaDiff < -0.005 ? 'var(--accent-danger)' : 'var(--text-muted)';

  el.innerHTML = `
    <div class="preview-label">${t('semester.preview.semesterGpa')}</div>
    <div class="preview-gpa" style="color: ${getGPAColor(result.gpa)}">${formatGPA(result.gpa)}</div>

    <div class="preview-stat">
      <span class="label">${t('semester.preview.projectedCgpa')}</span>
      <span class="value" style="color: ${getGPAColor(projectedCGPA)}">${formatGPA(projectedCGPA)}</span>
    </div>
    <div class="preview-stat">
      <span class="label">${t('semester.preview.cgpaChange')}</span>
      <span class="value" style="color: ${diffColor}">${arrow} ${Math.abs(gpaDiff).toFixed(2)}</span>
    </div>
    <div class="preview-stat">
      <span class="label">${t('semester.preview.totalHours')}</span>
      <span class="value">${result.totalHours}h</span>
    </div>
    <div class="preview-stat">
      <span class="label">${t('semester.preview.remainingHours')}</span>
      <span class="value">${remaining}h</span>
    </div>

    ${wouldWarn ? `<div class="alert alert-danger" style="margin-top: 16px; font-size: 0.85rem;">
      <span class="alert-icon">⚠️</span>
      ${t('semester.preview.warningAlert', { next: 4, max: MAX_WARNINGS })}
    </div>` : ''}
  `;
}

function handleSaveSemester() {
  if (semesterCourses.length === 0) {
    showToast(t('semester.validation.noCourses'), 'warning');
    return;
  }

  const name = prompt('Semester name (optional):', `Semester ${AppState.semesters.length + 1}`);
  if (name === null) return;

  const result = addSemester(AppState, { name: name || `Semester ${AppState.semesters.length + 1}`, courses: [...semesterCourses] });

  if (result.triggeredWarning) {
    showToast(`⚠️ Warning ${AppState.student.warnings} of ${MAX_WARNINGS}`, 'danger');
  } else {
    showToast('Semester saved! ✓', 'success');
  }

  semesterCourses = [];
  navigateTo('dashboard');
}

let plannerCourses = [];
let plannerCGPA = null;
let plannerHours = null;

function renderPlanner(state) {
  const s = state.student;
  if (plannerCGPA === null) plannerCGPA = s.currentCGPA;
  if (plannerHours === null) plannerHours = s.totalHoursCompleted - s.nonGPAHours;

  const container = document.getElementById('app');
  container.innerHTML = `
    <section class="view active" id="planner">
      <h2 class="section-title">${t('planner.title')}</h2>
      <p class="section-subtitle">${t('planner.subtitle')}</p>

      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--text-secondary);">${currentLang === 'ar' ? 'معلوماتك الحالية' : 'Your Current Info'}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">${currentLang === 'ar' ? 'المعدل التراكمي الحالي' : 'Current CGPA'}</label>
            <input type="number" class="form-input" id="plan-cgpa" min="0" max="4" step="0.01" value="${plannerCGPA}"
              oninput="handlePlannerCGPAChange(this.value)">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">${currentLang === 'ar' ? 'الساعات المحسوبة في المعدل' : 'GPA-Counted Hours'}</label>
            <input type="number" class="form-input" id="plan-hours" min="0" max="138" value="${plannerHours}"
              oninput="handlePlannerHoursChange(this.value)">
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <div class="form-group">
          <label class="form-label">${t('planner.targetCgpa')}</label>
          <input type="number" class="form-input" id="planner-target" min="0" max="4" step="0.01"
            placeholder="${t('planner.targetCgpaPlaceholder')}" value="${state.planner.targetCGPA || ''}"
            oninput="handlePlannerTargetChange()">
        </div>
        <div style="margin-bottom: 12px;">
          <label class="form-label" style="margin-bottom: 8px;">${t('planner.inputMode')}</label>
          <div class="flex-row" style="gap: 16px;">
            <label class="course-retake-toggle" style="font-size: 0.9rem;">
              <input type="radio" name="planner-mode" value="individual" ${state.planner.inputMode === 'individual' ? 'checked' : ''} onchange="handlePlannerModeChange('individual')">
              ${t('planner.modeIndividual')}
            </label>
            <label class="course-retake-toggle" style="font-size: 0.9rem;">
              <input type="radio" name="planner-mode" value="hours" ${state.planner.inputMode === 'hours' ? 'checked' : ''} onchange="handlePlannerModeChange('hours')">
              ${t('planner.modeHours')}
            </label>
          </div>
        </div>
        ${state.planner.inputMode === 'hours' ? `
          <div class="flex-row" style="gap: 12px;">
            <input type="number" class="form-input" id="planner-hours-input" min="1" placeholder="${t('planner.remainingHoursPlaceholder')}" style="max-width: 200px;">
            <button class="btn btn-secondary btn-sm" onclick="handleGenerateCourses()">${t('planner.generateCourses')}</button>
          </div>
        ` : ''}
      </div>

      <div id="planner-req-avg" style="margin-bottom: 16px;"></div>

      <div style="display: grid; grid-template-columns: 1fr 320px; gap: 24px;">
        <div>
          <div id="planner-courses"></div>
          <button class="btn btn-secondary" onclick="addPlannerCourse()" style="margin-top: 12px;">+ ${t('planner.addCourse')}</button>
        </div>
        <div class="preview-panel" id="planner-preview"></div>
      </div>
    </section>
  `;

  renderPlannerCourses();
  recalculatePlanner();
}

function handlePlannerTargetChange() {
  const val = parseFloat(document.getElementById('planner-target').value);
  AppState.planner.targetCGPA = isNaN(val) ? null : val;
  savePlannerState(AppState, { targetCGPA: AppState.planner.targetCGPA });
  recalculatePlanner();
}

function handlePlannerCGPAChange(val) {
  plannerCGPA = parseFloat(val) || 0;
  recalculatePlanner();
}

function handlePlannerHoursChange(val) {
  plannerHours = parseInt(val) || 0;
  recalculatePlanner();
}

function handlePlannerModeChange(mode) {
  AppState.planner.inputMode = mode;
  savePlannerState(AppState, { inputMode: mode });
  renderPlanner(AppState);
}

function handleGenerateCourses() {
  const hours = parseInt(document.getElementById('planner-hours-input').value);
  if (isNaN(hours) || hours <= 0) return;
  plannerCourses = createCoursesFromHours(hours);
  AppState.planner.courses = plannerCourses;
  savePlannerState(AppState, { courses: plannerCourses });
  renderPlannerCourses();
  recalculatePlanner();
}

function addPlannerCourse() {
  plannerCourses.push({ name: '', creditHours: DEFAULT_CREDIT_HOURS, grade: 'A+', isRetake: false, isLocked: false });
  AppState.planner.courses = plannerCourses;
  savePlannerState(AppState, { courses: plannerCourses });
  renderPlannerCourses();
  recalculatePlanner();
}

function renderPlannerCourses() {
  const el = document.getElementById('planner-courses');
  if (!el) return;

  el.innerHTML = plannerCourses.map((c, i) => `
    <div class="course-row ${c.isRetake ? 'retake' : ''}" data-index="${i}">
      <div class="course-fields">
        <input type="text" class="form-input course-name-input" placeholder="${t('planner.courseName')}"
          value="${c.name || ''}" oninput="updateCourse(${i}, 'name', this.value, true)">
        <select class="form-select course-credit-select" onchange="updateCourse(${i}, 'creditHours', parseInt(this.value), true)">
          ${CREDIT_HOUR_OPTIONS.map(h => `<option value="${h}" ${c.creditHours === h ? 'selected' : ''}>${h}h</option>`).join('')}
        </select>
        <select class="form-select course-grade-select" onchange="handlePlannerGradeChange(${i}, this.value)"
          ${c.isRetake ? 'style="border-color: rgba(245, 158, 11, 0.5);"' : ''}>
          ${getGradeOptions(c.isRetake).map(g => `<option value="${g}" ${c.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
        <label class="course-retake-toggle">
          <input type="checkbox" ${c.isRetake ? 'checked' : ''} onchange="toggleRetake(${i}, this.checked, true)">
          ${t('planner.retake')}
        </label>
      </div>
      <button class="course-lock-toggle ${c.isLocked ? 'locked' : ''}" onclick="toggleLock(${i})" title="${c.isLocked ? t('planner.locked') : t('planner.unlocked')}">
        ${c.isLocked ? '🔒' : '🔓'}
      </button>
      <button class="course-remove" onclick="removeCourse(${i}, true)" title="${t('planner.removeCourse')}">✕</button>
    </div>
  `).join('');
}

function handlePlannerGradeChange(index, value) {
  plannerCourses[index].grade = value;
  plannerCourses[index].points = GRADE_MAP[value];
  plannerCourses[index].isLocked = true;
  AppState.planner.courses = plannerCourses;
  savePlannerState(AppState, { courses: plannerCourses });
  recalculatePlanner();
}

function toggleLock(index) {
  plannerCourses[index].isLocked = !plannerCourses[index].isLocked;
  AppState.planner.courses = plannerCourses;
  savePlannerState(AppState, { courses: plannerCourses });
  renderPlannerCourses();
  recalculatePlanner();
}

function recalculatePlanner() {
  const target = AppState.planner.targetCGPA;
  const gpaCounted = plannerHours;

  if (target === null || plannerCourses.length === 0) {
    const reqEl = document.getElementById('planner-req-avg');
    if (reqEl) reqEl.innerHTML = '';
    updatePlannerPreview(null);
    return;
  }

  const result = distributeGrades(plannerCourses, target, plannerCGPA, gpaCounted);

  for (let i = 0; i < result.gradedCourses.length; i++) {
    const gc = result.gradedCourses[i];
    if (plannerCourses[i] && !plannerCourses[i].isLocked) {
      plannerCourses[i].grade = gc.grade;
      plannerCourses[i].points = gc.points;
    }
  }

  const totalPlannedHours = plannerCourses.reduce((sum, c) => sum + (c.creditHours || 0), 0);
  const required = calculateRequiredAverage(plannerCGPA, gpaCounted, target, totalPlannedHours);

  const reqEl = document.getElementById('planner-req-avg');
  if (reqEl) {
    if (result.feasibility === 'impossible') {
      reqEl.innerHTML = `
        <div class="alert alert-danger">
          <span class="alert-icon">❌</span>
          ${t('planner.impossible')}<br>
          <small>${t('planner.bestPossible', { gpa: formatGPA(result.projectedCGPA) })}</small>
        </div>
      `;
    } else {
      reqEl.innerHTML = `
        <div class="alert ${result.feasibility === 'tight' ? 'alert-warning' : 'alert-success'}">
          <span class="alert-icon">${result.feasibility === 'tight' ? '⚠️' : '✅'}</span>
          ${t('planner.requiredAverage', { avg: formatGPA(required.requiredAverage) })}
        </div>
      `;
    }
  }

  renderPlannerCourses();
  updatePlannerPreview(result);
}

function updatePlannerPreview(result) {
  const el = document.getElementById('planner-preview');
  if (!el) return;

  const target = AppState.planner.targetCGPA;
  const totalPlannedHours = plannerCourses.reduce((sum, c) => sum + (c.creditHours || 0), 0);
  const lockedCount = plannerCourses.filter(c => c.isLocked).length;
  const remaining = getRemainingHours(plannerHours + totalPlannedHours);

  const projectedGPA = result ? result.projectedCGPA : null;

  el.innerHTML = `
    <div class="preview-label">${t('planner.preview.targetVsProjected')}</div>
    <div style="text-align: center; margin: 12px 0;">
      <div style="font-size: 0.8rem; color: var(--text-muted);">${t('planner.targetCgpa')}</div>
      <div style="font-size: 1.4rem; font-weight: 700; color: ${target ? getGPAColor(target) : 'var(--text-muted)'};">${target ? formatGPA(target) : '—'}</div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">Projected</div>
      <div style="font-size: 1.4rem; font-weight: 700; color: ${projectedGPA !== null ? getGPAColor(projectedGPA) : 'var(--text-muted)'};">${projectedGPA !== null ? formatGPA(projectedGPA) : '—'}</div>
    </div>

    <div class="preview-stat">
      <span class="label">${t('planner.preview.feasibility')}</span>
      <span class="value">
        ${result ? `<span class="badge badge-${result.feasibility === 'achievable' ? 'success' : result.feasibility === 'tight' ? 'warning' : 'danger'}">${t('planner.preview.' + result.feasibility)}</span>` : '—'}
      </span>
    </div>
    <div class="preview-stat">
      <span class="label">${t('planner.preview.lockedCourses')}</span>
      <span class="value">${lockedCount}</span>
    </div>
    <div class="preview-stat">
      <span class="label">${t('planner.preview.systemManaged')}</span>
      <span class="value">${plannerCourses.length - lockedCount}</span>
    </div>
    <div class="preview-stat">
      <span class="label">${t('planner.preview.totalPlannedHours')}</span>
      <span class="value">${totalPlannedHours}h</span>
    </div>
    <div class="preview-stat">
      <span class="label">${t('planner.preview.remainingAfterPlan')}</span>
      <span class="value">${remaining}h</span>
    </div>
  `;
}

function renderGuide() {
  const container = document.getElementById('app');
  const p = translations[currentLang].guide.panels;

  container.innerHTML = `
    <section class="view active" id="guide">
      <h2 class="section-title">${t('guide.title')}</h2>
      <p class="section-subtitle">${t('guide.subtitle')}</p>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.fvsfl}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 12px;">${p.fvsflContent.intro}</p>
          <ol style="margin-bottom: 12px; padding-left: 20px;">
            <li>${p.fvsflContent.condition1}</li>
            <li>${p.fvsflContent.condition2}</li>
          </ol>
          <p style="font-weight: 600; margin-bottom: 8px;">${p.fvsflContent.quickRule}</p>
          <ul style="margin-bottom: 16px; padding-left: 20px; list-style: none;">
            <li style="margin-bottom: 4px;">❌ ${p.fvsflContent.ruleF}</li>
            <li style="margin-bottom: 4px;">❌ ${p.fvsflContent.ruleFL}</li>
            <li>✅ ${p.fvsflContent.rulePass}</li>
          </ul>
          <p style="color: var(--accent-warning); font-size: 0.9rem;">⚠️ ${p.fvsflContent.note}</p>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.gradingScale}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 12px;">${p.gradingScaleContent}</p>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <th style="padding: 8px; text-align: left;">${t('scale.points')}</th>
                  <th style="padding: 8px; text-align: left;">${t('scale.grade')}</th>
                  <th style="padding: 8px; text-align: left;">${t('scale.percentage')}</th>
                </tr>
              </thead>
              <tbody>
                ${[
                  ['4.0', 'A+', '96%+'], ['3.7', 'A', '92% – <96%'], ['3.4', 'A-', '88% – <92%'],
                  ['3.2', 'B+', '84% – <88%'], ['3.0', 'B', '80% – <84%'], ['2.8', 'B-', '76% – <80%'],
                  ['2.6', 'C+', '72% – <76%'], ['2.4', 'C', '68% – <72%'], ['2.2', 'C-', '64% – <68%'],
                  ['2.0', 'D+', '60% – <64%'], ['1.5', 'D', '55% – <60%'], ['1.0', 'D-', '50% – <55%'],
                  ['0.0', 'F', '<50%'], ['0.0', 'FL', '≥50% but exam <12/40'], ['0.0', 'ABS', 'Absent']
                ].map(([pts, g, pct]) => `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px;">${pts}</td>
                    <td style="padding: 8px;"><span class="grade-badge ${getGradeBadgeClass(g)}">${g}</span></td>
                    <td style="padding: 8px; color: var(--text-muted);">${pct}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.howGpa}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 8px; font-weight: 600;">${t('scale.points')}:</p>
          <p style="margin-bottom: 4px; font-family: monospace; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">${p.howGpaContent.semesterFormula}</p>
          <p style="margin-bottom: 4px; font-family: monospace; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">${p.howGpaContent.cgpaFormula}</p>
          <p style="margin-top: 12px; color: var(--text-muted); font-size: 0.9rem;">${p.howGpaContent.note}</p>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.creditHours}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 8px;">${p.creditHoursContent.total}</p>
          <p style="margin-bottom: 8px; font-weight: 600;">${p.creditHoursContent.levels}:</p>
          <ul style="padding-left: 20px;">
            <li>${p.creditHoursContent.level1}</li>
            <li>${p.creditHoursContent.level2}</li>
            <li>${p.creditHoursContent.level3}</li>
            <li>${p.creditHoursContent.level4}</li>
          </ul>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.trackSelection}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p>${p.trackSelectionContent}</p>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.subjectLimits}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 8px;">${p.subjectLimitsContent.intro}</p>
          <ul style="padding-left: 20px; margin-bottom: 8px;">
            <li>${p.subjectLimitsContent.limit1}</li>
            <li>${p.subjectLimitsContent.limit2}</li>
            <li>${p.subjectLimitsContent.limit3}</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${p.subjectLimitsContent.note}</p>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.warnings}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 8px;">${p.warningsContent.rule}</p>
          <p style="margin-bottom: 8px;">${p.warningsContent.max}</p>
          <p style="color: var(--text-muted);">${p.warningsContent.tracking}</p>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.retakeRule}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 8px;">${p.retakeContent.rule}</p>
          <p style="color: var(--text-muted);">${p.retakeContent.enforced}</p>
        </div>
      </div>

      <div class="accordion" onclick="toggleAccordion(this)">
        <button class="accordion-header">
          <span>${p.gradeDefinitions}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          <p style="margin-bottom: 12px;">${p.gradeDefinitionsContent.intro}</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color);">
                <th style="padding: 8px; text-align: left; width: 60px;">${t('scale.grade')}</th>
                <th style="padding: 8px; text-align: left;">${t('scale.meaning')}</th>
              </tr>
            </thead>
            <tbody>
              ${p.gradeDefinitionsContent.grades.map(g => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 8px;"><span class="grade-badge ${getGradeBadgeClass(g.code)}">${g.code}</span></td>
                  <td style="padding: 8px; color: var(--text-secondary);">${g.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function toggleAccordion(el) {
  if (event.target.closest('.accordion-body')) return;
  el.classList.toggle('open');
}

function renderGPAScale() {
  const container = document.getElementById('app');
  container.innerHTML = `
    <section class="view active" id="scale">
      <h2 class="section-title">${t('scale.title')}</h2>
      <p class="section-subtitle">${t('scale.subtitle')}</p>

      <div class="card" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border-color);">
              <th style="padding: 12px; text-align: left;">${t('scale.points')}</th>
              <th style="padding: 12px; text-align: left;">${t('scale.grade')}</th>
              <th style="padding: 12px; text-align: left;">${t('scale.percentage')}</th>
            </tr>
          </thead>
          <tbody>
            ${[
              ['4.0', 'A+', '96% and above'], ['3.7', 'A', '92% – less than 96%'], ['3.4', 'A-', '88% – less than 92%'],
              ['3.2', 'B+', '84% – less than 88%'], ['3.0', 'B', '80% – less than 84%'], ['2.8', 'B-', '76% – less than 80%'],
              ['2.6', 'C+', '72% – less than 76%'], ['2.4', 'C', '68% – less than 72%'], ['2.2', 'C-', '64% – less than 68%'],
              ['2.0', 'D+', '60% – less than 64%'], ['1.5', 'D', '55% – less than 60%'], ['1.0', 'D-', '50% – less than 55%'],
              ['0.0', 'F', 'Total less than 50%'], ['0.0', 'FL', 'Total ≥ 50% but final exam < 12/40'], ['0.0', 'ABS', 'Absent from final exam']
            ].map(([pts, g, pct]) => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px; font-weight: 600;">${pts}</td>
                <td style="padding: 10px;"><span class="grade-badge ${getGradeBadgeClass(g)}">${g}</span></td>
                <td style="padding: 10px; color: var(--text-secondary);">${pct}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h3 style="margin: 24px 0 12px;">${t('scale.specialGrades')}</h3>
      <div class="card">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border-color);">
              <th style="padding: 12px; text-align: left;">${t('scale.code')}</th>
              <th style="padding: 12px; text-align: left;">${t('scale.meaning')}</th>
            </tr>
          </thead>
          <tbody>
            ${[
              ['CON', currentLang === 'ar' ? 'المقرر مستمر في الفصل القادم' : 'Course continued next semester'],
              ['I', currentLang === 'ar' ? 'غير مكتمل' : 'Incomplete'],
              ['W', currentLang === 'ar' ? 'انسحاب' : 'Withdrawal']
            ].map(([code, meaning]) => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px;"><span class="grade-badge grade-con">${code}</span></td>
                <td style="padding: 10px; color: var(--text-secondary);">${meaning}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
