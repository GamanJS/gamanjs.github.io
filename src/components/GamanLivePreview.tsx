import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GamanLivePreview() {
  const [showFrame, setShowFrame] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[600px] overflow-clip border border-indigo-500/50 text-white rounded-lg shadow-lg shadow-indigo-300/10 bg-gradient-to-bl from-indigo-300/10 via-transparent to-transparent ">
      <AnimatePresence>
        {!showFrame && (
          <motion.button
            onClick={() => setShowFrame(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="px-8 py-4 text-lg font-semibold bg-indigo-500 hover:bg-indigo-400 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200"
          >
            Live Preview
          </motion.button>
        )}

        {showFrame && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <iframe
              src="https://codesandbox.io/embed/github/GamanJS/gaman-app?fontsize=14&hidenavigation=1&theme=dark&view=editor&file=/src/index.ts"
              className="w-full h-[600px]"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            ></iframe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
