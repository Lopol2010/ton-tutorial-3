import { TonClient } from "@ton/ton";
import { useEffect, useState } from "react";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { getHttpEndpoint } from "@orbs-network/ton-access";


export function useTonClient() {
    return useAsyncInitialize(async () => {
        return new TonClient({ endpoint: await getHttpEndpoint({ network: 'testnet' }) })
    })
}