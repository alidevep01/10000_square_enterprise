import {NextResponse} from 'next/server';
import {prisma} from "@/util/prisma";
import {CheckoutCustomData, S3params, SquareData} from "@/model/squareData";
import {CLOUD_FAIR_R2_BUCKET_NAME} from "@/util/constants/constants";
import {uploadFileToS3} from "@/util/s3Client";
import {createPaymentLink} from "@/util/lemonSquizyClient";

// Fetch squares based on a range of IDs
export async function GET(request: Request) : Promise<NextResponse<SquareData[] | { error: string}>> {
    const {searchParams} = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // Check if start and end parameters are provided
    if (!startParam || !endParam) {
        return NextResponse.json({error: 'Both start and end parameters are required'}, {status: 400});
    }

    const start = parseInt(startParam, 10);
    const end = parseInt(endParam, 10);

    const squares = await prisma.square.findMany({
        where: {
            id: {
                gte: start,
                lte: end,
            },
        },
        select: {
            id: true,
            title: true,
            imageUrl: true,
            redirectLink: true,
            isPurchased: true
        },
    });
    // console.log(squares);
    return NextResponse.json(squares);
}

// POST function to handle incoming data
export async function POST(request: Request) {
    try {
        // Parse the incoming JSON data
        const squareData = await request.json();

        // Validate required fields
        const {id, title, imageUrl, redirectLink, owner} = squareData;
        if (!id || !title || !imageUrl || !redirectLink || !owner) {
            return NextResponse.json({error: 'Required fields are absent'}, {status: 400});
        }

        // Check if the square already exists in the database
        const existingSquare = await prisma.square.findUnique({
            where: {id}
        });

        // Check if the square already exists
        const paymentCutOffTime = 10*60*1000;
        if(existingSquare) {
            if (existingSquare.isPurchased) {
                return NextResponse.json({error: 'Square is already purchased, please try another one.'}, {status: 400});
            } else if(Date.now() - new Date(existingSquare.timestamp).getTime() < paymentCutOffTime){
                // Buffer period for the owner to buy the square.
                return NextResponse.json({error: 'Square is being purchased by another customer, please try another one.'},
                    {status: 400});
            }
            else {
                await prisma.square.delete(
                    {
                        where: {id}
                    }
                );
                // no need to delete from S3 since the image gets replaced
            }
        }

        const customCheckoutData: CheckoutCustomData = {
            squareId: id,
        }

        const paymentLinkPromise = createPaymentLink(customCheckoutData);

        // Prepare the image data for uploading
        const [metaData, base64Image] = imageUrl.split(','); // Split into metadata and base64
        const buffer = Buffer.from(base64Image, 'base64');

        // Extract the content type from the metadata
        const contentTypeMatch = metaData.match(/data:(.*?);base64/);
        const contentType = contentTypeMatch ? contentTypeMatch[1] : 'image/png'; // Default to png if not found

        const fileExtension = contentType.split('/')[1]; // Get the extension after the slash

        const key = `squares/${id}.${fileExtension}`;
        // Upload the image file to S3
        const s3Params: S3params = {
            Bucket: CLOUD_FAIR_R2_BUCKET_NAME, // Replace with your bucket name
            Key: key, // Specify the file name and path
            Body: buffer,
            ContentType: contentType, // Adjust based on your image type
        };

        await uploadFileToS3(s3Params);

        // Save the square data to the "database"
        // Save the new square data using Prisma
        await prisma.square.create({
            data: {
                id,
                title,
                // imageUrl: `${CLOUD_FAIR_R2_BUCKET_URL}/squares/${id}.${fileExtension}`,
                imageUrl: `/${key}`,
                redirectLink,
                owner,
                isPurchased: false,
                timestamp: new Date().toISOString()
            },
        });

        const paymentLink = await paymentLinkPromise;

        if(paymentLink == undefined) {
            return NextResponse.json({error: 'Unable to fetch payment Link, please try again.'}, {status: 400});
        }

        // Return a success response
        return NextResponse.json({paymentLink: paymentLink}, {status: 201});
    } catch (error) {
        const errorMessage = 'An error occurred while processing your request, please try again.';
        console.log(error instanceof Error ? error.message : "");
        return NextResponse.json({error: errorMessage}, {status: 500});
    }
}



