import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { NextAuthConfig } from './../node_modules/next-auth/lib/index.d';
import GitHub from "next-auth/providers/github";
import { db } from './db/db';

export default {
    adapter:DrizzleAdapter(db),
    providers:[GitHub({
clientId:process.env.GITHUB_CLIENT_ID,
clientSecret:process.env.GITHUB_CLIENT_SECRET,

    })],
    session:{
        strategy:"jwt"
    }
} satisfies NextAuthConfig