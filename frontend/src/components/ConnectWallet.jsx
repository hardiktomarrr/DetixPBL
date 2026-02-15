
import { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

const ConnectWallet = ({ setAccount }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            try {
                const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
                accountChangedHandler(result[0]);
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    const accountChangedHandler = async (newAccount) => {
        setDefaultAccount(newAccount);
        setAccount(newAccount);
        await getBalance(newAccount);
    }

    const getBalance = async (address) => {
        const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [address, "latest"]
        });
        setUserBalance(ethers.formatEther(balance));
    }

    return (
        <div className="connect-wallet">
            {defaultAccount ? (
                <div className="account-info">
                    <div>{defaultAccount.slice(0, 6)}...{defaultAccount.slice(-4)}</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{Number(userBalance).toFixed(4)} ETH</div>
                </div>
            ) : (
                <motion.button
                    className="wallet-btn"
                    onClick={connectWalletHandler}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Connect Wallet
                </motion.button>
            )}

            {errorMessage && (
                <div style={{ position: 'absolute', top: '80px', right: '20px', background: 'red', padding: '10px', borderRadius: '5px' }}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default ConnectWallet;
