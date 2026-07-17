class FileManager {
  private activeFile: File | null = null;

  setActiveFile(file: File) {
    this.activeFile = file;
  }

  getActiveFile(): File | null {
    return this.activeFile;
  }

  clearActiveFile() {
    this.activeFile = null;
  }
}

// Global instance to share file references between page transitions
export const fileManager = new FileManager();
