import { createPublicClient, createWalletClient, custom, http } from "viem";
import Vote_Config from "../../blockchain/artifacts/contracts/Vote.sol/Vote.json";
import { hardhat } from "viem/chains";


export const Code = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const pClient = createPublicClient({
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});


export let wClient : ReturnType<typeof createWalletClient> | null = null; 

export const getWalletClient = () => {
  if (typeof window === "undefined") return null;
  if (!(window as any).ethereum) return null;

  if (!wClient) {
    wClient = createWalletClient({
      chain: hardhat,
      transport: custom((window as any).ethereum),
    });
  }

  return wClient;
};
getWalletClient()

export const getCandidates = async () => {
  const data = await pClient.readContract({
    abi: Vote_Config.abi,
    functionName: "getCandidates",
    address: Code,
  });

  return data as { name: string; count: bigint }[];
};

export const getCandidateCount = async () => {
  const data = await pClient.readContract({
    abi: Vote_Config.abi,
    functionName: "getCandidatescount",
    address: Code,
  });

  return Number(data);
};

export const getWinner = async () => {
  const data = await pClient.readContract({
    abi: Vote_Config.abi,
    functionName: "getWinner",
    address: Code,
  });

  return data as {name: string, count:number};
};


export const cast_vote = async (index: number) => {
  
  if (!wClient) {
    throw new Error("Wallet not available. Please install MetaMask.");
  }
  //@ts-ignore
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  await wClient.writeContract({
    account,
    abi: Vote_Config.abi,
    address: Code,
    functionName: "cast_vote",
    args: [index],
    chain: hardhat
  });
};

