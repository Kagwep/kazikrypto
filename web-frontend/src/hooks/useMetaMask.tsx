import React, { type PropsWithChildren } from 'react'


interface WalletState {
  accounts: any[],
  balance: string,
  chainId: string,
  address: string
}

type ConnectAction = { type: 'connect'; wallet: string; balance: string; chainId: string; walletContainer:WalletState }
type DisconnectAction = { type: 'disconnect' }
type PageLoadedAction = {
  type: 'pageLoaded'
  isMetaMaskInstalled: boolean
  wallet: string | null
  balance: string | null
  chainId: string | null
  walletContainer:WalletState
}
type AccountChanged = {
  type: 'accountChanged'
  isMetaMaskInstalled: boolean
  wallet: string | null
  balance: string | null
  chainId: string | null
  walletContainer:WalletState
}
type LoadingAction = { type: 'loading' }
type IdleAction = { type: 'idle' }

type Action =
  | ConnectAction
  | DisconnectAction
  | PageLoadedAction
  | LoadingAction
  | IdleAction
  | AccountChanged

type Dispatch = (action: Action) => void

type Status = 'loading' | 'idle' | 'pageNotLoaded'

// const disconnectedState: WalletState = { accounts: [], balance: '', chainId: '', address: '' }



type State = {
  wallet: string | null
  isMetaMaskInstalled: boolean
  status: Status
  balance: string | null
  chainId: string | null
  walletContainer:WalletState
}



const initialState: State = {
  wallet: null,
  isMetaMaskInstalled: false,
  status: 'loading',
  balance: null,
  chainId:null,
  walletContainer:null,
} as const


console.log(initialState);

/**
 * It takes in a state and an action, and returns a new state
 * @param {State} state - State - the current state of the reducer
 * @param {Action} action - This is the action that is being dispatched.
 * @returns The state of the metamask reducer.
 */
function metamaskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'connect': {
      const { wallet, balance, chainId , walletContainer } = action
      console.log(wallet, balance, chainId , walletContainer)
      const newState = { ...state, wallet, balance, status: 'idle' ,chainId , walletContainer } as State

      const info = JSON.stringify(newState)
      window.localStorage.setItem('metamaskState', info)

      return newState
    }
    case 'disconnect': {
      window.localStorage.removeItem('metamaskState')
      if (typeof window.ethereum !== undefined) {
        window.ethereum.removeAllListeners('accountsChanged')
      }
      return { ...state, wallet: null, balance: null , chainId : null , walletContainer : null }
    }
    case 'pageLoaded': {
      const { isMetaMaskInstalled, balance, wallet , chainId , walletContainer } = action
      console.log(isMetaMaskInstalled, balance, wallet , chainId , walletContainer)
      return { ...state, isMetaMaskInstalled, status: 'idle', wallet, balance, chainId , walletContainer }
    }
    case 'accountChanged': {
      const { isMetaMaskInstalled, balance, wallet , chainId , walletContainer } = action
      console.log(isMetaMaskInstalled, balance, wallet , chainId , walletContainer)
      return { ...state, isMetaMaskInstalled, status: 'idle', wallet, balance, chainId , walletContainer }
      
    }
    case 'loading': {
      return { ...state, status: 'loading' }
    }
    case 'idle': {
      return { ...state, status: 'idle' }
    }

    default: {
      throw new Error('Unhandled action type')
    }
  }
}

/**
 * It creates a context object, and then returns a provider component that wraps the children and
 * provides the context value
 * @param {PropsWithChildren}  - PropsWithChildren<{}>
 */
const MetaMaskContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function MetaMaskProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = React.useReducer(metamaskReducer, initialState)
  const value = { state, dispatch }

  return (
    <MetaMaskContext.Provider value={value} >
      {children}
    </MetaMaskContext.Provider>
  )
}

/**
 * It returns the value of the MetaMaskContext
 * @returns The context object.
 */
function useMetaMask() {
  const context = React.useContext(MetaMaskContext)
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider')
  }
  return context
}

export { MetaMaskProvider, useMetaMask }
