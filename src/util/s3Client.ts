import AWS from "aws-sdk";
import {S3params} from "@/model/squareData";

const s3 = new AWS.S3({
    endpoint: process.env.CLOUD_FLAIR_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUD_FLAIR_R2_ACCESS_KEY_ID ?? '', // Your API Token
        secretAccessKey: process.env.CLOUD_FLAIR_R2_ACCESS_SECRET_ID ?? '' // Not needed since API token is present
    },
    region: 'auto',
    signatureVersion: 'v4',
});

export const uploadFileToS3 = async (params: S3params) => {
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err: { message: string; }, data: { Location: string; }) {
            if (err) {
                console.error("Error uploading data: ", err);
                reject(new Error("Failed to upload file to R2: " + err.message));
            } else {
                console.log("Successfully uploaded data to R2: ");
                resolve(data.Location); // Resolve with the location of the uploaded file
            }
        });
    });
};


// Function to fetch a file from S3
export const fetchFileFromS3 = async (bucketName: string, fileKey: string) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error("Error fetching data from S3: ", err);
                reject(new Error("Failed to fetch file from R2: " + err.message));
            } else {
                console.log("Successfully fetched data from R2");
                // Convert Buffer to string if the content is text
                const fileContent = data.Body?.toString('utf-8') || data.Body;
                resolve(fileContent); // Resolve with the file content
            }
        });
    });
};