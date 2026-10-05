import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // e2e tests spawn many git processes; Windows runners are slow at that.
    testTimeout: 30_000,
  },
});
