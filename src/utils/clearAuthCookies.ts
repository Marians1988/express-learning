import { Response } from 'express';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../controllers/authApi/cookieOptions.js';
import {
  sessionCookieName,
  sessionCookieOptions,
} from '../config/session.config.js';

export const clearAuthCookies = (res: Response) => {
  res
    .clearCookie('token', accessTokenCookieOptions)
    .clearCookie('refreshToken', refreshTokenCookieOptions)
    .clearCookie(sessionCookieName, sessionCookieOptions);
};

export const clearAuthTokensCookie = (res: Response) => {
  res
    .clearCookie('token', accessTokenCookieOptions)
};
