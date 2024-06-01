import { Address, OpenedContract } from "@ton/ton";
import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { Wheel } from "../contracts/Wheel";
import { useTonConnect } from "./useTonConnect";

const counterAddress = "EQC7Ac9V_cXCH1tb4i6n35OKFby1FLQbbCHQzRb10Gk-H-BU";
export function useWheelContract() {
    const client = useTonClient();
    const { sender } = useTonConnect();

    type ContractStorageData = { startedAt: bigint; depositsCount: bigint; totalDepositedAmount: bigint; deposits: any[]; };
    const [contractData, setContractData] = useState<ContractStorageData>();
    const [contractBalance, setContractBalance] = useState<bigint>();
    

    const [wheelContract, setOpenedWheelContract] = useState<OpenedContract<Wheel>>();
    useEffect(() => {
        if (!client) return;
        const contract = new Wheel(Address.parse(counterAddress));
        setOpenedWheelContract(client.open(contract));
    }, [client])

    useEffect(() => {
        let intervalId: undefined | number;
        (async () => {

            if (!wheelContract) return;
            intervalId = setInterval(async () => {
                // setContractData(null);
                const data = await wheelContract.getDeposits();
                const balance = await wheelContract.getBalance();
                setContractData(data);
                setContractBalance(balance);
            }, 2000)
        })();
        return () => clearInterval(intervalId);
    }, [wheelContract])

    return {
        roundEnd: () => {
            return wheelContract.sendEndRound(sender);
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