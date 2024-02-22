import React, { useEffect } from "react";

interface ClosingAlertProps {
    onClose: () => void;
    text: string;
    type: string;
}

const ClosingAlert = ({ onClose, text, type }: ClosingAlertProps) => {
    useEffect(() => {
        const appElement = document.getElementById("app");
        if (appElement) {
            appElement.classList.add("blur-20");
            appElement.classList.add("z-0");
        }
    }, []);

    let alertColorClass = '';
    switch (type) {
        case 'error':
            alertColorClass = 'bg-red-400';
            break;
        case 'warning':
            alertColorClass = 'bg-pink-400';
            break;
        case 'success':
            alertColorClass = 'bg-green-400';
            break;
        default:
            alertColorClass = 'bg-gray-400';
            break;
    }

    return (
        <div className={`${alertColorClass} z-50 fixed top-0 left-0 right-0 buttom-0 mx-auto w-1/2 h-1/7 flex items-center justify-center`}>
           <div className={`text-white px-6 py-4 border-0 rounded relative mb-4`}>
                <button className="absolute top-0 left-0 mt-4 mr-6 text-lg" onClick={onClose}>
                    <span>X</span>
                </button>
                <span className="text-xl inline-block mr-5 align-middle">
                    <i className="fas fa-bell" />
                </span>
                <span className="inline-block align-middle mr-8">
                   {text}
                </span>
            </div>
        </div>
    );
};

export default ClosingAlert;
