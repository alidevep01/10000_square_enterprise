import {NextResponse} from 'next/server';
import {prisma} from "@/util/prisma";
import {SquareData} from "@/model/squareData";
import {redisCacheManager} from "@/util/redisClient";

// Fetch winner squares
export async function GET() : Promise<NextResponse<SquareData[] | { error: string}>> {

    const cacheKey = "WinnerSquares";

    // Try to get from cache
    const cachedData = await redisCacheManager.get(cacheKey);
    if (cachedData) {
        return NextResponse.json(JSON.parse(cachedData));
    }
    console.log("Winner Square data not found in redis, " +
        "falling back to calling DB");


    const winnerSquares = await prisma.winnerSquare.findMany({
        include: {
            square: {
                select: {
                    title: true,
                    imageUrl: true,
                    redirectLink: true,
                    isPurchased: true,
                },
            },
        },
    });

    const formattedOutput = winnerSquares.map(winnerSquare => ({
        id: winnerSquare.squareId,
        title: winnerSquare.square.title,
        imageUrl: winnerSquare.square.imageUrl,
        redirectLink: winnerSquare.square.redirectLink,
        isPurchased: winnerSquare.square.isPurchased,
    }));

    // Cache the new data
    redisCacheManager.set(cacheKey, JSON.stringify(formattedOutput), 60)
        .catch(error => console.error('Error caching winner square data:', error));

    // console.log(squares);
    return NextResponse.json(formattedOutput);
}

// // POST function to handle incoming data
// export async function POST(request: Request) {
//
// }



