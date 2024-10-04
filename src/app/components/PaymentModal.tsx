import React, {useState} from "react";
import {MAX_FILE_SIZE} from "@/util/constants/constants";

interface PaymentModalProps {
    squareId: number;
    onClose: () => void; // Callback to close the modal
}

const PaymentModal: React.FC<PaymentModalProps> = ({squareId, onClose}) => {
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [emailId, setEmailId] = useState("");
    const [redirectLink, setRedirectLink] = useState("");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]);
            setErrorMessages([]);
        }
    };

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isValidUrl = (url: string) => {
        const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
        return regex.test(url);
    };

    const handleSubmit = async () => {
        const errors: string[] = [];

        if (!title || !imageFile || !emailId || !redirectLink) {
            errors.push("Please fill in all fields.");
        }

        if (!isValidEmail(emailId)) {
            errors.push("Please enter a valid email address.");
        }

        if (!isValidUrl(redirectLink)) {
            errors.push("Please enter a valid URL.");
        }

        if (imageFile && imageFile.size > MAX_FILE_SIZE) {
            errors.push("Image file size should not exceed 4MB.");
        }

        if (errors.length > 0) {
            setErrorMessages(errors);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const squareData = {
                id: squareId,
                title,
                imageUrl: reader.result,
                redirectLink,
                owner: emailId,
            };
            console.log(squareData);

            try {
                const response = await fetch("/api/squareDataHandler", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(squareData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to save square data");
                }

                console.log("Square Data Submitted Successfully!");
                onClose();
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "An error occurred while submitting square data.";
                console.log(errorMessage);
                setErrorMessages([errorMessage]);
            }
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay to dim the background */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Modal Content */}
            <div className="relative bg-white p-6 shadow-lg z-50 w-80 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Purchase Square #{squareId}</h2>

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </label>

                    <label className="flex flex-col">
                        Upload Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="p-2 border rounded-md"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Image size should not exceed 4MB.</p>
                    </label>

                    <label className="flex flex-col">
                        Email ID:
                        <input
                            type="email"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </label>

                    <label className="flex flex-col">
                        Redirect Link:
                        <input
                            type="text"
                            value={redirectLink}
                            onChange={(e) => setRedirectLink(e.target.value)}
                            className="p-2 border rounded-md"
                            placeholder="e.g., https://google.com"
                            required
                        />
                    </label>

                    {errorMessages.length > 0 && (
                        <div className="mt-2 mb-2">
                            {errorMessages.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                            Submit
                        </button>
                        <button onClick={onClose}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
