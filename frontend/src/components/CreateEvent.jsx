
import { useState } from 'react';
import { ethers } from 'ethers';
import DeTiX from '../DeTiX.json';
import contractAddress from '../contract-address.json';
import { motion } from 'framer-motion';

const CreateEvent = () => {
    const [formInput, updateFormInput] = useState({ price: '', supply: '', name: '', description: '' });

    async function createEvent() {
        const { name, description, price, supply } = formInput;
        if (!name || !description || !price || !supply) {
            alert("Please fill out all fields");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress.address, DeTiX.abi, signer);

            const ticketPriceWei = ethers.parseUnits(price, 'ether');

            // Metadata handling
            const metadata = JSON.stringify({
                name,
                description,
                image: "https://via.placeholder.com/350x150",
                price: price
            });
            const tokenURI = "data:application/json;base64," + btoa(metadata);

            // Calculate total listing fee: supply * listingPrice
            const platformListingFee = await contract.getListingPrice();
            const totalFee = BigInt(supply) * platformListingFee;

            // Force high gas limit to debug estimation errors
            const tx = await contract.createEventTickets(tokenURI, ticketPriceWei, supply, {
                value: totalFee.toString(),
                gasLimit: 10000000
            });

            await tx.wait();
            alert("Event created successfully! Please refresh or check the Explore page.");
        } catch (error) {
            console.error("Error creating event:", error);
            if (error.reason) alert("Error: " + error.reason);
            else alert("Error creating event: " + (error.data?.message || error.message));
        }
    }

    const container = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="create-event"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20 }}
        >
            <motion.h2 variants={item}>Create New Event</motion.h2>
            <div className="form-group">
                <motion.div variants={item}>
                    <label>Event Name</label>
                    <input
                        placeholder="e.g. Summer Music Festival"
                        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <label>Description</label>
                    <textarea
                        placeholder="Describe the event..."
                        rows="4"
                        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <label>Ticket Price (ETH)</label>
                    <input
                        placeholder="0.05"
                        step="0.001"
                        type="number"
                        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                </motion.div>

                <motion.div variants={item}>
                    <label>Total Supply</label>
                    <input
                        placeholder="100"
                        type="number"
                        onChange={e => updateFormInput({ ...formInput, supply: e.target.value })}
                    />
                </motion.div>

                <motion.button
                    onClick={createEvent}
                    style={{ marginTop: '1rem', width: '100%' }}
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Create Event
                </motion.button>
            </div>
        </motion.div>
    );
}

export default CreateEvent;
