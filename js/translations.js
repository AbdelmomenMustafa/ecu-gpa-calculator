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
      cta: "Get Started",
      feature1Title: "Track Progress",
      feature1Desc: "Monitor your CGPA and academic level throughout your journey",
      feature2Title: "Plan Ahead",
      feature2Desc: "Use the Target GPA Planner to set goals and stay on track",
      feature3Title: "Learn Rules",
      feature3Desc: "Understand grading, warnings, retakes, and all academic policies"
    },
    setup: {
      title: "Student Profile Setup",
      subtitle: "Enter your current academic information to get started",
      totalHours: "Total Credit Hours Completed",
      totalHoursHint: "From 0 to 138 required for graduation",
      nonGpaHours: "Non-GPA Credit Hours",
      nonGpaHoursHint: "Hours from courses that don't count toward CGPA (e.g., Chinese Language)",
      currentCGPA: "Current CGPA",
      currentCGPAHint: "From 0.00 to 4.00",
      warnings: "Academic Warnings Received",
      warningsHint: "Maximum 4 warnings allowed (0-4)",
      save: "Save & Continue",
      validation: {
        nonGpaExceeds: "Non-GPA hours cannot exceed total hours",
        invalidCGPA: "CGPA must be between 0.00 and 4.00",
        invalidHours: "Total hours must be between 0 and 138"
      }
    },
    dashboard: {
      title: "Dashboard",
      cgpa: "Current CGPA",
      completed: "Completed Hours",
      remaining: "Remaining Hours",
      level: "Academic Level",
      trackEligible: "You are eligible to choose a specialization track",
      trackNotEligible: "You need {hours} more hours to choose your track",
      warningCount: "Academic Warning {current} of {max}",
      warningCritical: "CRITICAL: You have used all 4 warnings. Next failure to achieve 2.0 TGPA may result in dismissal.",
      subjectLimit: "You can take up to {limit} subjects per semester",
      semesterHistory: "Semester History",
      noSemesters: "No semesters saved yet. Add your first semester to start tracking!",
      addSemester: "Add Semester",
      planGPA: "Plan Target GPA",
      editProfile: "Edit Profile",
      resetData: "Reset Data",
      resetConfirm: "Are you sure you want to reset all data? This cannot be undone.",
      courses: "courses",
      hours: "hours",
      semesterGpa: "Semester GPA",
      triggeredWarning: "This semester triggered a warning",
      deleteSemester: "Delete",
      deleteConfirm: "Delete this semester? This cannot be undone.",
      quickActions: "Quick Actions"
    },
    semester: {
      title: "Semester Calculator",
      subtitle: "Add your courses for this semester",
      subjectLimitNotice: "Your CGPA allows up to {limit} subjects per semester",
      subjectLimitWarning: "Your CGPA is below {threshold} — you can take up to {limit} subjects. You may request more from administration.",
      subjectLimitBlocked: "You've reached the maximum of {limit} subjects for your CGPA level.",
      addCourse: "Add Course",
      courseName: "Course name (optional)",
      creditHours: "Credit Hours",
      grade: "Grade",
      retake: "Retake (F/FL)",
      retakeHint: "Maximum grade on retake: B+ (3.2)",
      removeCourse: "Remove",
      overrideNote: "Need more subjects? You can request this from administration.",
      save: "Save Semester",
      preview: {
        semesterGpa: "Semester GPA",
        projectedCgpa: "Projected CGPA",
        cgpaChange: "CGPA Change",
        noChange: "No change",
        totalHours: "Total Semester Hours",
        remainingHours: "Updated Remaining Hours",
        academicLevel: "Updated Academic Level",
        warningAlert: "This semester GPA would trigger an academic warning (Warning {next} of {max})"
      },
      validation: {
        noCourses: "Add at least one course to save",
        excludeGrades: "Courses with CON, I, or W grades are excluded from GPA calculation"
      }
    },
    planner: {
      title: "Target GPA Planner",
      subtitle: "Plan the grades you need to reach your target CGPA",
      currentCgpa: "Current CGPA",
      gpaHours: "GPA-Counted Hours",
      targetCgpa: "Target CGPA",
      targetCgpaPlaceholder: "Enter target CGPA (0.00-4.00)",
      inputMode: "How would you like to plan?",
      modeIndividual: "Add courses individually",
      modeHours: "Enter remaining hours",
      remainingHoursLabel: "Total Remaining Hours",
      remainingHoursPlaceholder: "e.g., 15",
      generateCourses: "Generate Courses",
      requiredAverage: "You need an average GPA of {avg}",
      impossible: "Impossible — would require above 4.0",
      bestPossible: "Best possible CGPA with current locked grades: {gpa}",
      addCourse: "Add Course",
      courseName: "Course name (optional)",
      creditHours: "Credit Hours",
      grade: "Grade",
      retake: "Retake (F/FL)",
      removeCourse: "Remove",
      locked: "Locked",
      unlocked: "System-managed",
      preview: {
        targetVsProjected: "Target vs Projected",
        feasibility: "Feasibility",
        achievable: "Achievable",
        tight: "Tight",
        impossible: "Impossible",
        lockedCourses: "Locked courses",
        systemManaged: "System-managed",
        totalPlannedHours: "Total planned hours",
        remainingAfterPlan: "Remaining after plan"
      }
    },
    guide: {
      title: "Student Guide",
      subtitle: "Learn about ECU's academic rules and grading system",
      panels: {
        fvsfl: "Understanding F vs FL Grades",
        fvsflContent: {
          intro: "The final grade in a course is out of 100 points (Coursework + Final Exam out of 40). To pass, the student must meet BOTH conditions:",
          condition1: "Score at least 50 points total (coursework + final exam)",
          condition2: "Score at least 12 points out of 40 on the final exam paper",
          quickRule: "Quick Rule:",
          ruleF: "Total < 50 → F (Failed)",
          ruleFL: "Total ≥ 50, but Final Exam < 12/40 → FL (Failed — didn't meet exam minimum)",
          rulePass: "Total ≥ 50, and Final Exam ≥ 12/40 → Pass (grade based on total percentage)",
          fExamples: "F Examples",
          flExamples: "FL Examples",
          passExamples: "Pass Examples",
          note: "Both F and FL carry 0 points and both trigger the retake cap rule (max B+ on retake)."
        },
        gradingScale: "GPA Grading Scale",
        gradingScaleContent: "The grading scale at ECU ranges from A+ (4.0 points) to F (0.0 points). Special grades like CON, I, and W are excluded from GPA calculation.",
        howGpa: "How GPA is Calculated",
        howGpaContent: {
          semesterFormula: "Semester GPA = Σ (grade_points × credit_hours) / Σ (credit_hours)",
          cgpaFormula: "CGPA = Σ (all_grade_points × credit_hours) / Σ (all_counted_credit_hours)",
          note: "Only courses with numeric point grades are included. CON, I, W are completely excluded. 0-credit-hour courses don't affect the calculation."
        },
        creditHours: "Credit Hours & Academic Levels",
        creditHoursContent: {
          total: "Total required: 138 credit hours to graduate",
          levels: "Academic Levels based on completed credit hours",
          level1: "1st Level: 0–27 hours",
          level2: "2nd Level: 28–61 hours",
          level3: "3rd Level: 62–95 hours",
          level4: "4th Level: 96–138 hours"
        },
        trackSelection: "Track Selection Requirement",
        trackSelectionContent: "Students need to complete 75 credit hours to be eligible to choose a specialization track. Check your eligibility on the dashboard.",
        subjectLimits: "Subject Limits Per Semester",
        subjectLimitsContent: {
          intro: "The maximum number of subjects you can take per semester depends on your CGPA:",
          limit1: "CGPA below 1.0: Maximum 4 subjects",
          limit2: "CGPA 1.0 to less than 1.8: Maximum 5 subjects",
          limit3: "CGPA 1.8 and above: Maximum 6 subjects (normal)",
          note: "Students can request to take more subjects from administration."
        },
        warnings: "Academic Warnings",
        warningsContent: {
          rule: "If a student fails to achieve 2.0 in their semester GPA (TGPA), they receive an academic warning.",
          max: "ECU allows a maximum of 4 warnings. After the 4th warning, the student is dismissed from the university.",
          tracking: "The app tracks your warnings and displays them on the dashboard."
        },
        retakeRule: "Retake Rule",
        retakeContent: {
          rule: "If a student previously received F or FL in a course and is retaking it, the maximum grade they can achieve is B+ (3.2).",
          enforced: "This rule is enforced in both the calculator and the planner."
        }
      }
    },
    scale: {
      title: "GPA Grading Scale",
      subtitle: "Complete reference for ECU's grading system",
      points: "Points",
      grade: "Grade",
      percentage: "Percentage Range",
      specialGrades: "Special Grades (Excluded from GPA)",
      code: "Code",
      meaning: "Meaning"
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      confirm: "Confirm",
      loading: "Loading...",
      noData: "No data available"
    }
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
      cta: "ابدأ الآن",
      feature1Title: "تتبع التقدم",
      feature1Desc: "راقب معدلك التراكمي ومستواك الأكاديمى طوال رحلتك",
      feature2Title: "خطط مسبقاً",
      feature2Desc: "استخدم مخطط المعدل المستهدف لوضع أهداف والبقاء على المسار",
      feature3Title: "تعلم القواعد",
      feature3Desc: "افهم التقديرات والتحذيرات إعادة الامتحان وجميع السياسات الأكاديمية"
    },
    setup: {
      title: "إعداد الملف الشخصي للطالب",
      subtitle: "أدخل معلوماتك الأكاديمية الحالية للبدء",
      totalHours: "إجمالي الساعات المعتمدة المكتملة",
      totalHoursHint: "من 0 إلى 138 ساعة مطلوبة للتخرج",
      nonGpaHours: "ساعات معتمدة غير محسوبة في المعدل",
      nonGpaHoursHint: "ساعات من مقررات لا تُحسب في المعدل التراكمى (مثل اللغة الصينية)",
      currentCGPA: "المعدل التراكمي الحالي",
      currentCGPAHint: "من 0.00 إلى 4.00",
      warnings: "التحذيرات الأكاديمية المستلمة",
      warningsHint: "الحد الأقصى 4 تحذيرات (0-4)",
      save: "حفظ ومتابعة",
      validation: {
        nonGpaExceeds: "الساعات غير المحسوبة لا يمكن أن تتجاوز إجمالي الساعات",
        invalidCGPA: "يجب أن يكون المعدل بين 0.00 و 4.00",
        invalidHours: "يجب أن تكون الساعات بين 0 و 138"
      }
    },
    dashboard: {
      title: "لوحة المعلومات",
      cgpa: "المعدل التراكمي الحالي",
      completed: "الساعات المكتملة",
      remaining: "الساعات المتبقية",
      level: "المستوى الأكاديمي",
      trackEligible: "أنت مؤهل لاختيار تخصص",
      trackNotEligible: "تحتاج {hours} ساعات إضافية لاختيار تخصصك",
      warningCount: "تحذير أكاديمي {current} من {max}",
      warningCritical: "حرج: لقد استنفدت جميع التحذيرات الأربعة. الفشل التالي في تحقيق 2.0 قد يؤدي إلى الفصل.",
      subjectLimit: "يمكنك أخذ حتى {limit} مقررات في كل فصل",
      semesterHistory: "سجل الفصول الدراسية",
      noSemesters: "لم يتم حفظ أي فصول بعد. أضف فصلك الأول للبدء!",
      addSemester: "إضافة فصل",
      planGPA: "خطط المعدل المستهدف",
      editProfile: "تعديل الملف",
      resetData: "إعادة تعيين البيانات",
      resetConfirm: "هل أنت متأكد من إعادة تعيين جميع البيانات؟ لا يمكن التراجع.",
      courses: "مقررات",
      hours: "ساعات",
      semesterGpa: "معدل الفصل",
      triggeredWarning: "هذا الفصل أحدث تحذيراً",
      deleteSemester: "حذف",
      deleteConfirm: "حذف هذا الفصل؟ لا يمكن التراجع.",
      quickActions: "إجراءات سريعة"
    },
    semester: {
      title: "حاسبة الفصل الدراسي",
      subtitle: "أضف مقرراتك لهذا الفصل",
      subjectLimitNotice: "معدلك يسمح بحد أقصى {limit} مقررات في كل فصل",
      subjectLimitWarning: "معدلك أقل من {threshold} — يمكنك أخذ {limit} مقررات فقط. يمكنك طلب المزيد من الإدارة.",
      subjectLimitBlocked: "لقد وصلت للحد الأقصى من {limit} مقررات لمعدلك.",
      addCourse: "إضافة مقرر",
      courseName: "اسم المقرر (اختياري)",
      creditHours: "الساعات المعتمدة",
      grade: "التقدير",
      retake: "إعادة امتحان (F/FL)",
      retakeHint: "أقصى تقدير عند إعادة الامتحان: B+ (3.2)",
      removeCourse: "إزالة",
      overrideNote: "تحتاج مقررات أكثر؟ يمكنك طلب ذلك من الإدارة.",
      save: "حفظ الفصل",
      preview: {
        semesterGpa: "معدل الفصل",
        projectedCgpa: "المعدل المتوقع",
        cgpaChange: "التغيير في المعدل",
        noChange: "بدون تغيير",
        totalHours: "إجمالي ساعات الفصل",
        remainingHours: "الساعات المتبقية المحدثة",
        academicLevel: "المستوى الأكاديمي المحدث",
        warningAlert: "معدل هذا الفصل سيسبب تحذيراً أكاديمياً (تحذير {next} من {max})"
      },
      validation: {
        noCourses: "أضف مقرراً واحداً على الأقل للحفظ",
        excludeGrades: "المقررات بتقديرات CON أو I أو W غير محسوبة في المعدل"
      }
    },
    planner: {
      title: "مخطط المعدل المستهدف",
      subtitle: "خطط للتقديرات التي تحتاجها لتحقيق معدلك المستهدف",
      currentCgpa: "المعدل التراكمي الحالي",
      gpaHours: "الساعات المحسوبة في المعدل",
      targetCgpa: "المعدل المستهدف",
      targetCgpaPlaceholder: "أدخل المعدل المستهدف (0.00-4.00)",
      inputMode: "كيف تريد التخطيط؟",
      modeIndividual: "إضافة المقررات واحداً تلو الآخر",
      modeHours: "إدخال إجمالي الساعات المتبقية",
      remainingHoursLabel: "إجمالي الساعات المتبقية",
      remainingHoursPlaceholder: "مثال: 15",
      generateCourses: "إنشاء المقررات",
      requiredAverage: "تحتاج معدلاً متوسطياً قدره {avg}",
      impossible: "مستحيل — يتطلب أكثر من 4.0",
      bestPossible: "أفضل معدل ممكن مع التقديرات المقفلة الحالية: {gpa}",
      addCourse: "إضافة مقرر",
      courseName: "اسم المقرر (اختياري)",
      creditHours: "الساعات المعتمدة",
      grade: "التقدير",
      retake: "إعادة امتحان (F/FL)",
      removeCourse: "изация",
      locked: "مقفل",
      unlocked: "يتحكم بها النظام",
      preview: {
        targetVsProjected: "المستهدف مقابل المتوقع",
        feasibility: "الجدوى",
        achievable: "ممكن",
        tight: "صعب",
        impossible: "مستحيل",
        lockedCourses: "مقررات مقفلة",
        systemManaged: "يتحكم بها النظام",
        totalPlannedHours: "إجمالي ساعات المخطط",
        remainingAfterPlan: "المتبقي بعد المخطط"
      }
    },
    guide: {
      title: "دليل الطالب",
      subtitle: "تعرف على القواعد الأكاديمية ونظام التقديرات في الجامعة المصرية الصينية",
      panels: {
        fvsfl: "فهم تقديرات F و FL",
        fvsflContent: {
          intro: "التقدير النهائي في المقرر من 100 نقطة (النشاط الدراسى + الامتحان النهائى من 40). للنجاح، يجب تلبية الشرطين:",
          condition1: "الحصول على 50 نقطة على الأقل إجمالياً",
          condition2: "الحصول على 12 نقطة على الأقل من 40 في ورقة الامتحان النهائى",
          quickRule: "القاعدة السريعة:",
          ruleF: "الإجمالى < 50 → F (رسب)",
          ruleFL: "الإجمالى ≥ 50، لكن الامتحان النهائى < 12/40 → FL (رسب — لم يتحقق الحد الأدنى)",
          rulePass: "الإجمالى ≥ 50، والامتحان النهائى ≥ 12/40 → نجاح (التقدير مبنى على النسبة المئوية)",
          fExamples: "أمثلة على F",
          flExamples: "أمثلة على FL",
          passExamples: "أمثلة على النجاح",
          note: "كلا F و FL يحملان 0 نقاط وكلاهما يُفعّل قاعدة إعادة الامتحان (أقصى تقدير B+)."
        },
        gradingScale: "جدول التقديرات",
        gradingScaleContent: "يتراوح نظام التقييم في الجامعة المصرية الصينية من A+ (4.0 نقطة) إلى F (0.0 نقطة). التقديرات الخاصة مثل CON و I و W غير محسوبة في المعدل.",
        howGpa: "كيف يُحسب المعدل",
        howGpaContent: {
          semesterFormula: "معدل الفصل = Σ (نقاط التقدير × ساعات معتمدة) / Σ (ساعات معتمدة)",
          cgpaFormula: "المعدل التراكمي = Σ (جميع النقاط × ساعات معتمدة) / Σ (جميع الساعات المحسوبة)",
          note: "تُحسب فقط المقررات ذات النقاط الرقمية. CON و I و W مستبعدة تماماً. مقررات 0 ساعات لا تؤثر على الحساب."
        },
        creditHours: "الساعات المعتمدة والمستويات الأكاديمية",
        creditHoursContent: {
          total: "الإجمالي المطلوب: 138 ساعة معتمدة للتخرج",
          levels: "المستويات الأكاديمية بناءً على الساعات المكتملة",
          level1: "المستوى الأول: 0–27 ساعة",
          level2: "المستوى الثاني: 28–61 ساعة",
          level3: "المستوى الثالث: 62–95 ساعة",
          level4: "المستوى الرابع: 96–138 ساعة"
        },
        trackSelection: "متطلبات اختيار التخصص",
        trackSelectionContent: "يجب على الطلاب إكمال 75 ساعة معتمدة لتكون مؤهلين لاختيار تخصص. تحقق من أهليتك في لوحة المعلومات.",
        subjectLimits: "حدود المقررات لكل فصل",
        subjectLimitsContent: {
          intro: "الحد الأقصى لعدد المقررات التي يمكنك أخذها في الفصل يعتمد على معدلك:",
          limit1: "المعدل أقل من 1.0: الحد الأقصى 4 مقررات",
          limit2: "المعدل من 1.0 إلى أقل من 1.8: الحد الأقصى 5 مقررات",
          limit3: "المعدل 1.8 فأكثر: الحد الأقصى 6 مقررات (طبيعي)",
          note: "يمكن للطلاب طلب أخذ المزيد من الإدارة."
        },
        warnings: "التحذيرات الأكاديمية",
        warningsContent: {
          rule: "إذا فشل الطالب في تحقيق 2.0 في معدل الفصل (TGPA)، يحصل على تحذير أكاديمي.",
          max: "الجامعة المصرية الصينية تسمح بحد أقصى 4 تحذيرات. بعد التحذير الرابع، يُفصل الطالب من الجامعة.",
          tracking: "يتتبع التطبيق تحذيراتك ويعرضها في لوحة المعلومات."
        },
        retakeRule: "قاعدة إعادة الامتحان",
        retakeContent: {
          rule: "إذا حصل الطالب سابقاً على F أو FL في مقرر وأعاد امتحانه، الحد الأقصى للتقدير هو B+ (3.2).",
          enforced: "يُفرض هذا القاعدة في الحاسبة والمخطط."
        }
      }
    },
    scale: {
      title: "جدول التقديرات",
      subtitle: "مرجع كامل لنظام التقديرات في الجامعة المصرية الصينية",
      points: "النقاط",
      grade: "التقدير",
      percentage: "النسبة المئوية",
      specialGrades: "التقديرات الخاصة (مستثناة من المعدل)",
      code: "الرمز",
      meaning: "المعنى"
    },
    common: {
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      close: "إغلاق",
      confirm: "تأكيد",
      loading: "جاري التحميل...",
      noData: "لا توجد بيانات"
    }
  }
};
