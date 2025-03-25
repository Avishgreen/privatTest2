import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      mkcert({
        savePath: './certs', // save the generated certificate into certs directory
        force: true, // force generation of certs even without setting https property in the vite config
      }),
      react(),
    ],
    base: '/dashboard',
    define: {
      isDev: mode === 'development',
      isProd: mode === 'production',
      HOST: JSON.stringify(env.HOST) || 'http://localhost',
      MAX_UNPAID_REQUESTS: JSON.stringify(env.MAX_UNPAID_REQUESTS) || 3,
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunks/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks(id: string) {
            if (id.indexOf('node_modules') !== -1) {
              const basic = id.toString().split('node_modules/')[1];
              const sub1 = basic.split('/')[0];
              if (sub1 !== '.pnpm') {
                return `${sub1.toString()}-${Date.now()}`;
              }
              const name2 = basic.split('/')[1];
              return name2.split('@')[name2[0] === '@' ? 1 : 0].toString();
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@components': resolve(__dirname, './src/components'),
        '@modules': resolve(__dirname, './src/modules'),
        '@pages': resolve(__dirname, './src/pages'),
        '@assets': resolve(__dirname, './src/assets'),
        '@images': resolve(__dirname, './src/assets/images'),
        '@styles': resolve(__dirname, './src/assets/styles'),
        '@utils': resolve(__dirname, './src/utils'),
        '@constants': resolve(__dirname, './src/constants'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@stores': resolve(__dirname, './src/stores'),
        '@type': resolve(__dirname, './src/types'),
        '@services': resolve(__dirname, './src/services'),
        '@routing': resolve(__dirname, './src/routing'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `
            @use 'sass:color'; 
            @use "@styles/variables.scss" as *;
            @use "@styles/helpers.scss" as *;
          `,
        },
      },
    },
    server: {
      host: '0.0.0.0', // Указываем 0.0.0.0
      port: 3000,
      allowedHosts: ['rics-front-n-shunaev.amvera.io']
    },
  };
});
