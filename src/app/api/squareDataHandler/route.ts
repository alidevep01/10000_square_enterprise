// src/app/api/squares/route.ts
import { NextResponse } from 'next/server';

// Define an interface for square data
interface SquareData {
    id: number;
    owner: string;
    imageUrl: string;
    redirectLink: string;
}

// Mock database for example purposes
const mockDatabase: { [key: number]: SquareData } = {
    1: { id: 1, owner: 'sairamk0@gmail.com', imageUrl: 'https://example.com/image1.jpg', redirectLink: 'https://google.com' },
    2: { id: 2, owner: 'user1@example.com', imageUrl: 'https://example.com/image2.jpg', redirectLink: 'https://example.com' },
    3: { id: 3, owner: 'user2@example.com', imageUrl: 'https://example.com/image3.jpg', redirectLink: 'https://example.org' },
    4: { id: 4, owner: 'user3@example.com', imageUrl: 'https://example.com/image4.jpg', redirectLink: 'https://example.net' },
    5: { id: 5, owner: 'user4@example.com', imageUrl: 'https://example.com/image5.jpg', redirectLink: 'https://example.co' },
};

// Fetch squares based on a range of IDs
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // Check if start and end parameters are provided
    if (!startParam || !endParam) {
        return NextResponse.json({ error: 'Both start and end parameters are required' }, { status: 400 });
    }

    const start = parseInt(startParam, 10);
    const end = parseInt(endParam, 10);

    const squares = await fetchSquaresFromDatabase(start, end);
    return NextResponse.json(squares);
}

// Save square data
export async function POST(request: Request) {
    const data: SquareData = await request.json();

    // Check if the square already exists
    if (mockDatabase[data.id]) {
        return NextResponse.json({ error: 'Square is already purchased' }, { status: 400 });
    }

    // Save square data to "database"
    const result = await saveSquareDataToDatabase(data);
    return NextResponse.json(result, { status: 201 });
}

// Fetch squares from mock database based on ID range
const fetchSquaresFromDatabase = async (start: number, end: number): Promise<SquareData[]> => {
    return Object.values(mockDatabase).filter(square => square.id >= start && square.id <= end);
};

// Save square data to "database"
const saveSquareDataToDatabase = async (data: SquareData) => {
    // Simulate saving to the database
    mockDatabase[data.id] = { id: data.id, owner: data.owner, imageUrl: data.imageUrl, redirectLink: data.redirectLink };
    return { message: 'Square data saved successfully' };
};
