"use client";

import React, {useState} from "react";
import Grid from "@/app/components/Grid";
import HowItWorksModal from "@/app/components/HowItWorksModal";

export default function LandingPage() {
    const [isHTWModalOpen, setIsHTWModalOpen] = useState(false);

    const openHTWModal = () => setIsHTWModalOpen(true);
    const closeHTWModal = () => setIsHTWModalOpen(false);

    const squareCount = 10000; // Set the desired number of squares to display
    const squareSize = 40;
    const gap = 3;

    const winnerSquareCount = squareCount / 500; // Set the desired number of squares to display
    const winnerSquareSize = 60;
    const winnerSquareGap = 3;

    const marginX = 15;

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
                  winnerSquare={true}/>
            <Grid count={squareCount} squareSize={squareSize} gap={gap} marginX={marginX} winnerSquare={false}/>

            {/* Render the HowItWorks Modal */}
            <HowItWorksModal isOpen={isHTWModalOpen} onClose={closeHTWModal}/>
        </div>
    );
}
