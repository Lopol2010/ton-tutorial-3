import './App.css';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import '@twa-dev/sdk';
import { useWheelContract } from './hooks/useWheelContract';
import { useEffect, useState } from 'react';
import { Address, fromNano } from '@ton/core';

function App() {
  const [amount, setAmount] = useState("0.01");
  const { address, roundEnd, deposit, startedAt, totalDeposited, contractBalance } = useWheelContract();
  const [depositOwner, setDepositOwner] = useState("")
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    return tonConnectUI.onStatusChange(wallet => {
      if (wallet)
        setDepositOwner(Address.parse(wallet.account.address).toString());
      else
        setDepositOwner("");
    })
  }, [tonConnectUI])

  function isValidAddress(address: string) {
    return address.length > 0 && (Address.isFriendly(address) || Address.isRaw(address));
  }
  function formatRoundTime() {
    if (totalDeposited && totalDeposited > 0n && startedAt && startedAt > 0) {
      const timePassed = Date.now() / 1000 - startedAt;
      return timePassed > 20 ? "round time elapsed" : timePassed;
    } else return 'Not started'
  }

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Round timer:</b>
          <div>{formatRoundTime()}</div>
        </div>
        <div className='Card'>
          <b>Total deposited amount: </b>
          <div>{totalDeposited && contractBalance ? `${fromNano(totalDeposited)} (actual balance: ${fromNano(contractBalance)})` : "0"}</div>
        </div>
        <div>
          <button className={`Button ${isValidAddress(depositOwner) && connected ? 'Active' : 'Disabled'}`}
            onClick={() => { roundEnd() }}>
            Try end round
          </button>
          <button className={`Button ${isValidAddress(depositOwner) && connected ? 'Active' : 'Disabled'}`}
            onClick={() => { deposit(amount, Address.parse(depositOwner)) }}>
            Deposit
          </button>
        </div>
        <input type="text" className="Input"
          placeholder="Deposit amount (default: 0.01)"
          value={amount}
          onChange={e => setAmount(e.target.value)} />
        <input type="text" className="Input"
          placeholder="Deposit owner address (default: your address)"
          value={depositOwner.toString()}
          onChange={e => { setDepositOwner(e.target.value); }} />
        {isValidAddress(depositOwner) || depositOwner.length == 0 ? "" : <b>"Incorrect address!"</b>}
      </div>
    </div>
  )
}

export default App
