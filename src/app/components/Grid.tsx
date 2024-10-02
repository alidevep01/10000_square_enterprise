"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import Square from "@/app/components/Square";
import { SquareData } from "@/model/SquareData";

interface GridProps {
    count: number;        // Total number of squares
    squareSize: number;   // Size of each square
    gap: number;          // Gap between squares
}

export default function Grid({ count, squareSize, gap }: GridProps) {
    const [squares, setSquares] = useState<SquareData[]>([]);

    useEffect(() => {
        const fetchSquares = async () => {
            const response = await fetch(`/api/squareDataHandler?start=0&end=${count}`); // Adjust the API URL as necessary
            if (response.ok) {
                const data: SquareData[] = await response.json();
                const squareMap = new Map(data.map(square => [square.id, square]));

                // Create the full array of squares with default values
                const fullSquares: SquareData[] = Array.from({ length: count }, (_, index) => {
                    const existingSquare = squareMap.get(index);
                    return {
                        id: index,
                        isPurchased: existingSquare ? true : false,
                        imageUrl: existingSquare ? existingSquare.imageUrl : "https://img.lovepik.com/free-png/20220124/lovepik-square-png-image_401707831_wh1200.png",
                        redirectLink: existingSquare ? existingSquare.redirectLink : "https://example.com",
                        title: existingSquare ? existingSquare.title : `Square ${index}`,
                        description: existingSquare ? existingSquare.description : "This is a square",
                    };
                });
                console.log(fullSquares);

                setSquares(fullSquares);
            }
        };

        fetchSquares();
    }, [count]);

    return (
        <div style={{
            ...gridStyle,
            gridTemplateColumns: `repeat(auto-fill, ${squareSize}px)`,
            gap: `${gap}px` // Set the gap between squares
        }}>
            {squares.map((squareData) => (
                <Square key={squareData.id} data={squareData} squareSize={squareSize} />
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
