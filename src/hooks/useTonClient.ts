import { TonClient } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useEffect, useState } from "react";
import { useNetworkConfig } from "./useNetworkConfig";


export function useTonClient() {
    const [state, setState] = useState<TonClient>();
    const [isTestnet] = useNetworkConfig();
    useEffect(() => {
        (async () => {
            setState(new TonClient({ endpoint: await getHttpEndpoint({ network: isTestnet ? 'testnet' : 'mainnet' }) }))
        })()
    }, [isTestnet]);
    return state;
}