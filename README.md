# DeTiX - Decentralized Event Ticketing Platform

DeTiX is a decentralized application (DApp) for creating, buying, and reselling event tickets as NFTs (Non-Fungible Tokens). Built on the Ethereum blockchain, it ensures transparency, ownership, and secure secondary market trading for event tickets.

## 🚀 Features

-   **Create Events:** Organizers can mint event tickets as NFTs with specific prices and supplies.
-   **Buy Tickets:** Users can purchase tickets directly from the marketplace.
-   **Resell Tickets:** Ticket owners can list their tickets for resale on the secondary market.
-   **My Tickets:** Users can view their purchased tickets in a digital wallet.
-   **Event Dashboard:** A comprehensive view of all available events and tickets.

## 🛠 Tech Stack

### Frontend
-   **React:** UI library for building the interface.
-   **Vite:** Fast build tool and development server.
-   **Ethers.js:** Library for interacting with the Ethereum blockchain.
-   **Framer Motion:** For smooth animations and transitions.
-   **React Router:** For navigation within the app.

### Backend (Smart Contracts)
-   **Solidity:** Programming language for smart contracts.
-   **Hardhat:** Ethereum development environment for compiling, testing, and deploying contracts.
-   **OpenZeppelin:** Standard library for secure smart contracts (ERC721).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   [MetaMask](https://metamask.io/) browser extension (for interacting with the DApp)

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DeTix
```

### 2. Install Root Dependencies
The root directory contains the Hardhat backend dependencies.
```bash
npm install
```

### 3. Install Frontend Dependencies
Navigate to the frontend directory and install the React app dependencies.
```bash
cd frontend
npm install
```

---

## 🏃‍♂️ Running Locally

### 1. Start the Local Blockchain
In the root directory (or `backend` if you prefer, but ensure you have access to `node_modules`), start the local Hardhat node.
```bash
# From the root directory
npx hardhat node
```
*Keep this terminal running.*

### 2. Deploy Smart Contracts
Open a new terminal. Navigate to the `backend` directory to access the hardhat config and scripts.
```bash
cd backend
npx hardhat run scripts/deploy.js --network localhost
```
*Note the deployed contract address from the output. You may need to update it in your frontend configuration (usually in `frontend/src/config.js` or similar) if it's not automated.*

### 3. Start the Frontend
Navigate to the `frontend` directory and start the development server.
```bash
cd ../frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Configuration

### MetaMask Setup
1.  Open MetaMask and add a new network manually.
2.  **Network Name:** Localhost 8545
3.  **RPC URL:** `http://127.0.0.1:8545/`
4.  **Chain ID:** `31337` (Hardhat default)
5.  **Currency Symbol:** ETH
6.  Import one of the predefined accounts from the `npx hardhat node` terminal using its private key to have test ETH.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License
This project is licensed under the ISC License.
