import React from "react";
import PageTitle from "./Typography/PageTitle";

interface ModalProps {
    show: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    cardComponent: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, onSubmit, title, cardComponent }) => {
    return (
        <>
            {show && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="bg-gray-50 dark:bg-gray-500 flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <PageTitle>{title}</PageTitle>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={onClose}
                                    >
                                    </button>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    {cardComponent}
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={onSubmit}
                                    >
                                        {title}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    );
};

export default Modal;