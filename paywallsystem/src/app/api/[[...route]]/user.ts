import { db } from '@/db/db';
import { users } from '@/db/schema';
import { verifyAuth } from '@hono/auth-js';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

// Create a Hono app for user routes
const app = new Hono();

app.get('/is-premium', verifyAuth(), async (c) => {
  try {
    // Retrieve authenticated user info from context
    const session = c.get('authUser');

    if (!session?.token?.email) {
      return c.json({ error: 'Unauthorized - Missing Email' }, 401);
    }

    // Query the database for the user based on email
    const [user] = await db.select().from(users).where(eq(users.email, session.token.email));

    if (!user) {
      return c.json({ error: 'Unauthorized - User Not Found' }, 404);
    }

    // Respond with the user's premium status
    return c.json({ isPremium: !!user.isPremium });
  } catch (error) {
    console.error('Error in isPremium API:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});
app.get("/user-data", verifyAuth(), async (c) => {
  try {
    const session = c.get("authUser");

    if (!session?.token?.email) {
      return c.json({ error: "Unauthorized - Missing Email" }, 401);
    }

    const [user] = await db.select().from(users).where(eq(users.email, session.token.email));

    if (!user) {
      return c.json({ error: "Unauthorized - User Not Found" }, 404);
    }

    // Return user data
    return c.json({ user });
  } catch (error) {
    console.error("Error in user-data API:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default app;
