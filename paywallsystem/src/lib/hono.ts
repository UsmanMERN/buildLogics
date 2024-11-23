import { AppType } from '@/app/api/[[...route]]/route';
import { hc } from 'hono/client';

// Initialize Hono client for API interactions
export const client = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL!);
