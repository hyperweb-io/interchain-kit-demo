const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');

const privateKey = '0x0000000000000000000000000000000000000000000000000000000000000001';
const keyOfContractAddress = 'NEXT_PUBLIC_CONTRACT_ADDRESS';

async function main(): Promise<void> {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = new ethers.Wallet(privateKey, provider);

  const artifactPath = path.resolve(__dirname, "./contract.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const { abi, bytecode } = artifact;

  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("Contract deployed at:", contractAddress);

  const envFilePath = path.resolve(__dirname, "../../.env.local");
  let envContent = "";
  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, "utf-8");
  }

  const updatedContent = envContent
    .split("\n")
    .filter((line) => !line.startsWith(keyOfContractAddress))
    .join("\n");

  const finalEnvContent = updatedContent.trim() + `\n${keyOfContractAddress}=${contractAddress}\n`;

  fs.writeFileSync(envFilePath, finalEnvContent, "utf-8");
  console.log(`Updated .env.local with ${keyOfContractAddress}:`, contractAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});