import sharp from "sharp";

export async function compressImage(buffer: Buffer, sizeLimit: number) {
    let outputBuffer = buffer;

    let quality = 100; // Start with 100%
    // Loop to reduce the quality until the buffer is below 1MB
    while (outputBuffer.length > sizeLimit && quality > 10) { // 1MB in bytes
        quality -= 5; // Reduce quality in steps
        console.log(`Compressing to ${quality}%`);
        outputBuffer = await sharp(buffer)
            .png({quality})
            .toBuffer();
        console.log(`After ${outputBuffer.length}`);
    }

    return outputBuffer;
}