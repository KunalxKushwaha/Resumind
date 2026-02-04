// export interface PdfConversionResult {
//     imageUrl: string;
//     file: File | null;
//     error?: string;
// }

// let pdfjsLib: any = null;
// let isLoading = false;
// let loadPromise: Promise<any> | null = null;

// async function loadPdfJs(): Promise<any> {
//     if (pdfjsLib) return pdfjsLib;
//     if (loadPromise) return loadPromise;

//     isLoading = true;
//     loadPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((lib) => {
//         // Set the worker source to use local file
//         lib.GlobalWorkerOptions.workerSrc =
//   "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs";

//         pdfjsLib = lib;
//         isLoading = false;
//         return lib;
//     });

//     return loadPromise;
// }

// export async function convertPdfToImage(
//     file: File
// ): Promise<PdfConversionResult> {
//     try {
//         const lib = await loadPdfJs();

//         const arrayBuffer = await file.arrayBuffer();
//         const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
//         const page = await pdf.getPage(1);

//         const viewport = page.getViewport({ scale: 4 });
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         canvas.width = viewport.width;
//         canvas.height = viewport.height;

//         if (context) {
//             context.imageSmoothingEnabled = true;
//             context.imageSmoothingQuality = "high";
//         }

//         await page.render({ canvasContext: context!, viewport }).promise;

//         return new Promise((resolve) => {
//             canvas.toBlob(
//                 (blob) => {
//                     if (blob) {
//                         // Create a File from the blob with the same name as the pdf
//                         const originalName = file.name.replace(/\.pdf$/i, "");
//                         const imageFile = new File([blob], `${originalName}.png`, {
//                             type: "image/png",
//                         });

//                         resolve({
//                             imageUrl: URL.createObjectURL(blob),
//                             file: imageFile,
//                         });
//                     } else {
//                         resolve({
//                             imageUrl: "",
//                             file: null,
//                             error: "Failed to create image blob",
//                         });
//                     }
//                 },
//                 "image/png",
//                 1.0
//             ); // Set quality to maximum (1.0)
//         });
//     } catch (err) {
//         return {
//             imageUrl: "",
//             file: null,
//             error: `Failed to convert PDF: ${err}`,
//         };
//     }
// }

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = Promise.all([
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
  ]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default;
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  if (typeof window === "undefined") {
    return {
      imageUrl: "",
      file: null,
      error: "Must run in browser",
    };
  }

  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 3 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Canvas context failed",
      };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({ canvasContext: context, viewport }).promise;

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/png", 1)
    );

    if (!blob) {
      return {
        imageUrl: "",
        file: null,
        error: "toBlob failed",
      };
    }

    return {
      imageUrl: URL.createObjectURL(blob),
      file: new File([blob], file.name.replace(/\.pdf$/i, ".png"), {
        type: "image/png",
      }),
    };
  } catch (err) {
    console.error("PDF → Image conversion error:", err);
    return {
      imageUrl: "",
      file: null,
      error: String(err),
    };
  }
}
