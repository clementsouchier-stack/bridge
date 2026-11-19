import { defineConfig } from "vite";import {fileURLToPath,URL} from "node:url";
export default defineConfig({resolve:{alias:{"~":fileURLToPath(new URL("./src/bridge-commons",import.meta.url)),"@bridge-types":fileURLToPath(new URL("./src/bridge-types.ts",import.meta.url))}},build:{outDir:"dist"}});
