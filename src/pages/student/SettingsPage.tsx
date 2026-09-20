import { useState, useEffect } from "react";
import { Bell, Lock, Globe, Moon, Save, CheckCircle2 } from "lucide-react";
import { useLanguage, type Language } from "../../context/LanguageContext";

type NotificationPrefs = {
  academic: boolean;
  attendance: boolean;
  financial: boolean;
  announcements: boolean;
  messages: boolean;
};

const NOTIF_KEY = "ravion_notification_prefs";

const defaultPrefs: NotificationPrefs = {
  academic: true,
  attendance: true,
  financial: true,
  announcements: true,
  messages: true,
};

type TabId = "notifications" | "appearance" | "language" | "security";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("notifications");
  const [saved, setSaved] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  const [prefs, setPrefs] = useState<NotificationPrefs>(() => {
    try {
      const stored = localStorage.getItem(NOTIF_KEY);
      return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const togglePref = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: { id: TabId; label: string; icon: typeof Bell }[] = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Moon },
    { id: "language", label: "Language", icon: Globe },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your account preferences and app settings.</p>
      </section>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition-all">
          <CheckCircle2 size={16} />
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Nav Tabs */}
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible lg:space-y-1 lg:col-span-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "notifications" && (
            <form onSubmit={handleSave} className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
              <div className="border-b border-zinc-100 p-6">
                <h2 className="text-base font-semibold text-zinc-900">Push Notifications</h2>
                <p className="mt-1 text-sm text-zinc-500">Choose what updates you want to receive on this device.</p>
              </div>

              <div className="divide-y divide-zinc-100 p-6 space-y-6">
                {(
                  [
                    { key: "academic", title: "Academic Updates", desc: "Grades, assignments, and timetable changes." },
                    { key: "attendance", title: "Attendance Alerts", desc: "Daily attendance summary and shortage warnings." },
                    { key: "financial", title: "Financial Notices", desc: "Fee reminders and payment confirmations." },
                    { key: "announcements", title: "School Announcements", desc: "Important notices, holidays, and events." },
                    { key: "messages", title: "Direct Messages", desc: "Messages from teachers or administration." },
                  ] as const
                ).map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-4 pt-6 first:pt-0">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                      <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={prefs[item.key]}
                      onClick={() => togglePref(item.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                        prefs[item.key] ? "bg-zinc-900" : "bg-zinc-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          prefs[item.key] ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 p-6 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  <Save size={16} />
                  Save Preferences
                </button>
              </div>
            </form>
          )}

          {activeTab === "appearance" && (
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Moon size={18} />
                </div>
                <h2 className="text-sm font-semibold text-zinc-900">Appearance</h2>
              </div>
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Dark Mode</p>
                  <p className="mt-0.5 text-xs text-zinc-500">Switch between light and dark theme.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isDarkMode}
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </section>
          )}

          {activeTab === "language" && (
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Globe size={18} />
                </div>
                <h2 className="text-sm font-semibold text-zinc-900">App Language</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-zinc-500 mb-4">
                  Choose the language for navigation and menus. (Full page content will follow in a later update.)
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {([
                    { code: "en" as Language, label: "English" },
                    { code: "ta" as Language, label: "தமிழ்" },
                  ]).map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setLanguage(opt.code)}
                      className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                        language === opt.code
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "security" && (
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Lock size={18} />
                </div>
                <h2 className="text-sm font-semibold text-zinc-900">Security</h2>
              </div>
              <div className="p-6 text-sm text-zinc-500">
                Password changes and login-activity review will be available once account management is connected to the school's backend. For now, contact the school office to reset your portal password.
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
