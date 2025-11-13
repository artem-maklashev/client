import { Toast, ToastContainer, ToastBody } from "react-bootstrap";
import { useEffect, useState } from "react";
import { set } from "date-fns";
interface ToastMessageProps {
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info';
    show: boolean;
    onClose?: () => void; // Добавьте callback для закрытия
}

const ToastMessage: React.FC<ToastMessageProps> = ({ message, type, show, onClose }) => {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        setShowToast(show);
    }, [show]);

    const handleClose = () => {
        if (onClose) {
            setShowToast(false);
            onClose();
        }
    };

    return (
        <ToastContainer
            className="p-3"
            position="bottom-end"
            style={{ zIndex: 1 }} // Увеличьте z-index
        >
            <Toast
                className="d-inline-block m-1"
                bg={type}
                show={showToast}
                onClose={handleClose}
                autohide
                delay={3000}
            >                
                <Toast.Body >
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastMessage;