import React from 'react';
import BurnTxTable from './BurnTxTable';
interface TransactionTableprops {
  burnTransactions:[],
  coinData:Object
}
const TransactionTable:React.FC<TransactionTableprops> = ({ burnTransactions, coinData }) => {
  return (
   <>
   <div className="header">
         <p className="header_label">Burn Transactions</p>
       </div>
       <BurnTxTable
         data={burnTransactions}
         priceUSD={coinData?.current_price?.usd}
       />
     </>
  );
};

export default TransactionTable;
