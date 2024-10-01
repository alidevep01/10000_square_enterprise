"use client";

import React, {useState} from "react";
import {SquareData} from "@/model/SquareData";
import PaymentModal from "@/app/components/PaymentModal";

interface SquareProps {
    data: SquareData;
    squareSize: number;
}

export default function Square({data, squareSize}: SquareProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSquareId, setSelectedSquareId] = useState<number | null>(null);

    const handleSquareClick = () => {
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
                    width: `${squareSize}px`, // Adjust size as needed
                    height: `${squareSize}px`,
                    backgroundColor: data.isPurchased ? "transparent" : "grey",
                    backgroundImage: data.isPurchased ? `url(${data.imageUrl})` : "none",
                    backgroundSize: "cover",
                    cursor: "pointer",
                }}
            />

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
