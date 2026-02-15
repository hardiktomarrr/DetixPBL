
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import DeTiX from '../DeTiX.json';
import contractAddress from '../contract-address.json';

import { motion } from 'framer-motion';

const EventList = ({ account }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize provider and contract
    // Note: In a real app, move this to a context or hook
    async function loadTickets() {
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Contract initialization
        const contract = new ethers.Contract(contractAddress.address, DeTiX.abi, signer);

        try {
            const data = await contract.fetchMarketItems();

            const items = await Promise.all(data.map(async i => {
                const tokenUri = await contract.tokenURI(i.tokenId);

                let meta = {
                    name: "Unknown Event",
                    description: "No description available",
                    image: "https://via.placeholder.com/150"
                };

                // Decode Metadata
                if (tokenUri.startsWith("data:application/json;base64,")) {
                    try {
                        const base64Data = tokenUri.split(",")[1];
                        const jsonString = atob(base64Data);
                        const parsedMeta = JSON.parse(jsonString);
                        meta = { ...meta, ...parsedMeta };
                    } catch (err) {
                        console.error("Error parsing metadata for token", i.tokenId, err);
                    }
                } else if (tokenUri.startsWith("http")) {
                    try {
                        const response = await fetch(tokenUri);
                        const parsedMeta = await response.json();
                        meta = { ...meta, ...parsedMeta };
                    } catch (err) {
                        console.error("Error fetching metadata URL", tokenUri, err);
                    }
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
            console.error("Error loading tickets:", e);
            setLoading(false);
        }
    }

    async function buyTicket(ticket) {
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress.address, DeTiX.abi, signer);

        const price = ethers.parseUnits(ticket.price.toString(), 'ether');

        try {
            const transaction = await contract.createMarketSale(ticket.tokenId, {
                value: price
            });
            await transaction.wait();
            loadTickets(); // Reload
            alert("Ticket purchased successfully!");
        } catch (error) {
            console.error("Purchase failed", error);
            alert("Purchase failed: " + (error.data?.message || error.message));
        }
    }

    useEffect(() => {
        if (account) {
            loadTickets();
        }
    }, [account]);

    if (!account) return <div>Please connect wallet to view events.</div>;
    if (loading) return <div>Loading events...</div>;
    if (!tickets.length) return <div>No tickets available in marketplace.</div>;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="event-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h2>Upcoming Events</h2>
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
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div style={{ position: 'relative' }}>
                            <img src={ticket.image} alt={ticket.name} />
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.7)',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                #{ticket.tokenId}
                            </div>
                        </div>
                        <div className="card-body">
                            <h3>{ticket.name}</h3>
                            <p>{ticket.description}</p>
                            <span className="card-price">{ticket.price} ETH</span>
                            <motion.button
                                onClick={() => buyTicket(ticket)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Buy Ticket
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

export default EventList;
