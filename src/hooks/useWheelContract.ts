import { Address, OpenedContract } from "@ton/ton";
import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { Wheel } from "../contracts/Wheel";
import { useTonConnect } from "./useTonConnect";
import { useNetworkConfig } from "./useNetworkConfig";

export function useWheelContract() {
    const client = useTonClient();
    const { sender } = useTonConnect();

    const [,,wheelAddress] = useNetworkConfig();

    type ContractStorageData = { 
        startedAt: number; 
        depositsCount: number; 
        totalDepositedAmount: bigint; 
        comissionAddress: Address;
        comissionPercent: number;
        deposits: any[]; 
    };
    const [contractData, setContractData] = useState<ContractStorageData>();
    const [contractBalance, setContractBalance] = useState<bigint>();
    

    const [wheelContract, setOpenedWheelContract] = useState<OpenedContract<Wheel>>();
    useEffect(() => {
        if (!client) return;
        const contract = new Wheel(wheelAddress);
        setOpenedWheelContract(client.open(contract));
    }, [client, wheelAddress])

    useEffect(() => {
        let intervalId: undefined | number;
        (async () => {

            if (!wheelContract) return;
            intervalId = setInterval(async () => {
                // setContractData(null);
                const data = await wheelContract.getStorageData();
                const balance = await wheelContract.getBalance();
                setContractData(data);
                setContractBalance(balance);
            }, 2000)
        })();
        return () => clearInterval(intervalId);
    }, [wheelContract])

    return {
        roundEnd: () => {
            return wheelContract?.sendTryEndRound(sender);
        },
        deposit: (amount: string | bigint, deposit_owner: Address) => {
            return wheelContract?.sendDeposit(sender, amount, deposit_owner);
        },
        address: wheelContract?.address.toString(),
        startedAt: contractData ? Number(contractData.startedAt) : undefined,
        totalDeposited: contractData?.totalDepositedAmount,
        contractBalance: contractBalance
    };
}