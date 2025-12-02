import jwt from 'jsonwebtoken';
import {Request} from 'express';

export interface UserPayload {
    id: string;
    merchantId: string;
    iat?: number; // issued at
    exp?: number; // expiration time
}

export interface AuthenticatedRequest extends Request {
    user: UserPayload;
}

export class JWTUtils {
    private static getSecret(): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        return secret;
    }

    static generateToken(payload: AuthenticatedRequest): { accessToken: string; refreshToken: string } {
        const secret = this.getSecret();
        const accessTokenExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
        const refreshTokenExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '14d') as jwt.SignOptions['expiresIn'];

        const options: jwt.SignOptions = {
            issuer: process.env.JWT_ISSUER || 'express-micro',
        };
        const accessToken = jwt.sign(
            payload,
            secret,
            {
                ...options,
                expiresIn: accessTokenExpiresIn
            }
        );
        const refreshToken = jwt.sign(
            payload,
            secret,
            {
                ...options,
                expiresIn: refreshTokenExpiresIn
            }
        );

        return {accessToken, refreshToken};
    }

    static verifyToken(token: string): AuthenticatedRequest {
        const secret = this.getSecret();

        const decoded = jwt.verify(token, secret, {
            issuer: process.env.JWT_ISSUER || 'express-micro',
        }) as jwt.JwtPayload & AuthenticatedRequest;
        if (!decoded?.user?.id) {
            throw new Error('Invalid token payload: missing id');
        }
        try {
            return decoded;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error(`Invalid token: ${error.message}`);
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token has expired');
            }
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Token verification failed');
        }
    }

    static decodeToken(token: string): AuthenticatedRequest | null {
        try {
            const decoded = jwt.decode(token) as jwt.JwtPayload & AuthenticatedRequest;
            if (decoded && typeof decoded === 'object' && 'id' in decoded && typeof decoded.id === 'number') {
                return decoded;
            }
            return null;
        } catch {
            return null;
        }
    }

    // New: Check if token is about to expire
    static isTokenExpiringSoon(token: string, thresholdMinutes: number = 30): boolean {
        const payload = this.decodeToken(token);
        const user = payload?.user;
        if (!user || !user.exp) return true;
        const now = Math.floor(Date.now() / 1000);
        const threshold = thresholdMinutes * 60;
        return user.exp - now <= threshold;
    }

    // New: Refresh token
    static refreshToken(token: string): { accessToken: string; refreshToken: string } {
        const payload = this.verifyToken(token);
        return this.generateToken(payload);
    }
}
