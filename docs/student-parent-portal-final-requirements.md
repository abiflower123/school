# Student/Parent Portal — Final Requirements
## Ravion School Management Platform

> Status: Phase 1 Analysis Complete
> Date: September 2026
> Derived from: Existing codebase + School (2).docx + Tamil Nadu school ERP research

---

## A. Product Objective

The Ravion Student/Parent Portal is a unified web application used by both students and their parents/guardians to access a child's complete school information in one place.

It is not a generic school ERP dashboard for administrators. It is a consumer-grade, mobile-first portal designed for everyday use by families — checking today's timetable, seeing exam results, paying fees, applying for leave, and communicating with teachers.

The portal is the student-facing and parent-facing layer of a larger school management platform. The same backend data will later be written by Teachers, Admins, and Principals through their own separate portals.

---

## B. Login Model

One login for the student/parent portal. Parent and student do not have separate portal URLs or separate app instances. When a parent logs in, they see their children. When a student logs in, they see only themselves.

Multi-child: Parent account supports multiple children. Selected child drives all data. Zero cross-child data leakage permitted.

---

## C. Navigation Structure (Derived)

Module 1: HOME — Dashboard
Module 2: LEARNING — Timetable, Attendance+Leave, Subjects+Progress, Assignments+Homework, Exams+Results, Report Cards
Module 3: FINANCE — Fees+Payments, Transport
Module 4: SCHOOL SERVICES — Announcements, Notifications, Messages, Calendar, Clubs+Activities, Certificates+Documents, Helpdesk
Module 5: PROFILE — Student Profile, Settings

---

## D. Feature Decisions

KEEP: sidebar nav, academic progress pattern, assignments pattern, attendance daily list, calendar UI, leave form, announcements list, timetable day view, report card base
MODIFY: dashboard (add fees+child switcher), layout header (add child switcher+notifications), sidebar (add finance+services), messages (functional send), settings (functional sections), progress reports (multi-term), exams (add detail view)
MERGE: Feedback + Helpdesk into one Support page
REMOVE: static hardcoded name/date strings, non-functional buttons with no state, chatbot (not justified), live GPS (backend-only)
ADD: Multi-child switcher (P0), Login page (P0), Fee+Payments page (P0), Transport page (P1), Student Profile page (P0), Notifications panel (P0), Certificates+Documents (P1), Clubs+Activities (P1), Subject-wise attendance (P0), Attendance calendar (P0), Multi-term report card (P0)

---

## E. Mock Service Architecture

src/services/mock/students.ts — Student and Guardian data (multi-child)
src/services/mock/timetable.ts — Timetable by studentId + day
src/services/mock/attendance.ts — Attendance records by studentId
src/services/mock/assignments.ts — Assignments by studentId
src/services/mock/exams.ts — Exams and results by studentId
src/services/mock/fees.ts — Fee structure and payment history by studentId
src/services/mock/transport.ts — Transport info by studentId
src/services/mock/announcements.ts — School-wide announcements
src/services/mock/notifications.ts — Notifications by studentId
src/services/mock/messages.ts — Message threads by studentId
src/services/mock/documents.ts — Documents and requests by studentId
src/services/mock/helpdesk.ts — Support tickets by studentId
src/services/mock/clubs.ts — Clubs and activities by studentId

All service functions accept studentId as first parameter for later API replacement.

---

## F. Design System (Preserved + Refined)

Dark sidebar (slate-950) + white content area + slate-50 background — PRESERVE.
Accent: cyan-400/500. Positive: emerald-600. Warning: amber-600. Danger: rose-600. Info: blue-600.
Typography: Inter (already set). Border radius: rounded-2xl (already set).
Improvements: branded app name Ravion, polished child switcher, dashboard gradient header strip.
