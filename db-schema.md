# DriveTrack — Database
> PostgreSQL · Schema · Indexes · Row-Level Security · Migrations
> March 2026

---

## Table of Contents
1. [Design principles](#design-principles)
2. [Entity Relationship Overview](#entity-relationship-overview)
3. [Schema — All Tables](#schema--all-tables)
4. [Indexes](#indexes)
5. [Row-Level Security (Multi-tenant)](#row-level-security)
6. [Migrations setup](#migrations-setup)

---

## Design principles

- **Multi-tenant by design** — every row that belongs to a school carries `school_id`
- **UUID primary keys** — safer for distributed/offline sync via Tauri desktop
- **Enums for finite states** — license stage, session status, invoice status etc. are Postgres native enums
- **Soft deletes** — `is_active` flag instead of hard deletes on users and vehicles
- **JSONB for flexible data** — exam question options stored as JSONB (variable count, easy to query)

---

## Entity Relationship Overview

```
schools
  └── users  (role: admin | secretary | instructor | student)
        ├── student_profiles  (1:1 with users where role = student)
        ├── instructor_profiles  (1:1 with users where role = instructor)
        ├── sessions  (student_id + instructor_id + vehicle_id)
        ├── exams
        │     ├── exam_questions
        │     └── exam_answers
        └── invoices

  └── vehicles
  └── packages
```

---

## Schema — All Tables

### Schools (multi-tenant root)

```sql
CREATE TABLE schools (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  address      TEXT,
  license_no   TEXT UNIQUE NOT NULL,
  wilaya       TEXT NOT NULL,
  phone        TEXT,
  logo_url     TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Users (all roles unified)

```sql
CREATE TYPE user_role AS ENUM (
  'super_admin', 'admin', 'secretary', 'instructor', 'student'
);

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id),    -- NULL for super_admin
  role          user_role NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  email         TEXT UNIQUE,
  phone         TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Student profiles (extends users)

```sql
CREATE TYPE license_stage AS ENUM (
  'theory_pending',
  'theory_passed',
  'practical_pending',
  'practical_passed',
  'graduated'
);

CREATE TABLE student_profiles (
  user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  national_id    TEXT UNIQUE NOT NULL,
  birth_date     DATE NOT NULL,
  address        TEXT,
  license_stage  license_stage NOT NULL DEFAULT 'theory_pending',
  package_id     UUID REFERENCES packages(id),
  enrolled_at    TIMESTAMPTZ DEFAULT NOW(),
  graduated_at   TIMESTAMPTZ
);
```

---

### Instructor profiles (extends users)

```sql
CREATE TABLE instructor_profiles (
  user_id          UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  license_no       TEXT NOT NULL,
  specializations  TEXT[],          -- e.g. ['manual','automatic','truck']
  hire_date        DATE,
  rating           NUMERIC(3,2)     -- computed avg from session scores
);
```

---

### Packages (enrollment tiers)

```sql
CREATE TABLE packages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id      UUID REFERENCES schools(id),
  name           TEXT NOT NULL,
  price          NUMERIC(10,2) NOT NULL,
  theory_hours   INT DEFAULT 0,
  practical_hours INT DEFAULT 0,
  exam_attempts  INT DEFAULT 3,
  description    TEXT,
  is_active      BOOLEAN DEFAULT TRUE
);
```

---

### Vehicles

```sql
CREATE TABLE vehicles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id),
  plate_no      TEXT UNIQUE NOT NULL,
  make          TEXT,
  model         TEXT,
  year          INT,
  transmission  TEXT CHECK (transmission IN ('manual', 'automatic')),
  fuel_type     TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'electric')),
  is_active     BOOLEAN DEFAULT TRUE,
  last_service  DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Sessions (driving lessons)

```sql
CREATE TYPE session_status AS ENUM (
  'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'
);

CREATE TABLE sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID REFERENCES schools(id),
  student_id        UUID REFERENCES users(id),
  instructor_id     UUID REFERENCES users(id),
  vehicle_id        UUID REFERENCES vehicles(id),
  scheduled_at      TIMESTAMPTZ NOT NULL,
  duration_mins     INT DEFAULT 60,
  status            session_status DEFAULT 'scheduled',
  instructor_notes  TEXT,
  performance_score NUMERIC(3,1),     -- 0.0 to 10.0
  location          TEXT,
  started_at        TIMESTAMPTZ,
  ended_at          TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Exams

```sql
CREATE TYPE exam_status AS ENUM (
  'pending', 'in_progress', 'passed', 'failed', 'expired'
);

CREATE TABLE exams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES users(id),
  school_id       UUID REFERENCES schools(id),
  status          exam_status DEFAULT 'pending',
  score           INT,
  pass_threshold  INT DEFAULT 35,       -- Algeria standard: 35/40
  total_questions INT DEFAULT 40,
  duration_mins   INT DEFAULT 40,
  attempt_number  INT DEFAULT 1,
  lang            TEXT DEFAULT 'ar',    -- 'ar' | 'fr'
  started_at      TIMESTAMPTZ,
  submitted_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,          -- auto-expire if student abandons
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id         UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  options         JSONB NOT NULL,
  -- options shape: [{"label":"A","text":"..."},{"label":"B","text":"..."},...]
  correct_option  TEXT NOT NULL,        -- "A" | "B" | "C" | "D"
  topic           TEXT,                 -- 'priority_rules'|'signs'|'distances'
  difficulty      INT DEFAULT 1,        -- 1=easy 2=medium 3=hard
  explanation     TEXT,                 -- shown after submission
  question_order  INT NOT NULL
);

CREATE TABLE exam_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id         UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id     UUID REFERENCES exam_questions(id),
  chosen_option   TEXT,                 -- NULL if unanswered
  is_correct      BOOLEAN,
  answered_at     TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Invoices & Payments

```sql
CREATE TYPE invoice_status AS ENUM (
  'draft', 'sent', 'paid', 'overdue', 'cancelled'
);

CREATE TABLE invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id),
  student_id    UUID REFERENCES users(id),
  amount        NUMERIC(10,2) NOT NULL,
  currency      TEXT DEFAULT 'DZD',
  status        invoice_status DEFAULT 'draft',
  due_date      DATE,
  paid_at       TIMESTAMPTZ,
  payment_method TEXT,                 -- 'cash'|'cib'|'dahabia'
  receipt_url   TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Documents (student uploads)

```sql
CREATE TYPE doc_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE doc_type AS ENUM (
  'national_id', 'photo', 'medical_cert', 'birth_cert', 'residence_cert'
);

CREATE TABLE documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID REFERENCES users(id),
  school_id   UUID REFERENCES schools(id),
  type        doc_type NOT NULL,
  status      doc_status DEFAULT 'pending',
  file_url    TEXT NOT NULL,           -- S3/MinIO path
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  notes       TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Refresh Tokens (auth)

```sql
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT UNIQUE NOT NULL,
  device_info TEXT,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Indexes

```sql
-- Session queries (most frequent)
CREATE INDEX idx_sessions_student     ON sessions(student_id, scheduled_at DESC);
CREATE INDEX idx_sessions_instructor  ON sessions(instructor_id, scheduled_at DESC);
CREATE INDEX idx_sessions_school_date ON sessions(school_id, scheduled_at);
CREATE INDEX idx_sessions_status      ON sessions(school_id, status);

-- Exam queries
CREATE INDEX idx_exams_student        ON exams(student_id, created_at DESC);
CREATE INDEX idx_exams_school_status  ON exams(school_id, status);

-- Invoice queries
CREATE INDEX idx_invoices_school      ON invoices(school_id, status);
CREATE INDEX idx_invoices_student     ON invoices(student_id, created_at DESC);

-- User queries
CREATE INDEX idx_users_school_role    ON users(school_id, role);
CREATE INDEX idx_users_phone          ON users(phone);

-- Full text search on student names
CREATE INDEX idx_users_fts ON users
  USING gin(to_tsvector('simple', first_name || ' ' || last_name));

-- Document review queue
CREATE INDEX idx_documents_pending ON documents(school_id, status)
  WHERE status = 'pending';
```

---

## Row-Level Security

RLS enforces multi-tenant isolation at the database layer — even if a bug in the API forgets to filter by `school_id`, the DB will reject cross-tenant reads.

```sql
-- Enable on all tenant-scoped tables
ALTER TABLE users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams       ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices    ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles    ENABLE ROW LEVEL SECURITY;

-- Policy: rows are only visible to the matching school
CREATE POLICY tenant_isolation ON sessions
  USING (school_id = current_setting('app.school_id')::uuid);

CREATE POLICY tenant_isolation ON users
  USING (
    school_id = current_setting('app.school_id')::uuid
    OR role = 'super_admin'
  );

-- Set per-request in the API (Axum middleware):
-- SET LOCAL app.school_id = '<uuid>';
```

---

## Migrations setup

### With sqlx (Axum)

```bash
# Install sqlx CLI
cargo install sqlx-cli --features postgres

# Create migration
sqlx migrate add init_schema
sqlx migrate add add_documents_table

# Run migrations
sqlx migrate run

# Revert last
sqlx migrate revert
```

Migration file naming: `migrations/20260301_000001_init_schema.sql`

### With Drizzle (Hono)

```bash
# Generate migration from schema changes
bunx drizzle-kit generate

# Apply migrations
bunx drizzle-kit migrate

# Inspect DB
bunx drizzle-kit studio
```

---

*DriveTrack · Database Spec · ZAAFHachemrachid*
