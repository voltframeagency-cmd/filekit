import { ImageToPdfItem } from "./types";

export class ImageToPdfPreflight {
  static async inspectFile(file: File): Promise<{
    isValid: boolean;
    mimeType?: "image/jpeg" | "image/png";
    width?: number;
    height?: number;
    error?: string;
  }> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let mimeType: "image/jpeg" | "image/png" | undefined;

    // JPEG Magic Bytes (FF D8 FF)
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      mimeType = "image/jpeg";
    }
    // PNG Magic Bytes (89 50 4E 47)
    else if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
      mimeType = "image/png";
    }

    if (!mimeType) {
      return {
        isValid: false,
        error: "UNSUPPORTED_INPUT_FORMAT: Selected file is not a supported JPEG or PNG image."
      };
    }

    // Extract width and height from image Blob
    try {
      const dimensions = await this.getImageDimensions(file);
      return {
        isValid: true,
        mimeType,
        width: dimensions.width,
        height: dimensions.height
      };
    } catch {
      return {
        isValid: false,
        error: "MALFORMED_IMAGE: Could not decode image dimensions."
      };
    }
  }

  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && typeof createImageBitmap === "function") {
        createImageBitmap(file)
          .then((bmp) => {
            const width = bmp.width;
            const height = bmp.height;
            bmp.close();
            resolve({ width, height });
          })
          .catch(() => {
            this.fallbackImageDimensions(file).then(resolve).catch(reject);
          });
      } else {
        this.fallbackImageDimensions(file).then(resolve).catch(reject);
      }
    });
  }

  private static fallbackImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        URL.revokeObjectURL(url);
        resolve({ width, height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image decode failed"));
      };
      img.src = url;
    });
  }
}
