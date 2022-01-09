import React, { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';

import './TokenShop.css';

const TokenShop = ({currentAccount, charitiesContract, tokenContract}) => {
    const [numTokens, setNumTokens] = useState(0);
    const [tradeOption, setTradeOption] = useState(null);
    const [selectedTokens, setSelectedTokens] = useState(0);
    const [trading, setTrading] = useState(false);

    const tradeTokens = (amount, option) => async () => {
        if (amount <= 0) {
            console.log("Tokens must be greater than 0");
            return;
        } 
        setSelectedTokens(0);
        console.log(amount);
        console.log(option);
        try {
            let weiAmount = ethers.utils.parseEther(amount.toString());
        setTrading(true);
        if (option === "buy") {
            weiAmount = weiAmount/10000;
            const txnBuy = await charitiesContract.buy({value: weiAmount.toString()});
            await txnBuy.wait();
            setTrading(false);
        } else if (option === "sell") {
            if (amount > numTokens) {
                console.log("Error Too many tokens");
                return;
            }
            const txnApprove = await tokenContract.approve(charitiesContract.address, weiAmount.toString());
            await txnApprove.wait();
            const txnSell = await charitiesContract.sell(weiAmount.toString());
            await txnSell.wait();
            setTrading(false);
        }
        } catch (error) {
            console.warn('Add Charity Error:', error);
            setTrading(false);
        }
    };

    useEffect(() => {
        const getTokenBalance = async () => {
            try {
                let txn = await charitiesContract.getTokenBalance();
                txn = BigNumber.from(txn);
                let wei = ethers.utils.formatEther(txn);
                setNumTokens(wei);
            } catch (e) {
                console.warn('Error fetching tokens:', e);
                setNumTokens(0);
            }
        }

        if (charitiesContract && currentAccount) {
            getTokenBalance();
        }

    }, [charitiesContract, currentAccount, trading]);

    return (
        <div className="container">
            <p className="num-tokens">You have {numTokens} tokens:</p>
            <div className="header" onChange={(e) => setTradeOption(e.target.value)}>
                <input type="radio" id="buy" name="trade-sell" value="buy"/>
                <label htmlFor="buy">Buy</label>
                <input type="radio" id="sell" name="trade-sell" value="sell"/>
                <label htmlFor="sell">Sell</label>
            </div>
            <div>
                <p>Conversion Rate: 1 Eth = 10000 Tokens</p>
                <p>Select Number Of Tokens To Trade:</p>
                <input type="number" min="0" value={selectedTokens} onChange={(e) => setSelectedTokens(e.target.value)}></input>
                <p>{selectedTokens / 1} Tokens = {selectedTokens / 10000} Eth</p>

                {trading === false &&
                    <button className="trade-button" 
                    onClick={tradeOption && tradeTokens(selectedTokens, tradeOption)}>
                    Trade
                    </button>
                }

                {trading === true &&
                    <button className="trade-button" disabled={true}>
                    Trading
                    </button>
                }
                
            </div>
        </div>
    )
}

export default TokenShop;