import type { 
  User, 
  StudentProfile, 
  Session, 
  Exam, 
  Invoice, 
  StudentDocument, 
  Notification, 
  Vehicle,
  School
} from './types';

export const mockSchool: School = {
  id: 'school-1',
  name: 'Elite Driving School',
  address: '123 Main St, Algiers',
  license_no: 'DS-2026-001',
  wilaya: 'Algiers',
  phone: '+213 555 123 456',
  logo_url: 'https://placehold.co/100x100?text=EDS',
  is_active: true,
  created_at: new Date().toISOString(),
};

export const mockStudent: User = {
  id: 'student-1',
  school_id: 'school-1',
  role: 'student',
  first_name: 'Ahmed',
  last_name: 'Mansouri',
  email: 'ahmed.m@example.com',
  phone: '+213 770 112 233',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockStudentProfile: StudentProfile = {
  user_id: 'student-1',
  national_id: '123456789012',
  birth_date: '2000-05-15',
  address: 'Didouche Mourad, Algiers',
  license_stage: 'theory_pending',
  package_id: 'pkg-1',
  enrolled_at: new Date().toISOString(),
};

export const mockInstructors: User[] = [
  {
    id: 'instructor-1',
    school_id: 'school-1',
    role: 'instructor',
    first_name: 'Mohamed',
    last_name: 'Ziri',
    phone: '+213 661 445 566',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'v-1',
    school_id: 'school-1',
    plate_no: '12345-126-16',
    make: 'Volkswagen',
    model: 'Golf 8',
    year: 2024,
    transmission: 'manual',
    fuel_type: 'diesel',
    is_active: true,
    created_at: new Date().toISOString(),
  }
];

export const mockSessions: Session[] = [
  {
    id: 'sess-1',
    school_id: 'school-1',
    student_id: 'student-1',
    instructor_id: 'instructor-1',
    vehicle_id: 'v-1',
    scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    duration_mins: 60,
    status: 'scheduled',
    location: 'Place Maurice Audin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    instructor: mockInstructors[0],
    vehicle: mockVehicles[0],
  },
  {
    id: 'sess-0',
    school_id: 'school-1',
    student_id: 'student-1',
    instructor_id: 'instructor-1',
    vehicle_id: 'v-1',
    scheduled_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    duration_mins: 60,
    status: 'completed',
    performance_score: 8.5,
    instructor_notes: 'Good control, needs more practice with parallel parking.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    instructor: mockInstructors[0],
    vehicle: mockVehicles[0],
  }
];

export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    student_id: 'student-1',
    school_id: 'school-1',
    status: 'pending',
    pass_threshold: 35,
    total_questions: 40,
    duration_mins: 40,
    attempt_number: 1,
    lang: 'ar',
    created_at: new Date().toISOString(),
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    school_id: 'school-1',
    student_id: 'student-1',
    amount: 15000,
    currency: 'DZD',
    status: 'paid',
    due_date: '2026-03-01',
    paid_at: '2026-03-02T10:00:00Z',
    payment_method: 'cash',
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-03-02T10:00:00Z',
  }
];

export const mockDocuments: StudentDocument[] = [
  {
    id: 'doc-1',
    student_id: 'student-1',
    school_id: 'school-1',
    type: 'national_id',
    status: 'approved',
    file_url: 'https://example.com/docs/id.pdf',
    uploaded_at: new Date().toISOString(),
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'not-1',
    user_id: 'student-1',
    title: 'New Exam Assigned',
    message: 'A new theory exam has been assigned to you. You can take it now in the Exam Hub.',
    type: 'exam',
    is_read: false,
    created_at: new Date().toISOString(),
  }
];
