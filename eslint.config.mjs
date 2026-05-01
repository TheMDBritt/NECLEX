// Flat config — extends Next defaults via the eslint-config-next package.
// Kept lightweight to avoid the @eslint/eslintrc shim. We add stricter rules later.

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];

export default config;
