import { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const sessionCookieName = 'sid';

export const sessionCookieOptions: CookieOptions = {
  secure: isProduction,
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 1000 * 60 * 60,
  path: '/',
};
