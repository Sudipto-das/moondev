
  
  import React, { useState, useEffect } from 'react';
  import BurnButtonBar from './BurnButtonBar';
  import BurnStats from './BurnStats';
  import TransactionTable from './TransactionTable';
  import { useWallet, useAppSupplies, useAppToast, useEthersSigner } from './hooks'; // Import your custom hooks
  
  const BurnPage = () => {
    const {
      walletChain,  
    } = useWallet();
    
    const {
      supplies,
      suppliesChain,
    } = useAppSupplies(true);
    const [isOldToken, setIsOldToken] = useState(false);
    const [burnTransactions, setBurnTransactions] = useState([]);
    const [coinData, setCoinData] = useState({});
    
    
  
    const tokenAddress = fetchAddressForChain(
      suppliesChain?.id,
      isOldToken ? "oldToken" : "newToken"
    );
    // useEffect to fetch coin data
    useEffect(() => {
      fetchCoinData();
    }, []);
  
    const fetchCoinData = () => {
      CoinGeckoApi.fetchCoinData()
        .then((data: any) => {
          //console.log("coin stats", data);
          setCoinData(data?.market_data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const refetchTransactions = () => {
      Promise.all(
        ChainScanner.fetchAllTxPromises(isChainTestnet(walletChain?.id))
      )
        .then((results: any) => {
          //console.log(res);
          let res = results.flat();
          res = ChainScanner.sortOnlyBurnTransactions(res);
          res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
          setBurnTransactions(res);
        })
        .catch((err) => {
          console.log(err);
        });
  
  
  
      useEffect(() => {
        if (!walletChain) return;
        //console.log(suppliesChain);
        let isSubscribed = true;
        // const newTokenAddress = fetchAddressForChain(
        //   walletChain?.id,
        //   isOldToken ? "oldToken" : "newToken"
        // );
        if (isSubscribed) setBurnTransactions([]);
        const isTestnet = isChainTestnet(walletChain?.id);
        let _chainObjects: any[] = ['mainnet', 'avalanche', 'fantom'];
        if (isTestnet) _chainObjects = ['sepolia', 'avalancheFuji', 'fantomTestnet'];
        Promise.all(ChainScanner.fetchAllTxPromises(isTestnet))
          .then((results: any) => {
            //console.log(results, isTestnet);
            if (isSubscribed) {
              let new_chain_results: any[] = [];
              results.forEach((results_a: any[], index: number) => {
                new_chain_results.push(
                  results_a.map((tx: any) => ({
                    ...tx,
                    chain: _chainObjects[index],
                  }))
                );
              });
              let res = new_chain_results.flat();
              console.log(res, isTestnet);
              res = ChainScanner.sortOnlyBurnTransactions(res);
              res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
              setBurnTransactions(res);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        return () => {
          isSubscribed = false;
        };
      }, [walletChain, isOldToken]);
  
      return (
        <div>
          <BurnButtonBar refetchTransactions={refetchTransactions} />
          <BurnStats statsSupplies={supplies} tokenAddress={tokenAddress} />
          <TransactionTable burnTransactions={burnTransactions} coinData={coinData} />
        </div>
      );
    };
  
    export default BurnPage;
  