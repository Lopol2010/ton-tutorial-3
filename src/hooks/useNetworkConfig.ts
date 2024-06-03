import { Address } from "@ton/ton";
import { useState } from "react";
import { networkConfig } from "../networkConfig";

const getWheelAddress = (isTestnet: boolean) => Address.parse(networkConfig[isTestnet ? "testnet" : "mainnet"].wheelAddress);

export function useNetworkConfig(): [boolean, () => void, Address] {
    const [isTestnet, toggleTestnet] = useState<boolean>(networkConfig.defaultNetwork === "testnet");
    const [wheelAddress, setWheelAddress] = useState<Address>(
        () => getWheelAddress(isTestnet)
    );
    return [isTestnet, () => {
        toggleTestnet(value => {
            const _isTestnet = !value;
            setWheelAddress(getWheelAddress(_isTestnet))
            return _isTestnet;
        });
    }, wheelAddress];
}