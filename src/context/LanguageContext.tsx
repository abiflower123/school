import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "en" | "ta";

const STORAGE_KEY = "ravion_language";

// Navigation and shell strings translated as a working example of the
// Tamil/English switch required by the school. Deeper page content stays
// English-only for now — see docs/student-parent-portal-final-requirements.md.
const dictionary = {
  en: {
    dashboard: "Dashboard",
    timetable: "Timetable",
    attendanceLeave: "Attendance & Leave",
    subjectsProgress: "Subjects & Progress",
    studyMaterials: "Study Materials",
    assignments: "Assignments",
    examsResults: "Exams & Results",
    reportCards: "Report Cards",
    feesPayments: "Fees & Payments",
    scholarship: "Scholarship",
    transport: "Transport",
    myTeachers: "My Teachers",
    announcements: "Announcements",
    messages: "Messages",
    calendarEvents: "Calendar & Events",
    clubsActivities: "Clubs & Activities",
    certificates: "Certificates",
    helpdesk: "Helpdesk",
    myProfile: "My Profile",
    settings: "Settings",
    signOut: "Sign Out",
    main: "Main",
    learning: "Learning",
    finance: "Finance",
    schoolServices: "School Services",
    profile: "Profile",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
  },
  ta: {
    dashboard: "முகப்பு",
    timetable: "நேர அட்டவணை",
    attendanceLeave: "வருகை & விடுப்பு",
    subjectsProgress: "பாடங்கள் & முன்னேற்றம்",
    studyMaterials: "பாட உபகரணங்கள்",
    assignments: "பணிகள்",
    examsResults: "தேர்வுகள் & முடிவுகள்",
    reportCards: "மதிப்பீட்டு அறிக்கை",
    feesPayments: "கட்டணம் & பணம் செலுத்துதல்",
    scholarship: "உதவித்தொகை",
    transport: "போக்குவரத்து",
    myTeachers: "எனது ஆசிரியர்கள்",
    announcements: "அறிவிப்புகள்",
    messages: "செய்திகள்",
    calendarEvents: "நாட்காட்டி & நிகழ்வுகள்",
    clubsActivities: "சங்கங்கள் & செயல்பாடுகள்",
    certificates: "சான்றிதழ்கள்",
    helpdesk: "உதவி மையம்",
    myProfile: "எனது சுயவிவரம்",
    settings: "அமைப்புகள்",
    signOut: "வெளியேறு",
    main: "முதன்மை",
    learning: "கற்றல்",
    finance: "நிதி",
    schoolServices: "பள்ளி சேவைகள்",
    profile: "சுயவிவரம்",
    goodMorning: "காலை வணக்கம்",
    goodAfternoon: "மதிய வணக்கம்",
    goodEvening: "மாலை வணக்கம்",
  },
} as const;

export type TranslationKey = keyof typeof dictionary.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "ta" ? "ta" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: TranslationKey) => dictionary[language][key], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
