import { Context, Hono } from 'hono';
import { handle } from 'hono/vercel';
import { AuthConfig, initAuthConfig } from '@hono/auth-js';
import authConfig from '@/auth.config';

// Import user routes
import userRoutes from '@/app/api/[[...route]]/user';
import * as dotenv from "dotenv";

export const runtime = 'nodejs';

dotenv.config();
// Function to initialize authentication configuration
function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    ...authConfig,
  };
}

// Create the main Hono app
const app = new Hono().basePath('/api');

// Middleware to initialize auth config for all routes
app.use('*', initAuthConfig(getAuthConfig));

// Define routes for user operations
const routes = app.route('/users', userRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;