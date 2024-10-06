import {NextResponse} from 'next/server';
import {prisma} from "@/util/prisma";
import {SquareData} from "@/model/squareData";

// Fetch winner squares
export async function GET() : Promise<NextResponse<SquareData[] | { error: string}>> {

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

    // console.log(squares);
    return NextResponse.json(formattedOutput);
}

// // POST function to handle incoming data
// export async function POST(request: Request) {
//
// }



