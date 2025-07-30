import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // tus extensiones compat
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // configuración personalizada para reglas
    ...compat.config({
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            // También puedes poner "warn"
        },
    }),
];

export default eslintConfig;
