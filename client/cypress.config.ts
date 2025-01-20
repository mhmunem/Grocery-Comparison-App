import { defineConfig } from "cypress";
// import dotenv from "dotenv";

export default defineConfig({
    e2e: {
        baseUrl: "http://fullstack_client:5173/",
    },
});
