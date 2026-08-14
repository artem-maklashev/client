import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Загружаем переменные из .env файлов (.env, .env.development, .env.production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // Позволяем Vite читать переменные как с префиксом VITE_, так и с REACT_APP_
    envPrefix: ['VITE_', 'REACT_APP_'],

    define: {
      // Подставляем подгруженные env-переменные в глобальный process.env для клиента
      'process.env': JSON.stringify(env),
    },

    server: {
      port: 3000,
    },

    build: {
      chunkSizeWarningLimit: 1000, // Лимит предупреждения 1MB
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Разделяем тяжелые зависимости на отдельные чанки
            if (id.includes('node_modules')) {
              if (id.includes('primereact') || id.includes('antd') || id.includes('bootstrap')) {
                return 'ui-vendor';
              }
              if (id.includes('recharts') || id.includes('chart.js')) {
                return 'charts-vendor';
              }
              if (id.includes('xlsx')) {
                return 'xlsx-vendor';
              }
              return 'vendor';
            }
          },
        },
      },
    },
  };
});