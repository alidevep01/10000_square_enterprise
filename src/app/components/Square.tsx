"use client";

import React, {useState} from "react";
import {SquareData} from "@/model/SquareData";
import PaymentModal from "@/app/components/PaymentModal";

interface SquareProps {
    data: SquareData;
    squareSize: number; // Size of each square
}

export default function Square({data, squareSize}: SquareProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSquareId, setSelectedSquareId] = useState<number | null>(null);

    const handleSquareClick = () => {
        console.log("Square clicked:", data.title);
        if (!data.isPurchased) {
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
        <div>
            {/* The square itself */}
            <div
                onClick={handleSquareClick}
                style={{
                    width: `${squareSize}px`, // Set the square size
                    height: `${squareSize}px`,
                    // backgroundColor: data.isPurchased ? "transparent" : "grey",
                    backgroundColor: "grey",
                    position: "relative",
                    overflow: "hidden", // Hide overflow
                    cursor: "pointer",
                }}
            >
                {data.isPurchased && (
                    <img
                        src={data.imageUrl}
                        alt={data.title}
                        style={{
                            width: "100%", // Make image fill the square
                            height: "100%",
                            // objectFit: "cover", // Ensure the image covers the square without distortion
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
