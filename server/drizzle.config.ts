    import { defineConfig } from "drizzle-kit";


    const env = process.env.NODE_ENV || 'dev'; 
    console.log("Running in environment:", env);

    const dbUrl = process.env[`${env.toUpperCase()}_DATABASE_URL`];
    console.log(dbUrl);

    if (!dbUrl) {
    throw new Error(`DATABASE_URL is not defined for the ${env} environment`);
    }

    export default defineConfig({
        dialect: 'postgresql',
        schema: './src/db/schema/*',
        dbCredentials: {
            url: dbUrl,
        },
        out: "./drizzle",
    })
