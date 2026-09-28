
// import fs from 'fs'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// export function getProjectRoot(startDir: string = __dirname): string {
//   let current = path.resolve(startDir)

//   while (current !== path.parse(current).root) {
//     const pkgPath = path.join(current, 'package.json')
//     if (fs.existsSync(pkgPath)) {
//       return current
//     }
//     current = path.dirname(current)
//   }

//   throw new Error('Project root not found (no package.json in parent dirs)')
// }

// // Pre-compute once at startup
// export const PROJECT_ROOT = getProjectRoot()