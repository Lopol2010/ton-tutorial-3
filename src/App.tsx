import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useCounterContract } from './hooks/useCounterContract'
import { useTonConnect } from './hooks/useTonConnect'
import '@twa-dev/sdk';


function App() {
  const {counterValue, address, increment} = useCounterContract();
  const {connected} = useTonConnect();

  return (
      <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counterValue ?? 'Loading...'}</div>
        </div>
        <button className="Button" onMouseDown={ increment }>
          Increment
        </button>
        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            increment();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  )
}

export default App
