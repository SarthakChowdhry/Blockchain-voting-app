import { useEffect, useState } from "react";
import { cast_vote, getCandidates, getWinner, pClient, wClient } from "./eth";
import { Button } from "./components/ui/button";
import Vote_Config from "../../blockchain/artifacts/contracts/Vote.sol/Vote.json";

export default function App() {
  const [Canditates, setCanditates] = useState<Array<{name:string, count:bigint}>>([]);
  const [winner, setWinner] = useState<{name: string,count: number} | null>(null);

  async function refresh() {
    const [c, w] = await Promise.all([
      getCandidates(),
      getWinner(),
    ]);

    setCanditates(c);
    setWinner(w);
}

  useEffect(() => {
    const unwatch = pClient.watchContractEvent({
      abi: Vote_Config.abi,
      onLogs: (_logs) => {
        refresh()
      },
    })

    return () => unwatch()
  }, [])

  useEffect(()=>{
    refresh()
  }, [])

  return (
    <div className="h-screen bg-background text-foreground p-6 flex flex-col gap-6 mx-30">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Voting Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Live results from the smart contract
        </p>
        <p>
          Winning: {winner ? winner.name : "Unknown"}
        </p>
      </div>
      <div className="flex justify-between h-full items-center mb-50">
        {Canditates.map((entry, i) => {
          return <div key={i} className="mr-15 flex flex-col w-[40%]">
            <div className="w-full flex items-center justify-center text-lg">
              <div className="flex items-center justify-center flex-col">
                <h1>{entry.name}</h1>
                <h1 className="text-3xl mt-5">{entry.count}</h1>
              </div>
            </div>
            <Button onClick={() => cast_vote(i)} className="bg-[#D270FF] mt-5" disabled={!wClient}>{!wClient ? "No wallet found": "Vote!"}</Button>
          </div>  
        })}
      </div>
    </div>
  );
}