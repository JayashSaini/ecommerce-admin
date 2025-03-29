export interface UserInterface {
	id: number;
	email: string;
	username: string;
	password: string;
	isEmailVerified: boolean;
	role: Role;
	loginType: LoginType;
	resetPasswordToken?: string;
	resetPasswordExpiry?: Date;
	emailVerificationToken?: string;
	emailVerificationExpiry?: Date;
	failedLoginAttempts: number;
	accountLockedUntil?: Date;
	status: Status;
	twoFactorAuthEnabled: boolean;
	createdAt: Date;
	updatedAt: Date;
	sessions?: UserSession[];
}

export interface AuthState {
	user: UserInterface | null;
	email: string | null;
}

export enum Role {
	USER = "USER",
	ADMIN = "ADMIN",
}

export enum Status {
	ACTIVE = "ACTIVE",
	BANNED = "BANNED",
	LOCKED = "LOCKED",
	INACTIVE = "INACTIVE",
	SUSPENDED = "SUSPENDED",
}

export enum LoginType {
	ID_PASSWORD = "ID_PASSWORD",
	GOOGLE = "GOOGLE",
}

export interface UserSession {
	id: string;
	userId: number;
	deviceInfo: string;
	ipAddress: string;
	lastActive: Date;
	isValid: boolean;
	refreshToken?: string;
	createdAt: Date;
	updatedAt: Date;
}
