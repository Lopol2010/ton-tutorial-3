import { Address, TonClient, beginCell, toNano } from "@ton/ton";
import { useEffect, useState } from "react";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useTonClient } from "./useTonClient";
import { Counter } from "../contracts/Counter";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useTonConnect } from "./useTonConnect";

const counterAddress = "EQAQSCG0cIanpjYw9COWx8KxvquK7QEZQmBW_RRxCpscCOu7";
export function useCounterContract() {
    const client = useTonClient();
    const tonConnectUI = useTonConnect();
    const [counterValue, setCounterValue] = useState<null | number>();

    const counterContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new Counter(Address.parse(counterAddress));
        return client.open(contract);
    }, [client])

    useEffect(() => {
        let intervalId: undefined | number;
        async function getCounterValue() {

            if (!counterContract) return;
            intervalId = setInterval(async () => {
                setCounterValue(null);
                const counterValue = await counterContract.getCounter();
                setCounterValue(Number(counterValue));
            }, 5000)
        }
        getCounterValue();
        return () => clearInterval(intervalId);
    }, [counterContract])

    return {
        counterValue,
        increment: async () => {
            await counterContract?.sendIncrement(tonConnectUI.sender);
        },
        address: counterContract?.address.toString()
    };
}