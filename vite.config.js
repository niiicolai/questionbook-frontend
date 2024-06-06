import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const htmlImport = {
  name: "htmlImport",
  /**
   * Stackoverflow: https://stackoverflow.com/questions/67330947/vite-cannot-handle-xxx-html-files
   * Checks to ensure that a html file is being imported.
   * If it is then it alters the code being passed as being a string being exported by default.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path. 
   * @returns {{code: string}}
   */
  transform(code, id) {
    if (/^.*\.html$/g.test(id)) {
      code = `export default \`${code}\``
    }
    return { code }
  }
}

// vite.config.js
export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist'
  },
  server: {
    open: true,
    port: 3000,
  },
  plugins: [htmlImport],
})
