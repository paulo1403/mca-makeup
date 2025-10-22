"use client";

import { motion } from "framer-motion";

interface FadeTransitionProps {
  position?: "top" | "bottom" | "both";
  intensity?: "light" | "medium" | "heavy";
  height?: number;
}

export default function FadeTransition({
  position = "both",
  intensity = "medium",
  height = 100,
}: FadeTransitionProps) {
  const getIntensityOpacity = () => {
    switch (intensity) {
      case "light":
        return 0.3;
      case "medium":
        return 0.6;
      case "heavy":
        return 0.9;
      default:
        return 0.6;
    }
  };

  const maxOpacity = getIntensityOpacity();

  return (
    <>
      {/* Fade Top */}
      {(position === "top" || position === "both") && (
        <motion.div
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{ height: `${height}px` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(180deg, 
                rgba(0, 0, 0, ${maxOpacity}) 0%, 
                rgba(0, 0, 0, ${maxOpacity * 0.7}) 20%, 
                rgba(0, 0, 0, ${maxOpacity * 0.4}) 50%, 
                rgba(0, 0, 0, ${maxOpacity * 0.1}) 80%, 
                transparent 100%
              )`,
            }}
          />
        </motion.div>
      )}

      {/* Fade Bottom */}
      {(position === "bottom" || position === "both") && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{ height: `${height}px` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(0deg, 
                rgba(0, 0, 0, ${maxOpacity}) 0%, 
                rgba(0, 0, 0, ${maxOpacity * 0.7}) 20%, 
                rgba(0, 0, 0, ${maxOpacity * 0.4}) 50%, 
                rgba(0, 0, 0, ${maxOpacity * 0.1}) 80%, 
                transparent 100%
              )`,
            }}
          />
        </motion.div>
      )}
    </>
  );
}
