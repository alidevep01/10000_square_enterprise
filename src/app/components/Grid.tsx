// src/app/components/Grid.tsx

"use client"; // Mark this component as a client component

import React from "react";
import Square from "@/app/components/Square";
import {SquareData} from "@/model/SquareData";

interface GridProps {
    count: number;        // Total number of squares
    squareSize: number;   // Size of each square
    gap: number;          // Gap between squares
}

export default function Grid({count, squareSize, gap}: GridProps) {
    const squares: SquareData[] = Array.from({length: count}, (_, index) => ({ // dummy data
        id: index,
        imageUrl: "https://img.lovepik.com/free-png/20220124/lovepik-square-png-image_401707831_wh1200.png",
        redirectLink: "https://example.com",
        title: `Square ${index}`,
        isPurchased: false,
        description: "This is a square"
    }));

    return (
        <div style={{
            ...gridStyle,
            gridTemplateColumns: `repeat(auto-fill, ${squareSize}px)`,
            gap: `${gap}px` // Set the gap between squares
        }}>
            {squares.map((squareData) => (
                <Square key={squareData.id} data={squareData} squareSize={squareSize}/>
            ))}
        </div>
    );
}

const gridStyle = {
    display: "grid",
    width: "100vw",
    height: "100vh",
    padding: "0", // No padding
    boxSizing: "border-box" as const,
};
