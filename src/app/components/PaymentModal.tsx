import React, { useState, useRef, useEffect } from "react";
import {MAX_FILE_SIZE} from "@/util/constants/constants";

interface PaymentModalProps {
    squareId: number;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({squareId, onClose}) => {
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [emailId, setEmailId] = useState("");
    const [redirectLink, setRedirectLink] = useState("");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        if(isLoading) return ;
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isLoading) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLoading, onClose]);

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

        setIsLoading(true);

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
                const responseJson = await response.json();

                if(response.ok) {
                    window.open(responseJson.paymentLink, "_blank");
                    onClose();
                }
                else {
                    const errorMessage = responseJson.error || "Failed to save square data";
                    setErrorMessages([errorMessage]);
                }

                console.log("Square Data Submitted Successfully!");
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "An error occurred while submitting square data.";
                console.log(errorMessage);
                setErrorMessages([errorMessage]);
            }
            finally {
                setIsLoading(false);
            }
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div ref={modalRef} className="text-black relative bg-white p-6 shadow-lg z-50 w-80 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Purchase Square #{squareId}</h2>

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 border rounded-md"
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full px-4 py-2 bg-blue-500 text-white rounded transition duration-300 flex items-center justify-center
                            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin mr-2 h-5 w-5"/>
                                Please Wait...
                            </>
                        ) : (
                            'Purchase for $12/year'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;