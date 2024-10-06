"use client"; // Mark this component as a client component

import Square from "@/app/components/Square";
import {SquareData} from "@/model/squareData";

interface GridProps {
    count: number;        // Total number of squares
    squareSize: number;   // Size of each square
    gap: number;          // Gap between squares
    marginX: number;      // Margin on the X-axis (left and right margins)
    winnerSquare: boolean;
    squareDataList: SquareData[];
}

export default function Grid({squareSize, gap, marginX, winnerSquare, squareDataList}: GridProps) {

    return (
        <div style={{
            ...scrollContainerStyle,
            maxHeight: `100vh`, // Set the height of the scrollable grid container
            marginLeft: `${marginX}px`, // Set left margin
            marginRight: `${marginX}px`, // Set right margin
        }}>
            <div style={{
                ...gridStyle,
                gridTemplateColumns: `repeat(auto-fill, ${squareSize}px)`,
                gap: `${gap}px`, // Set the gap between squareData
            }}>
                {squareDataList.map((squareData) => (
                    <Square key={squareData.id} data={squareData} squareSize={squareSize} winnerSquare={winnerSquare}/>
                ))}
            </div>
        </div>
    );
}

// Style for the scrollable container
const scrollContainerStyle: React.CSSProperties = {
    width: "100vw",         // Full-width container
};

// Style for the grid
const gridStyle = {
    display: "grid",
    alignItems: "center",
    padding: "0",          // No padding
    boxSizing: "border-box" as const,
};
