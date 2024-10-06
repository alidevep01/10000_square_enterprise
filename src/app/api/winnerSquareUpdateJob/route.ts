import {NextRequest, NextResponse} from 'next/server';
import {prisma} from "@/util/prisma";


// Fetch winner squares
export async function GET(request : NextRequest) {

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    const winnerSquareCount = await prisma.winnerSquare.count();
    const batchSize = 500;

    // If 20 winner squares are already assigned, return a message
    if (winnerSquareCount === 20) {
        return NextResponse.json({ message: "No free slots left in winner square grid, skipping." });
    }

    const batchStartIndex = winnerSquareCount * batchSize;

    // Fetch the purchased squares within the batch range, ordered by timestamp
    const purchasedSquares = await prisma.square.findMany({
        where: {
            isPurchased: true,
        },
        orderBy: {
            timestamp: 'asc',
        },
        select : {
            id: true
        },
        skip: batchStartIndex,
        take: batchSize,
    });

    // If the number of purchased squares is less than batch size
    if (purchasedSquares.length < batchSize) {
        return NextResponse.json({ message: `The next ${batchSize} squares are yet to be purchased.` });
    }

    // Select a random square from the purchased squares
    const randomIndex = Math.floor(Math.random() * purchasedSquares.length);
    const randomSquare = purchasedSquares[randomIndex];

    // Insert the random square into the WinnerSquare table
    await prisma.winnerSquare.create({
        data: {
            id: randomSquare.id,
            squareId: randomSquare.id,
        },
    });

    return NextResponse.json({
        message: `Square with ID ${randomSquare.id} added to the WinnerSquare table.`,
    });
}
