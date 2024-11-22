import { config } from 'dotenv'
import {defineConfig} from 'drizzle-kit'

// config
config({path:".env.local"})

export default defineConfig({
    dialect:'postgresql',
    schema:"src/db/schema.ts",
    dbCredentials:{
        url:process.env.AUTH_DRIZZLE_URL!,
    },
    verbose:true,
    strict:true
})