import { TonClient } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useEffect, useState } from "react";


export function useTonClient() {
    const [state, setState] = useState<TonClient>();
    useEffect(() => {
        (async () => {
            setState(new TonClient({ endpoint: await getHttpEndpoint({ network: 'testnet' }) }))
        })()
    }, []);
    return state;
}