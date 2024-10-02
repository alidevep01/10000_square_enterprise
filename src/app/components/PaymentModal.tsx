import React, {useState} from "react";

interface PaymentModalProps {
    squareId: number;
    onClose: () => void; // Callback to close the modal
}

const PaymentModal: React.FC<PaymentModalProps> = ({squareId, onClose}) => {
    // State to hold user inputs for title, imageUrl, redirectLink, and email
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [redirectLink, setRedirectLink] = useState("");
    const [emailId, setEmailId] = useState("");

    const [error, setError] = useState(""); // State to hold validation error message

    const handleSubmit = () => {
        // Validate that all fields are filled
        if (!title || !imageUrl || !redirectLink || !emailId) {
            setError("All fields are mandatory!");
            return;
        }

        // You can handle the form submission here, e.g., send the data to a server or update the square
        const squareData = {
            squareId,
            title,
            imageUrl,
            redirectLink,
            emailId,
        };
        console.log("Square Data Submitted: ", squareData);

        // Reset the error message
        setError("");

        // Close the modal after submitting the data
        onClose();
    };

    return (
        <div style={modalStyle}>
            <h2>Purchase Square {squareId}</h2>

            <div style={formStyle}>
                {error && <p style={errorStyle}>{error}</p>} {/* Display error if any */}

                <label style={labelStyle}>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </label>

                <label style={labelStyle}>
                    Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </label>

                <label style={labelStyle}>
                    Redirect Link:
                    <input
                        type="text"
                        value={redirectLink}
                        onChange={(e) => setRedirectLink(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </label>

                <label style={labelStyle}>
                    Email ID:
                    <input
                        type="email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        style={inputStyle}
                        required
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

const errorStyle = {
    color: "red",
    marginBottom: "10px",
};

export default PaymentModal;
