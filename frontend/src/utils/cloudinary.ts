/**
 * Optimizes a Cloudinary URL by injecting transformation parameters.
 * @param url The original Cloudinary image URL.
 * @param options Transformation options like width, height, and crop.
 * @returns The optimized URL string.
 */
export const getOptimizedImageUrl = (
    url: string,
    options: { width?: number; height?: number; crop?: string; quality?: string } = {}
) => {
    if (!url || !url.includes("res.cloudinary.com")) return url;

    const { width, height, crop = "fill", quality = "auto" } = options;

    // Split the URL to find the upload segment
    const parts = url.split("/upload/");
    if (parts.length !== 2) return url;

    // Build transformation string
    let transformations = `q_${quality},f_auto`;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
    if (width || height) transformations += `,c_${crop}`;

    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};
