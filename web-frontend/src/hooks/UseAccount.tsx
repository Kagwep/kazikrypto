import React, { createContext, useContext, useState } from "react";

interface AccountIdContextType {
  accountId: string | null;
  setAccountId: (newAccountId: string | null) => void;
}

const AccountIdContext = createContext<AccountIdContextType>({
  accountId: null,
  setAccountId: () => {},
});

export function useAccountId() {
  return useContext(AccountIdContext);
}

export function AccountIdProvider({ children }) {
  const [accountId, setAccountId] = useState<string | null>(null);

  return (
    <AccountIdContext.Provider value={{ accountId, setAccountId }}>
      {children}
    </AccountIdContext.Provider>
  );
}
