import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger" 
}) => {
    if (!isOpen) return null;

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { scale: 0.9, opacity: 0, y: 20 },
        visible: { scale: 1, opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        className="relative bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-white"
                    >
                        <h3 className="text-xl font-bold mb-2">{title}</h3>
                        <p className="text-gray-300 mb-6">{message}</p>

                        <div className="flex gap-3 justify-end">
                            <Button 
                                variant="ghost" 
                                onClick={onClose}
                                className="hover:bg-white/10 text-white"
                            >
                                {cancelText}
                            </Button>
                            <Button 
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={type === "danger" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
