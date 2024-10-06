"use client";

import React, {useEffect, useState} from "react";
import Grid from "@/app/components/Grid";
import HowItWorksModal from "@/app/components/HowItWorksModal";
import {SquareData} from "@/model/squareData";

export default function LandingPage() {
    const [isHTWModalOpen, setIsHTWModalOpen] = useState(false);
    const [squares, setSquares] = useState<SquareData[]>([]);
    const [winnerSquares, setWinnerSquares] = useState<SquareData[]>([]);

    const openHTWModal = () => setIsHTWModalOpen(true);
    const closeHTWModal = () => setIsHTWModalOpen(false);

    const squareCount = 10000; // Set the desired number of squares to display
    const squareSize = 40;
    const gap = 3;

    const winnerSquareCount = squareCount / 500; // Set the desired number of squares to display
    const winnerSquareSize = 60;
    const winnerSquareGap = 3;

    const marginX = 15;

    useEffect(() => {
        const fetchSquares = async () => {
            const response = await fetch(`/api/squareDataHandler?start=1&end=${squareCount}`);
            if (response.ok) {
                const data: SquareData[] = await response.json();
                const squareMap = new Map(data.map(square => [square.id, square]));

                const fullSquares: SquareData[] = Array.from({length: squareCount}, (_, index) => {
                    const squareIndex = index + 1; // Ensure that indexing starts from 1 to 'count'
                    const existingSquare = squareMap.get(squareIndex);
                    return {
                        id: squareIndex, // Use 'squareIndex' to start from 1
                        isPurchased: existingSquare ? existingSquare.isPurchased : false,
                        imageUrl: existingSquare ? existingSquare.imageUrl : "",
                        redirectLink: existingSquare ? existingSquare.redirectLink : "",
                        title: existingSquare ? existingSquare.title : `Square ${squareIndex}`,
                    };
                });
                setSquares(fullSquares);
            }
        };
        fetchSquares();
    },[squareCount]);

    useEffect(() => {
        const fetchWinnerSquares = async () => {
            const response = await fetch(`/api/winnerSquareHandler`);
            if (response.ok) {
                const data: SquareData[] = await response.json();


                const unfilledWinnerSquares: SquareData[] = Array.from({length: winnerSquareCount - data.length}, (_, index) => {
                    const squareIndex = index + 1;
                    return {
                        id: squareIndex,
                        isPurchased: false,
                        imageUrl: "",
                        redirectLink: "",
                        title: `Square ${squareIndex}`,
                    };
                });
                setWinnerSquares([...data, ...unfilledWinnerSquares]);

            }
        };
        fetchWinnerSquares();
    },[winnerSquareCount]);


    return (
        <div className="flex flex-col gap-20 w-screen relative z-10">
            <div className="mx-2">
                <div className="mt-4 flex justify-between items-center">
                    <h1 className="font-bold text-3xl mb-1">Welcome to Mystery Square Club</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        onClick={openHTWModal}
                    >
                        How it works?
                    </button>
                </div>
                <p>Get more than just renting a square!</p>
            </div>

            {/* Render the Grid with the specified count */}
            <Grid count={winnerSquareCount} squareSize={winnerSquareSize} gap={winnerSquareGap} marginX={marginX}
                  winnerSquare={true} squareDataList={winnerSquares}/>
            <Grid count={squareCount} squareSize={squareSize} gap={gap} marginX={marginX}
                  winnerSquare={false} squareDataList={squares}/>

            {/* Render the HowItWorks Modal */}
            <HowItWorksModal isOpen={isHTWModalOpen} onClose={closeHTWModal}/>
        </div>
    );
}
