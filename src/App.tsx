import './App.css';
import { CHAIN, TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import '@twa-dev/sdk';
import { useWheelContract } from './hooks/useWheelContract';
import { useEffect, useState } from 'react';
import { Address, fromNano } from '@ton/core';
import { useNetworkConfig } from './hooks/useNetworkConfig';
import { useRoundTimer } from './hooks/useRoundTimer';

function isValidAddress(address: string) {
  return address.length > 0 && (Address.isFriendly(address) || Address.isRaw(address));
}

function App() {
  const [amount, setAmount] = useState("0.01");
  const { roundEnd, deposit, startedAt, totalDeposited, contractBalance } = useWheelContract();
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("")
  const { connected } = useTonConnect();
  const roundTimerString = useRoundTimer(startedAt);
  const [tonConnectUI] = useTonConnectUI();
  const tonWallet = useTonWallet();
  const [isTestnet, , ] = useNetworkConfig();

  useEffect(() => {
    return tonConnectUI.onStatusChange(wallet => {
      if (wallet) {
        if ((wallet.account.chain == CHAIN.TESTNET) != isTestnet) {
          tonConnectUI.disconnect();
          throw new Error("You connected wallet from network that differs from contract's network!");
        }
        setBeneficiaryAddress(Address.parse(wallet.account.address).toString());
      } else {
        setBeneficiaryAddress("");
      }
    })
  }, [tonConnectUI])

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        {/* <div className='Card'>
          <b>Contract Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div> */}

        <div className='Card'>
          <b>Round timer:</b>
          <div>{roundTimerString}</div>
        </div>
        <div className='Card'>
          <b>Total deposited amount: </b>
          <div>{totalDeposited && contractBalance ? `${fromNano(totalDeposited)} (actual balance: ${fromNano(contractBalance)})` : "0"}</div>
        </div>
        <div>
          {/* <button className={`Button ${isValidAddress(beneficiaryAddress) && connected ? 'Active' : 'Disabled'}`}
            onClick={() => { toggleTestnet() }}>
            toggle testnet {`${isTestnet} ${wheelAddress}`}
          </button> */}
          <button className={`Button ${isValidAddress(beneficiaryAddress) && connected ? 'Active' : 'Disabled'}`}
            onClick={() => { roundEnd() }}>
            Try end round
          </button>
          <button className={`Button ${isValidAddress(beneficiaryAddress) && connected ? 'Active' : 'Disabled'}`}
            onClick={() => { if (tonWallet) deposit(amount, Address.parse(tonWallet.account.address)) }}>
            Deposit
          </button>
        </div>
        <input type="text" className="Input"
          placeholder="Deposit amount (default: 0.01)"
          value={amount}
          onChange={e => setAmount(e.target.value)} />
        {/* <input type="text" className="Input"
          placeholder="Beneficiary address (default: your address)"
          value={beneficiaryAddress.toString()}
          onChange={e => { setBeneficiaryAddress(e.target.value); }} />
        {isValidAddress(beneficiaryAddress) || beneficiaryAddress.length == 0 ? "" : <b>"Incorrect address!"</b>} */}
      </div>
    </div>
  )
}

export default App
