import { config, isSupportedNetwork } from '../lib/config'
// import { useListen } from '../hooks/useListen'

export const useSwitchNetwork = () => {
  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID
  let networkId1 = import.meta.env.VITE_PUBLIC_NETWORK_ID
  // const listen = useListen()
  
  const switchNetwork = async () => {
    if(!isSupportedNetwork(networkId)) {
      throw new Error('Unsupported network')
    }
  
    await window.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: networkId,
          ...(config[networkId].blockExplorer ? {
            blockExplorerUrls: [config[networkId].blockExplorer]
          } : {}),
          chainName: config[networkId].name,
          nativeCurrency: {
            decimals: 18,
            name: config[networkId].name,
            symbol: config[networkId].symbol,
          },
          rpcUrls: [config[networkId].rpcUrl],
        },
      ],
    })

  

        // // Listen for network changes


  }



  return {
    switchNetwork
  }
}