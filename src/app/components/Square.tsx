"use client";

import React, {useState} from "react";
import {SquareData} from "@/model/squareData";
import PaymentModal from "@/app/components/PaymentModal";

interface SquareProps {
    data: SquareData;
    squareSize: number; // Size of each square
    winnerSquare?: boolean;
}

export default function Square({data, squareSize, winnerSquare}: SquareProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSquareId, setSelectedSquareId] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false); // State to track hover

    const handleSquareClick = () => {
        setIsHovered(false);
        if (!data.isPurchased) {
            if(winnerSquare) return;
            openPaymentModal(data.id); // Open modal if square is not purchased
        } else {
            window.open(data.redirectLink, "_blank"); // Open the link in a new tab if purchased
        }
    };

    const openPaymentModal = (squareId: number) => {
        setSelectedSquareId(squareId);
        setIsModalOpen(true); // Open the modal
    };

    const closePaymentModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)} // Set hover state
            onMouseLeave={() => setIsHovered(false)} // Reset hover state
            className="relative flex flex-col items-center"
        >
            {/* Hover popup */}
            {isHovered && (
                data.isPurchased ? (
                    <div
                        className="absolute -top-12 mb-2 bg-black text-white text-xs px-2 py-1 rounded-md opacity-90 shadow-md whitespace-nowrap inline-block max-w-xs"
                        style={{ left: '50%', transform: 'translateX(-50%)' }} // Center the popup above the square
                    >
                        <div>Square #{data.id}</div>
                        <div>{data.title}</div>
                    </div>
                ) : !winnerSquare ? ( // available for sale if not a winner square
                    <div
                        className="absolute -top-12 mb-2 bg-black text-white text-xs px-2 py-1 rounded-md opacity-90 shadow-md z-50 whitespace-nowrap inline-block max-w-xs"
                        style={{ left: '50%', transform: 'translateX(-50%)' }} // Center the popup above the square
                    >
                        <div>Available - Square #{data.id}</div>
                    </div>
                ) : null // Render nothing if showAvailable is false and the square is not purchased
            )}

            {/* The square itself */}
            <div
                onClick={handleSquareClick}
                style={{width: `${squareSize}px`, height: `${squareSize}px`}}
                className={`${data.isPurchased ? 'bg-white border-2 border-black' : 'bg-gray-300'} relative overflow-visible cursor-pointer`}
            >
                {data.isPurchased && (
                    <img
                        src={data.imageUrl}
                        alt={data.title}
                        style={{
                            width: "100%", // Make image fill the square
                            height: "100%",
                            objectFit: "contain", // Ensure the image is contained and not truncated
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    />
                )}
            </div>

            {/* Payment Modal */}
            {isModalOpen && selectedSquareId !== null && (
                <PaymentModal
                    squareId={selectedSquareId}
                    onClose={closePaymentModal}
                />
            )}
        </div>
    );
}
