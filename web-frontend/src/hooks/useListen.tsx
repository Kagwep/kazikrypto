import { useMetaMask } from './useMetaMask'

function isAccountList(accounts: unknown): accounts is string[] {
  return (
    Array.isArray(accounts) &&
    accounts.every((account) => typeof account === 'string')
  )
}

export const useListen = () => {
  const { dispatch } = useMetaMask()


  console.log('hellooooooo')

  interface WalletState {
    accounts: any[],
    balance: string,
    chainId: string,
    address: string
  }

  const disconnectedState: WalletState = { accounts: [], balance: '', chainId: '', address: '' }


  return () => {
    window.ethereum?.on('accountsChanged', async (newAccounts: any) => {
      if (isAccountList(newAccounts) && newAccounts.length > 0) {
        // upon receiving a new wallet, we'll request the balance to synchronize the UI again.
        
        let accounts: any[] = [];
        try {
          accounts = newAccounts || await window.ethereum?.request(
            { method: 'eth_accounts' },
          )
        } catch (err) { }
    
        if (accounts.length === 0) {
          // If there are no accounts, then the user is disconnected
          disconnectedState
          return
        }
        
        const address: string = newAccounts[0]
        
        const newBalance = await window.ethereum!.request({
          method: 'eth_getBalance',
          params: [newAccounts[0], 'latest'],
        })

        const narrowedBalance = typeof newBalance === 'string' ? newBalance : ''

        const chainId: string = await window.ethereum?.request({
          method: 'eth_chainId',
        }) as string

        console.log("here",chainId)

        

        const connectedState: WalletState = { accounts: accounts, balance: narrowedBalance, chainId: chainId, address: address }
 
        dispatch({
          type: 'connect',
          wallet: newAccounts[0],
          balance: narrowedBalance,
          chainId:chainId,
          walletContainer:connectedState,
        })
      } else {
        // if the length is 0, then the user has disconnected from the wallet UI
     
        dispatch({ type: 'disconnect' })
      }
    })


  }
}
