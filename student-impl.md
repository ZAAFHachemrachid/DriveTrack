# DriveTrack — Student Role
> Views · Permissions · Exam Flow · Components · API endpoints consumed
> March 2026

---

## Role summary

The Student is the end-user of the learning experience. They take AI-generated theory exams, track their progress through the license stages, view session feedback from their instructor, manage their documents, and pay their fees. Their primary surface is **mobile** — most interactions happen outside the office.

**Platforms:** Web + Mobile (equal feature parity)

---

## View count

| Platform | Views |
|---|---|
| Web | 10 |
| Mobile | 10 |
| **Total** | **20** |

---

## Web Views (10)

### 1. Dashboard
**Route:** `/student/dashboard`  
**Purpose:** Personal progress overview.

**Data shown:**
- Current license stage (progress bar: theory → practical → graduated)
- Next session: date, time, instructor name, vehicle
- Pending exam (if one is assigned and not yet taken)
- Theory exam pass rate (across all attempts)
- Notifications count
- Recent activity feed

**shadcn components:** `Card`, `Progress`, `Badge`, `Separator`, `Alert`  
**API:** `GET /students/:id` (self), `GET /sessions?studentId=&upcoming=true`, `GET /exams?studentId=&status=pending`

---

### 2. My Profile
**Route:** `/student/profile`  
**Purpose:** View personal information and enrollment details.

**Data:** Name, phone, national ID, birth date, address, profile photo, enrolled package, school name.  
**Editable:** Phone, email, profile photo, address.  
**Read-only:** National ID, enrollment date, package.

**shadcn components:** `Form`, `Input`, `Avatar`, `FileUploader`, `Badge`  
**API:** `GET /students/:id`, `PATCH /students/:id`

---

### 3. My Schedule
**Route:** `/student/schedule`  
**Purpose:** View upcoming and past driving sessions.

**Upcoming sessions:** Date, time, instructor name + photo, vehicle (make/plate), location.  
**Past sessions:** Same data + instructor performance notes and score.

**shadcn components:** `Card`, `Badge`, `Avatar`, `Separator`, `HoverCard`  
**API:** `GET /sessions?studentId=`

---

### 4. Session History
**Route:** `/student/sessions`  
**Purpose:** Full list of completed sessions with instructor feedback.

**Columns:** Date, instructor, duration, performance score, notes  
**Detail panel:** Skill-by-skill breakdown (parking, highway, roundabouts...) as rated by instructor.

**shadcn components:** `DataTable`, `Sheet`, `Badge`, `Progress`  
**API:** `GET /sessions?studentId=&status=completed`

---

### 5. Exam Hub
**Route:** `/student/exams`  
**Purpose:** Central place to view, take, and review exams.

**Sections:**
- **Pending:** Exams assigned but not yet started (shows `Take Exam` button)
- **In Progress:** Exam started but not submitted
- **History:** All completed exams — date, score, pass/fail, attempt number

**shadcn components:** `Tabs`, `Card`, `Badge`, `Button`, `Progress`  
**API:** `GET /exams?studentId=`

---

### 6. Take Exam
**Route:** `/student/exams/:examId/take`  
**Purpose:** The actual theory exam interface.

**Layout:**
- Top bar: timer countdown, question counter (e.g. "12 / 40"), progress bar
- Question text (large, readable)
- 4 answer options as styled radio buttons (A/B/C/D)
- Navigation: Previous / Next / Jump to question (sidebar)
- Submit button (disabled until all questions answered, or until timer expires)

**Behavior:**
- Answers auto-saved on selection (no data loss on accidental close)
- Timer auto-submits when it reaches 0
- Cannot go back to change answer once submitted (configurable)

**shadcn components:** `Progress`, `RadioGroup`, `Button`, `AlertDialog` (confirm submit), `Sheet` (question navigator)  
**API:** `GET /exams/:id`, `POST /exams/:id/answer` (per question), `POST /exams/:id/submit`

---

### 7. Exam Result Detail
**Route:** `/student/exams/:examId/result`  
**Purpose:** Full breakdown after exam submission.

**Data:**
- Score (e.g. 36/40) with pass/fail banner
- Per-topic performance (e.g. "Signs: 8/10 ✅ | Priority rules: 3/5 ⚠️")
- Question-by-question review: student's answer vs correct answer + explanation
- Retry button if failed and attempts remain

**shadcn components:** `Card`, `Progress`, `Badge`, `Tabs`, `Accordion` (question review), `Button`  
**API:** `GET /exams/:id/results`

---

### 8. My Documents
**Route:** `/student/documents`  
**Purpose:** Upload and track required enrollment documents.

**Documents required:** National ID, passport photo, medical certificate, birth certificate, residence certificate.  
**Status per document:** Pending review / Approved / Rejected (with rejection reason)  
**Actions:** Upload, Re-upload if rejected.

**shadcn components:** `Card`, `FileUploader`, `Badge`, `Alert`  
**API:** `GET /documents?studentId=`, `POST /documents`

---

### 9. Payments
**Route:** `/student/payments`  
**Purpose:** View invoice history and payment status.

**Columns:** Description, amount, status, due date, paid date  
**Alerts:** Overdue invoices shown with warning banner at top  
**Actions:** View invoice PDF, Pay online (if payment gateway enabled)

**shadcn components:** `DataTable`, `Badge`, `Alert`, `Button`  
**API:** `GET /invoices?studentId=`

---

### 10. Notifications
**Route:** `/student/notifications`  
**Purpose:** All school communications and system alerts.

**Item types:**
- Session reminder (24h before)
- Exam assigned (take exam)
- Session feedback available (instructor rated you)
- Document status changed (approved/rejected)
- Invoice due reminder
- School announcements

**shadcn components:** `ScrollArea`, `Badge`, `Separator`  
**API:** `GET /notifications`


---

## Exam Flow (complete)

```
Secretary/Admin assigns exam to student
         │
         ▼
POST /exams/generate  →  Python AI service generates 40 questions
         │
         ▼
Exam record created (status: pending)
         │
         ▼
Student sees "Pending exam" on dashboard
         │
         ▼
Student taps "Take Exam"
  POST /exams/:id/start  (status → in_progress, started_at = now)
         │
         ▼
Student answers questions one by one
  POST /exams/:id/answer  { question_id, chosen_option }
  (answers saved immediately — no data loss)
         │
         ▼
Student submits OR timer expires
  POST /exams/:id/submit
  (backend computes score, sets status: passed | failed)
         │
         ▼
Student sees result page
  GET /exams/:id/results
  (score, per-topic breakdown, question review with explanations)
         │
         ├── Passed (≥ 35/40) → license_stage updated to 'theory_passed'
         │                     Secretary notified to schedule practical sessions
         │
         └── Failed            → attempt_number incremented
                               → retry available if attempts_remaining > 0
                               → weak topics flagged for next adaptive exam
```

---

## Permissions

| Action | Allowed |
|---|---|
| View own profile | ✅ |
| Edit own contact info | ✅ |
| View own sessions | ✅ |
| View instructor feedback | ✅ own sessions |
| Take assigned exams | ✅ |
| View own exam results | ✅ |
| Upload own documents | ✅ |
| View own invoices | ✅ |
| View other students' data | ❌ |
| Create / manage sessions | ❌ |
| Generate exams | ❌ |
| View analytics | ❌ |

---

*DriveTrack · Student Role Spec · ZAAFHachemrachid*
