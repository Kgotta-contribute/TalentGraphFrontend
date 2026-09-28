export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        if (numPages === 1) {
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            if (context) {
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
            }

            await page.render({ canvasContext: context!, viewport }).promise;

            return new Promise((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const originalName = file.name.replace(/\.pdf$/i, "");
                            const imageFile = new File([blob], `${originalName}.png`, {
                                type: "image/png",
                            });

                            resolve({
                                imageUrl: URL.createObjectURL(blob),
                                file: imageFile,
                            });
                        } else {
                            resolve({
                                imageUrl: "",
                                file: null,
                                error: "Failed to create image blob",
                            });
                        }
                    },
                    "image/png",
                    0.95
                );
            });
        }

        // Handle multi-page PDFs by rendering each page and stitching them vertically
        const pageCanvases: { canvas: HTMLCanvasElement; width: number; height: number }[] = [];
        let maxWidth = 0;
        let totalHeight = 0;

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const pageCanvas = document.createElement("canvas");
            const pageContext = pageCanvas.getContext("2d");

            pageCanvas.width = viewport.width;
            pageCanvas.height = viewport.height;

            if (pageContext) {
                pageContext.imageSmoothingEnabled = true;
                pageContext.imageSmoothingQuality = "high";
            }

            await page.render({ canvasContext: pageContext!, viewport }).promise;
            pageCanvases.push({ canvas: pageCanvas, width: viewport.width, height: viewport.height });

            if (viewport.width > maxWidth) maxWidth = viewport.width;
            totalHeight += viewport.height;
        }

        const combinedCanvas = document.createElement("canvas");
        combinedCanvas.width = maxWidth;
        combinedCanvas.height = totalHeight;
        const combinedContext = combinedCanvas.getContext("2d");

        if (combinedContext) {
            combinedContext.fillStyle = "#ffffff";
            combinedContext.fillRect(0, 0, maxWidth, totalHeight);
            let currentY = 0;
            for (const item of pageCanvases) {
                const xOffset = (maxWidth - item.width) / 2;
                combinedContext.drawImage(item.canvas, xOffset, currentY);
                currentY += item.height;
            }
        }

        return new Promise((resolve) => {
            combinedCanvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create combined image blob",
                        });
                    }
                },
                "image/png",
                0.95
            );
        });
    } catch (err: any) {
        console.error("PDF conversion error:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err?.message || err}`,
        };
    }
}

export async function extractTextFromPdf(file: File): Promise<string> {
    try {
        const lib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str || "")
                .join(" ");
            fullText += `\n--- Page ${i} ---\n` + pageText;
        }

        return fullText.trim();
    } catch (err) {
        console.error("Failed to extract text from PDF:", err);
        return "";
    }
}