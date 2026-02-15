import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Background Glow Effect */}
            <div className="glow-effect"></div>

            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="hero-title">DeTiX</h1>
                <h2 className="hero-subtitle">The Future of Event Access.</h2>

                <div className="hero-buttons">
                    <Link to="/events">
                        <motion.button
                            className="hero-btn"
                            whileHover={{ scale: 1.05, backgroundColor: "#C6A85A", color: "#000000", borderColor: "#C6A85A" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Events
                        </motion.button>
                    </Link>

                    <Link to="/create">
                        <motion.button
                            className="hero-btn"
                            whileHover={{ scale: 1.05, backgroundColor: "#C6A85A", color: "#000000", borderColor: "#C6A85A" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create Event
                        </motion.button>
                    </Link>

                    <Link to="/my-tickets">
                        <motion.button
                            className="hero-btn"
                            whileHover={{ scale: 1.05, backgroundColor: "#C6A85A", color: "#000000", borderColor: "#C6A85A" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            My Tickets
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
