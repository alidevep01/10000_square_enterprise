import React, { useState } from "react";

interface PaymentModalProps {
    squareId: number;
    onClose: () => void; // Callback to close the modal
}

const PaymentModal: React.FC<PaymentModalProps> = ({ squareId, onClose }) => {
    // State to hold user inputs for title, imageUrl, emailId, and redirectLink
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [emailId, setEmailId] = useState("");
    const [redirectLink, setRedirectLink] = useState("");

    // State to hold error messages
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]); // Get the selected file
            setErrorMessages([]); // Clear error messages when a new file is selected
        }
    };

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
        return regex.test(email);
    };

    const isValidUrl = (url: string) => {
        const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/; // URL format regex
        return regex.test(url);
    };

    const handleSubmit = () => {
        // Reset error messages
        const errors: string[] = [];

        // Check if all fields are filled
        if (!title || !imageFile || !emailId || !redirectLink) {
            errors.push("Please fill in all fields."); // Show error if any field is empty
        }

        // Check for email format
        if (!isValidEmail(emailId)) {
            errors.push("Please enter a valid email address."); // Show error for invalid email
        }

        // Check for URL format
        if (!isValidUrl(redirectLink)) {
            errors.push("Please enter a valid URL."); // Show error for invalid URL
        }

        // Check file size (4MB)
        if (imageFile && imageFile.size > 4 * 1024 * 1024) {
            errors.push("Image file size should not exceed 4MB."); // Show error for large files
        }

        if (errors.length > 0) {
            setErrorMessages(errors); // Set error messages if there are any
            return;
        }

        // Convert image file to base64 or upload it to a server/S3 here
        const reader = new FileReader();
        reader.onloadend = () => {
            const squareData = {
                squareId,
                title,
                imageUrl: reader.result, // Base64 image data
                emailId,
                redirectLink,
            };
            console.log("Square Data Submitted: ", squareData);
            // Close the modal after submitting the data
            onClose();
        };
        reader.readAsDataURL(imageFile); // Convert to base64
    };

    return (
        <div style={modalStyle}>
            <h2>Purchase Square {squareId}</h2>

            <div style={formStyle}>
                <label style={labelStyle}>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle}
                        required // Mark as required
                    />
                </label>

                <label style={labelStyle}>
                    Upload Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={inputStyle}
                        required // Mark as required
                    />
                    <p style={infoStyle}>Image size should not exceed 4MB.</p> {/* Info message */}
                </label>

                <label style={labelStyle}>
                    Email ID:
                    <input
                        type="email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        style={inputStyle}
                        required // Mark as required
                    />
                </label>

                <label style={labelStyle}>
                    Redirect Link:
                    <input
                        type="text"
                        value={redirectLink}
                        onChange={(e) => setRedirectLink(e.target.value)}
                        style={inputStyle}
                        placeholder="e.g., https://google.com" // Sample placeholder
                        required // Mark as required
                    />
                </label>

                {/* Display error messages */}
                {errorMessages.length > 0 && (
                    <div style={errorContainerStyle}>
                        {errorMessages.map((error, index) => (
                            <p key={index} style={errorStyle}>
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                <div style={buttonContainerStyle}>
                    <button onClick={handleSubmit} style={buttonStyle}>
                        Submit
                    </button>
                    <button onClick={onClose} style={buttonStyle}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// Basic modal styling (you can adjust based on your needs)
const modalStyle = {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
    width: "300px",
    borderRadius: "8px",
};

const formStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
};

const labelStyle = {
    display: "flex",
    flexDirection: "column" as const,
    marginBottom: "10px",
};

const inputStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

const infoStyle = {
    fontSize: "12px",
    color: "gray",
};

const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between" as const,
};

const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
};

// Styles for error messages
const errorContainerStyle = {
    marginTop: "10px",
    marginBottom: "10px",
};

const errorStyle = {
    color: "red",
    fontSize: "14px",
};

export default PaymentModal;
