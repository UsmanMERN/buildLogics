// import { Context, Hono } from 'hono'
// import { handle } from 'hono/vercel'
// import {AuthConfig,initAuthConfig} from "@hono/auth-js"
// import authConfig from '@/auth.config'

// // routes

// import userRoutes from "@/app/api/[[...route]]/user"

// export const runtime = 'nodejs'

// function getAuthConfig(c:Context):AuthConfig{
//     return {
//         secret:process.env.AUTH_SECRET,
//         ...authConfig
//     }
// }

// const app = new Hono().basePath('/api')
// const routes=app.route("/users",userRoutes)

// app.use("*",initAuthConfig(getAuthConfig))

// export const GET = handle(app)
// export const POST = handle(app)
// export const PATCH = handle(app)
// export const DELETE = handle(app)

// export type AppType=typeof routes

import { Context, Hono } from 'hono';
import { handle } from 'hono/vercel';
import { AuthConfig, initAuthConfig } from '@hono/auth-js';
import userRoutes from '@/app/api/[[...route]]/user'; // Use a specific file for routes, not a dynamic path
import authConfig from '@/auth.config'; // Ensure this file contains valid config

export const runtime = 'nodejs';

// Get AuthConfig dynamically for middleware
function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET || 'default_secret', // Fallback for secret
    ...authConfig,
  };
}

// Initialize Hono app with base path
const app = new Hono().basePath('/api');

// Initialize middleware for authentication
app.use('*', initAuthConfig(getAuthConfig));

// Define routes under `/users`
app.route('/users', userRoutes);

// Export handler for all HTTP methods
export default handle(app);
