import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-2xl text-white font-medium flex items-center gap-3"
                >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
