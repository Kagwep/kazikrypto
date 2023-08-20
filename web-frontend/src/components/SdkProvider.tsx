import { PropsWithChildren, useEffect } from "react";
import { useListen } from "../hooks/useListen";
import { useMetaMask } from "../hooks/useMetaMask";
import { instantiateSdk } from "../lib/metamaskSDK";
import { useSwitchNetwork } from "~/hooks/useSwitchNetwork";

function isAccountList(accounts: unknown): accounts is string[] {
  return (
    Array.isArray(accounts) &&
    accounts.every((account) => typeof account === "string")
  );
}

export const SdkLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;
  const { dispatch } = useMetaMask();
  const listen = useListen();
  const { switchNetwork } = useSwitchNetwork();
  interface WalletState {
    accounts: any[];
    balance: string;
    chainId: string;
    address: string;
  }

  const disconnectedState: WalletState = {
    accounts: [],
    balance: "",
    chainId: "",
    address: "",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";

      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetaMaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      if (ethereumProviderInjected) {
        // Check if the Ethereum provider is MetaMask
        const isMetaMaskInstalled = Boolean(window.ethereum.isMetaMask);

        const local = window.localStorage.getItem("metamaskState");

        if (isMetaMaskInstalled) {
          window.ethereum.on("chainChanged", async (newChain: any) => {
            if (networkId == newChain > 0) {
              instantiateSdk();
              dispatch({
                type: "connect",
                wallet,
                balance,
                chainId: newChain,
                walletContainer,
              });
              listen();
            } else {
              const newAccounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });

              // Update your wallet state with the new wallet value
              const newWallet = newAccounts[0]; // Assuming the first account is the user's wallet

              console.log("hey", newWallet);
              instantiateSdk();
              dispatch({
                type: "connect",
                wallet: newWallet,
                balance,
                chainId: newChain,
                walletContainer,
              });
              listen();
            }
            // For example, you might want to update UI components that display the network ID.
          });
        }
      }

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance, chainId, walletContainer } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null, chainId: null, walletContainer: null };

      instantiateSdk();
      dispatch({
        type: "pageLoaded",
        isMetaMaskInstalled,
        wallet,
        balance,
        chainId,
        walletContainer,
      });
    }
  }, []);

  return <div>{children}</div>;
};
