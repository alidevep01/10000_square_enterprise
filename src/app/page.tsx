// src/app/page.tsx

import React from "react";
import Grid from "@/app/components/Grid";

export default function Home() {
    const squareCount = 10000; // Set the desired number of squares to display
    const squareSize = 40;
    const gap = 3;

    const winnerSquareCount = squareCount / 500; // Set the desired number of squares to display
    const winnerSquareSize = 60;
    const winnerSquareGap = 3;

    const marginX = 15;

    return (
        <div className="flex flex-col gap-20 w-screen overflow-x-hidden">
            <div className="mx-2">
                <div className="mt-4 flex justify-between items-center">
                    <h1 className="font-bold text-3xl mb-1">Welcome to Mystery Square Club</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                        Rules
                    </button>
                </div>
                <p>Get more than just renting a square!</p>
            </div>

            {/* Render the Grid with the specified count */}
            <Grid count={winnerSquareCount} squareSize={winnerSquareSize} gap={winnerSquareGap} marginX={marginX}/>
            <Grid count={squareCount} squareSize={squareSize} gap={gap} marginX={marginX}/>
        </div>
    );
}
