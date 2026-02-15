
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import DeTiX from '../DeTiX.json';
import contractAddress from '../contract-address.json';
import { motion } from 'framer-motion';

const MyTickets = ({ account }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadTickets() {
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(contractAddress.address, DeTiX.abi, signer);

        try {
            const data = await contract.fetchMyNFTs();

            const items = await Promise.all(data.map(async i => {
                const tokenUri = await contract.tokenURI(i.tokenId);

                let meta = {
                    name: "Unknown Event",
                    description: "No description available",
                    image: "https://via.placeholder.com/150"
                };

                if (tokenUri.startsWith("data:application/json;base64,")) {
                    try {
                        const base64Data = tokenUri.split(",")[1];
                        const jsonString = atob(base64Data);
                        meta = { ...meta, ...JSON.parse(jsonString) };
                    } catch (err) { }
                } else if (tokenUri.startsWith("http")) {
                    try {
                        const response = await fetch(tokenUri);
                        const parsedMeta = await response.json();
                        meta = { ...meta, ...parsedMeta };
                    } catch (err) { }
                }

                let price = ethers.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId,
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.image,
                    name: meta.name,
                    description: meta.description,
                };
                return item;
            }));

            setTickets(items);
            setLoading(false);
        } catch (e) {
            console.error("Error loading my tickets:", e);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (account) {
            loadTickets();
        }
    }, [account]);

    if (!account) return <div>Please connect wallet to view your tickets.</div>;
    if (loading) return <div>Loading your tickets...</div>;
    if (!tickets.length) return <div>You do not own any tickets.</div>;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            className="event-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h2>My Tickets</h2>
            <motion.div
                className="grid"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {tickets.map((ticket, i) => (
                    <motion.div
                        key={i}
                        className="card"
                        variants={itemVariant}
                        whileHover={{ scale: 1.03, rotate: 1 }}
                    >
                        <div style={{ position: 'relative' }}>
                            <img src={ticket.image} alt={ticket.name} />
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: '#6366f1',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                Active Ticket
                            </div>
                        </div>
                        <div className="card-body">
                            <h3>{ticket.name}</h3>
                            <p>{ticket.description}</p>
                            <span className="card-price">Purchased for {ticket.price} ETH</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

export default MyTickets;
