export interface SquareData {
    id: number; // Unique identifier for the square
    description?: string; // Description for the square (optional)
    imageUrl?: string; // URL of the image (optional)
    redirectLink?: string;  // URL for the link (optional)
    title?: string; // Title for the card (optional)
    isPurchased: boolean; // Indicates if the square has been purchased
}


export interface SquareAPIData {
    id: number;
    owner: string;
    imageUrl: string;
    redirectLink: string;
}

// Example: Upload a file to the R2 bucket
export interface S3params {
    Bucket: string;
    Key: string;
    Body: Buffer;
    ContentType: string;
}