const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const DeTiX = await hre.ethers.getContractFactory("DeTiX");
    const deTiX = await DeTiX.deploy();

    await deTiX.waitForDeployment();

    const address = await deTiX.getAddress();

    console.log(`DeTiX deployed to ${address}`);

    // Save address to frontend
    const config = {
        address: address
    }

    // write to frontend src
    fs.writeFileSync(
        "../frontend/src/contract-address.json",
        JSON.stringify(config, undefined, 2)
    );

    // Copy ABI to frontend
    const artifact = artifacts.readArtifactSync("DeTiX");
    fs.writeFileSync(
        "../frontend/src/DeTiX.json",
        JSON.stringify(artifact, undefined, 2)
    );

    // Initialize some data? 
    // Maybe not for now, keep it simple.
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
