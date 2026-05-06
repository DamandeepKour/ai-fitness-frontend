// src/components/Card.jsx

import { motion } from "framer-motion";

const Card = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-5 border border-gray-200"
    >
      {children}
    </motion.div>
  );
};

export default Card;