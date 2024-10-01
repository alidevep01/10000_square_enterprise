// src/app/components/PaymentModal.tsx

import React, {useState} from "react";

interface PaymentModalProps {
    squareId: number;
    onClose: () => void; // Callback to close the modal
}

const PaymentModal: React.FC<PaymentModalProps> = ({squareId, onClose}) => {
    // State to hold user inputs for title, imageUrl, and redirectLink
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [redirectLink, setRedirectLink] = useState("");

    const handleSubmit = () => {
        // You can handle the form submission here, e.g., send the data to a server or update the square
        const squareData = {
            squareId,
            title,
            imageUrl,
            redirectLink,
        };
        console.log("Square Data Submitted: ", squareData);
        // Close the modal after submitting the data
        onClose();
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
                    />
                </label>

                <label style={labelStyle}>
                    Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={inputStyle}
                    />
                </label>

                <label style={labelStyle}>
                    Redirect Link:
                    <input
                        type="text"
                        value={redirectLink}
                        onChange={(e) => setRedirectLink(e.target.value)}
                        style={inputStyle}
                    />
                </label>

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

export default PaymentModal;
