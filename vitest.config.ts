import { defineConfig } from 'vitest/config'
import { addAliases} from './src/scripts/add-aliases'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'forks'
  },
  plugins: [addAliases()]
})