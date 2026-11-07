export const UserRoles = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

