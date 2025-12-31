// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

/**
 * Electron API를 renderer 프로세스에 안전하게 노출
 */
contextBridge.exposeInMainWorld('electron', {
  /**
   * 파일 다운로드 다이얼로그 열기
   * @param defaultPath - 기본 다운로드 경로
   * @param fileName - 기본 파일명
   * @returns 선택한 파일 경로 또는 null (취소 시)
   */
  showSaveDialog: async (defaultPath: string, fileName: string): Promise<string | null> => {
    return await ipcRenderer.invoke('show-save-dialog', defaultPath, fileName);
  },
  
  /**
   * 파일 다운로드
   * @param url - 다운로드할 파일 URL
   * @param filePath - 저장할 파일 경로
   * @returns 성공 여부
   */
  downloadFile: async (url: string, filePath: string): Promise<boolean> => {
    return await ipcRenderer.invoke('download-file', url, filePath);
  },
});