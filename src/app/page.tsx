// src/app/page.tsx

import React from "react";
import Grid from "@/app/components/Grid";

export default function Home() {
    const squareCount = 10000; // Set the desired number of squares to display
    const squareSize = 20;
    const gap = 2;

    const winnerSquareCount = squareCount/500; // Set the desired number of squares to display
    const winnerSquareSize = 40;
    const winnerSquareGap = 2;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
            <h1>Square Showcase</h1>
            {/* Render the Grid with the specified count */}
            <Grid count={winnerSquareCount} squareSize={winnerSquareSize} gap={winnerSquareGap}/>
            <Grid count={squareCount} squareSize={squareSize} gap={gap}/>
        </div>
    );
}
