import { UserRound, Phone, Mail, GraduationCap, Heart, Home, Edit } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { selectedChild, getInitials } = useAuth();
  const navigate = useNavigate();

  if (!selectedChild) return null;

  const s = selectedChild;

  const infoRow = (label: string, value: string) => (
    <div className="py-2.5">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-zinc-900">{value}</p>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Heading */}
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">My Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          View your student details and guardian information.
        </p>
      </section>

      {/* Profile Header */}
      <section className="flex flex-col items-start gap-5 rounded-xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-2xl font-bold text-white">
          {getInitials(s.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-zinc-900">{s.name}</h2>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              Class {s.class}-{s.section}
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {s.admissionNumber}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {s.status}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-zinc-500">{s.academicYear} · {s.house}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/helpdesk")}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
        >
          <Edit size={15} />
          Request Update
        </button>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Personal Details */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <UserRound size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">Personal Details</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {infoRow("Full Name", s.name)}
            {infoRow("Date of Birth", s.dob)}
            {infoRow("Gender", s.gender)}
            {infoRow("Blood Group", s.bloodGroup)}
            {infoRow("Roll Number", s.rollNumber)}
          </div>
        </section>

        {/* Academic Details */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <GraduationCap size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">Academic Details</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {infoRow("Student ID", s.id)}
            {infoRow("Class & Section", `Class ${s.class}-${s.section}`)}
            {infoRow("Academic Year", s.academicYear)}
            {infoRow("Class Teacher", s.classTeacher)}
            {infoRow("House / Team", s.house)}
            {infoRow("Admission Number", s.admissionNumber)}
          </div>
          <button
            type="button"
            onClick={() => navigate("/progress-reports")}
            className="mt-4 text-xs font-medium text-zinc-500 hover:text-zinc-900"
          >
            View academic history & report cards →
          </button>
        </section>

        {/* Guardian Details */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
              <Home size={16} className="text-violet-600" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">Guardian / Parent</h2>
          </div>
          <div className="space-y-4">
            {s.guardians.map((g) => (
              <div key={g.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600">
                    {g.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{g.name}</p>
                    <p className="text-xs text-zinc-500">{g.relationship} · {g.occupation}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Phone size={12} className="text-zinc-400" />
                    {g.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Mail size={12} className="text-zinc-400" />
                    {g.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
              <Heart size={16} className="text-rose-600" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900">Emergency Contact</h2>
          </div>
          <div className="rounded-lg border border-rose-100 bg-rose-50/40 p-4">
            <p className="text-sm font-semibold text-zinc-900">{s.emergencyContact.name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{s.emergencyContact.relationship}</p>
            <a
              href={`tel:${s.emergencyContact.phone}`}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-700 transition hover:text-rose-900"
            >
              <Phone size={14} />
              {s.emergencyContact.phone}
            </a>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            This contact will be reached in case of emergencies at school.
          </p>
        </section>
      </div>
    </div>
  );
}
