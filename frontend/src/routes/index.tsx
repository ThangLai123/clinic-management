import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { ReceptionistLayout } from '../layouts/ReceptionistLayout';
import { DoctorLayout } from '../layouts/DoctorLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public / Patient Pages
import { HomePage } from '../views/public/pages/HomePage';
import { ServicesPage } from '../views/public/pages/ServicesPage';
import { AppointmentBookingPage } from '../views/patient/pages/AppointmentBookingPage';
import { MedicalHistoryPage } from '../views/patient/pages/MedicalHistoryPage';

// Receptionist Pages
import { ReceptionistDashboardPage } from '../views/receptionist/pages/ReceptionistDashboardPage';
import { PharmacyInventoryPage } from '../views/receptionist/pages/PharmacyInventoryPage';
import { PatientReceptionPage } from '../views/receptionist/pages/PatientReceptionPage';
import { AppointmentManagementPage } from '../views/receptionist/pages/AppointmentManagementPage';
import { RoomAssignmentPage } from '../views/receptionist/pages/RoomAssignmentPage';
import { PatientRecordsPage } from '../views/receptionist/pages/PatientRecordsPage';
import { PrescriptionDispensingPage } from '../views/receptionist/pages/PrescriptionDispensingPage';
import { BillingAndPaymentPage } from '../views/receptionist/pages/BillingAndPaymentPage';

// Doctor Pages
import { DoctorDashboardPage } from '../views/doctor/pages/DoctorDashboardPage';
import { DoctorQueuePage } from '../views/doctor/pages/DoctorQueuePage';
import { EntExaminationPage } from '../views/doctor/pages/EntExaminationPage';
import { MedicalRecordDetailPage } from '../views/doctor/pages/MedicalRecordDetailPage';
import { PrescriptionFormPage } from '../views/doctor/pages/PrescriptionFormPage';

// Admin Pages
import { AdminDashboardPage } from '../views/admin/pages/AdminDashboardPage';
import { UserManagementPage } from '../views/admin/pages/UserManagementPage';
import { PermissionsAuditPage } from '../views/admin/pages/PermissionsAuditPage';

// Auth Pages
import { LoginPage } from '../views/auth/pages/LoginPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. PUBLIC & PATIENT AREA */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="appointments/new" element={<AppointmentBookingPage />} />
        <Route path="medical-history" element={<MedicalHistoryPage />} />
        <Route path="my/medical-records" element={<MedicalHistoryPage />} />
        <Route path="my/appointments" element={<Navigate to="/medical-history" replace />} />
      </Route>

      {/* 2. AUTHENTICATION */}
      <Route path="/login" element={<LoginPage />} />

      {/* 3. RECEPTIONIST AREA */}
      <Route path="/receptionist" element={<ReceptionistLayout />}>
        <Route index element={<ReceptionistDashboardPage />} />
        <Route path="appointments" element={<AppointmentManagementPage />} />
        <Route path="reception" element={<PatientReceptionPage />} />
        <Route path="patients" element={<PatientRecordsPage />} />
        <Route path="room-assignment" element={<RoomAssignmentPage />} />
        <Route path="pharmacy" element={<PharmacyInventoryPage />} />
        <Route path="dispensing" element={<PrescriptionDispensingPage />} />
        <Route path="billing" element={<BillingAndPaymentPage />} />
      </Route>

      {/* 3. DOCTOR AREA */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorDashboardPage />} />
        <Route path="queue" element={<DoctorQueuePage />} />
        <Route path="examination" element={<EntExaminationPage />} />
        <Route path="medical-records" element={<MedicalRecordDetailPage />} />
        <Route path="prescriptions" element={<PrescriptionFormPage />} />
      </Route>

      {/* 4. ADMIN AREA */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="permissions" element={<PermissionsAuditPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
