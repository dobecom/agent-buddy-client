declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: {
      showSaveDialog: (defaultPath: string, fileName: string) => Promise<string | null>;
      downloadFile: (url: string, filePath: string) => Promise<boolean>;
    };
  }
}

export {};
