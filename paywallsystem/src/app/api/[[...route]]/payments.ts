import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
const app = new Hono()
    .post("/create-order", verifyAuth(), zValidator("json", z.object({
        planId: z.string()
    })),
        async (c) => {
            const session = c.get("authUser")
            if (!session?.token?.email) {
                return c.json({ error: "Unauthorized - Missing Email" }, 401);
            }
        }

    )
export default app 