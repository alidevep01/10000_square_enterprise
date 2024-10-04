"use client";

import React from "react";

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowItWorksModal({isOpen, onClose}: RulesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md lg:max-w-2xl mx-4 sm:mx-0 sm:w-1/2 lg:w-1/3">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">How it works?</h2>
                <p className="mb-6 text-xs sm:text-sm lg:text-base">
                    <strong>The usual part:</strong> <br/>
                    <div className="ml-2">
                        - The grid contains 10,000 squares + 20 bigger squares (more about them later!). <br/>
                        - Each of the 10,000 squares is available for rent at $12 per year. <br/>
                        - When you rent a square, you can add a title, your own image, and link it to your
                        website. <br/>
                        - No account is required to rent a square - it&#39;s quick and easy! <br/>
                        - You can buy as many squares as you want! <br/>
                        - Your rented square becomes a tiny billboard in our digital landscape. <br/>
                        - Once purchased, the square content cannot be changed. <br/>
                        - It&#39;s a fun way to promote your brand, personal site, and a chance to win something
                        more! <br/>
                        - Please note: Gambling and adult sites are not allowed. <br/><br/>
                    </div>
                    <div className="ml-2">
                        <strong>The interesting part:</strong> <br/>
                        - For every 500 squares bought, a square is chosen randomly and added to one of the bigger
                        squares.
                        (The first 20 bigger squares you see on the page.) <br/>
                        - <strong>The owner of the chosen square wins $1000!</strong> We will reach out via email and
                        pay
                        you. <br/>
                    </div>
                </p>
                <div className="flex justify-center">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
