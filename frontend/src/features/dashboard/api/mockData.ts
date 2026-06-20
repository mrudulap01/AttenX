export const mockAttendanceData = {
  totalClasses: 120,
  attended: 95,
  absent: 15,
  excused: 10,
  overallPercentage: 83,
};

export const mockLecturesToday = [
  { id: 1, subject: "Advanced Database Systems", time: "09:00 AM - 10:30 AM", room: "Room 402", faculty: "Dr. Smith", status: "completed" },
  { id: 2, subject: "Machine Learning", time: "11:00 AM - 12:30 PM", room: "Lab 2", faculty: "Prof. Johnson", status: "ongoing" },
  { id: 3, subject: "Software Engineering", time: "02:00 PM - 03:30 PM", room: "Room 301", faculty: "Dr. Williams", status: "upcoming" },
];

export const mockRecentAttendance = [
  { id: 1, date: "2026-06-19", subject: "Machine Learning", status: "Present" },
  { id: 2, date: "2026-06-19", subject: "Advanced Database Systems", status: "Present" },
  { id: 3, date: "2026-06-18", subject: "Software Engineering", status: "Absent" },
  { id: 4, date: "2026-06-18", subject: "Computer Networks", status: "Excused" },
  { id: 5, date: "2026-06-17", subject: "Machine Learning", status: "Present" },
];

export const mockNotifications = [
  { id: 1, type: "alert", message: "Your attendance in Software Engineering dropped below 75%.", time: "2 hours ago" },
  { id: 2, type: "info", message: "Machine Learning lecture moved to Lab 2.", time: "5 hours ago" },
  { id: 3, type: "success", message: "Leave request for 18th June approved.", time: "1 day ago" },
];

export const mockTeacherStats = {
  totalStudents: 145,
  classesConducted: 42,
  averageAttendance: 88,
  pendingReports: 2,
};

export const mockTeacherTimetable = [
  { id: 1, subject: "Machine Learning (Div A)", time: "09:00 AM - 10:30 AM", room: "Lab 2", status: "completed", attendance: "55/60" },
  { id: 2, subject: "Machine Learning (Div B)", time: "11:00 AM - 12:30 PM", room: "Lab 2", status: "ongoing", attendance: "Live" },
  { id: 3, subject: "Artificial Intelligence", time: "02:00 PM - 03:30 PM", room: "Room 301", status: "upcoming", attendance: "-" },
];

export const mockRecentReports = [
  { id: 1, date: "2026-06-19", subject: "Machine Learning (Div A)", present: 55, total: 60, status: "Generated" },
  { id: 2, date: "2026-06-18", subject: "Artificial Intelligence", present: 42, total: 45, status: "Generated" },
  { id: 3, date: "2026-06-17", subject: "Machine Learning (Div B)", present: 58, total: 60, status: "Generated" },
];

export const mockSubjectAnalytics = {
  labels: ['ML (Div A)', 'ML (Div B)', 'AI Core'],
  datasets: [
    {
      label: 'Average Attendance %',
      data: [91, 96, 93],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 6,
    }
  ]
};

export const mockAdminStats = {
  totalStudents: 1245,
  totalTeachers: 84,
  departments: 12,
  globalAttendance: 87,
};

export const mockGlobalAnalytics = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: 'Global Attendance %',
      data: [88, 92, 85, 89, 81, 75],
      borderColor: 'rgba(16, 185, 129, 1)', // emerald-500
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
    }
  ]
};

export const mockRecentActivities = [
  { id: 1, user: "Dr. Smith", action: "generated an attendance report for", target: "Machine Learning", time: "10 mins ago" },
  { id: 2, user: "System", action: "flagged 15 students for", target: "Low Attendance (< 75%)", time: "1 hour ago" },
  { id: 3, user: "Admin", action: "added a new teacher to", target: "Computer Science Dept", time: "3 hours ago" },
  { id: 4, user: "Prof. Johnson", action: "started a live attendance session for", target: "Database Systems", time: "5 hours ago" },
];

export const mockUsersList = [
  { id: "STU-001", name: "Alice Cooper", email: "alice@attenx.edu", role: "Student", department: "Computer Science", status: "Active" },
  { id: "STU-002", name: "Bob Martin", email: "bob@attenx.edu", role: "Student", department: "Information Tech", status: "Active" },
  { id: "TEA-001", name: "Dr. Smith", email: "smith@attenx.edu", role: "Teacher", department: "Computer Science", status: "Active" },
  { id: "TEA-002", name: "Prof. Johnson", email: "johnson@attenx.edu", role: "Teacher", department: "Data Science", status: "Inactive" },
  { id: "STU-003", name: "Charlie Brown", email: "charlie@attenx.edu", role: "Student", department: "Computer Science", status: "Active" },
];
