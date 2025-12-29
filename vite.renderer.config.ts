import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  // 환경 변수 접두사: VITE_로 시작하는 변수만 클라이언트 코드에서 접근 가능
  envPrefix: 'VITE_',
});
