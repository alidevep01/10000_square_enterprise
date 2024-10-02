import {NextResponse} from 'next/server';
// import AWS from 'aws-sdk';
import {SquareAPIData} from "@/model/SquareData";

// Configure AWS S3
// const s3 = new AWS.S3({
//     endpoint: 'https://<your-region>.digitaloceanspaces.com', // Replace with your DigitalOcean Spaces endpoint
//     accessKeyId: process.env.SPACES_ACCESS_KEY, // Your Spaces access key
//     secretAccessKey: process.env.SPACES_SECRET_KEY, // Your Spaces secret key
// });

// Mock database for example purposes
const mockDatabase: { [key: number]: SquareAPIData } = {
    1: {
        id: 1,
        owner: 'sairamk0@gmail.com',
        imageUrl: 'https://example.com/image1.jpg',
        redirectLink: 'https://google.com'
    },
    2: {
        id: 2,
        owner: 'user1@example.com',
        imageUrl: 'https://example.com/image2.jpg',
        redirectLink: 'https://example.com'
    },
    3: {
        id: 3,
        owner: 'user2@example.com',
        imageUrl: 'https://example.com/image3.jpg',
        redirectLink: 'https://example.org'
    },
    4: {
        id: 4,
        owner: 'user3@example.com',
        imageUrl: 'https://example.com/image4.jpg',
        redirectLink: 'https://example.net'
    },
    5: {
        id: 5,
        owner: 'user4@example.com',
        imageUrl: 'https://example.com/image5.jpg',
        redirectLink: 'https://example.co'
    },
};

// Fetch squares based on a range of IDs
export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // Check if start and end parameters are provided
    if (!startParam || !endParam) {
        return NextResponse.json({error: 'Both start and end parameters are required'}, {status: 400});
    }

    const start = parseInt(startParam, 10);
    const end = parseInt(endParam, 10);

    const squares = await fetchSquaresFromDatabase(start, end);
    return NextResponse.json(squares);
}

// POST function to handle incoming data
export async function POST(request: Request) {
    try {
        // Parse the incoming JSON data
        const squareData = await request.json();

        // Validate required fields
        const {id, title, imageUrl, emailId, redirectLink, owner} = squareData;
        if (!id || !title || !imageUrl || !emailId || !redirectLink || !owner) {
            return NextResponse.json({error: 'Required fields are absent'}, {status: 400});
        }

        // Check if the square already exists
        if (mockDatabase[id]) {
            return NextResponse.json({error: 'Square is already purchased, please try another one!'}, {status: 400});
        }


        // Save the square data to the "database"
        await saveSquareDataToDatabase(squareData);

        // Return a success response
        return NextResponse.json({message: 'Square data submitted successfully'}, {status: 201});
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request.';
        return NextResponse.json({error: errorMessage}, {status: 500});
    }
}


// Fetch squares from mock database based on ID range
const fetchSquaresFromDatabase = async (start: number, end: number): Promise<Omit<SquareAPIData, 'owner'>[]> => {
    return Object.values(mockDatabase)
        .filter(square => square.id >= start && square.id <= end)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({owner, ...square}) => square); // Exclude the owner property
};

// Save square data to "database"
const saveSquareDataToDatabase = async (data: SquareAPIData) => {
    // Simulate saving to the database
    mockDatabase[data.id] = data;
    return {message: 'Square data saved successfully'};
};

// Update square data with image URL
// const updateSquareDataWithImageUrl = async (id: number, imageUrl: string): Promise<{ message: string }> => {
//     // Check if the square exists in the database
//     if (mockDatabase[id]) {
//         // Update the imageUrl of the existing square
//         mockDatabase[id].imageUrl = imageUrl;
//         return { message: 'ImageUrl updated successfully' };
//     } else {
//         throw new Error('Square not found in the database');
//     }
// };

