/**
 * Authentication Types
 * Type definitions for auth-related data structures
 */

export interface User {
  id: number;
  email: string;
  name: string;
  profile_picture: string;
  email_verified: boolean;
  blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: string;
  type: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
    is_admin: boolean;
  };
  message: string;
}

export interface GoogleVerifyPayload {
  id_token: string;
  device_type: 'mobile' | 'web' | 'desktop';
}

export interface RefreshTokenPayload {
  refresh_token: string;
  device_type: 'mobile' | 'web' | 'desktop';
}

