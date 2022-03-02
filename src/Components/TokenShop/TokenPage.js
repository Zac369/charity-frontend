import React, { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';

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
        <div className="text-center text-xl">
            <p className="pt-5 text-3xl font-bold text-gray">Trade Tokens</p>
            <p className="pt-5 font-semibold text-gray">You have {numTokens} tokens:</p>
            <div onChange={(e) => setTradeOption(e.target.value)}>
                <ul className="grid grid-cols-2 gap-x-5 m-8 max-w-sm mx-auto">
                    <li className="relative">
                        <input className="sr-only peer" type="radio" value="buy" name="answer" id="answer_buy"/>
                        <label className="inline-block w-40 text-center py-5 text-white bg-gray  rounded-lg cursor-pointer focus:outline-none hover:text-truewhite peer-checked:text-truewhite peer-checked:ring-orange peer-checked:ring-2 peer-checked:border-transparent peer-checked:bg-orange" for="answer_buy">Buy</label>
                    </li>

                    <li className="relative">
                        <input className="sr-only peer" type="radio" value="sell" name="answer" id="answer_sell"/>
                        <label className="inline-block w-40 text-center py-5 text-white bg-gray  rounded-lg cursor-pointer focus:outline-none hover:text-truewhite peer-checked:text-truewhite peer-checked:ring-orange peer-checked:ring-2 peer-checked:border-transparent peer-checked:bg-orange" for="answer_sell">Sell</label>
                    </li>
                </ul>
            </div>

            <div>
                <p>Conversion Rate: 1 Eth = 10000 Tokens</p>
                <p className="py-5">Select Number Of Tokens To Trade:</p>
                <input className="text-center rounded border border-solid border-gray focus:border-orange focus:outline-none transition ease-in-out" type="number" min="0" value={selectedTokens} onChange={(e) => setSelectedTokens(e.target.value)}></input>
                <p className="py-5">{selectedTokens / 1} Tokens = {selectedTokens / 10000} Eth</p>

                {trading === false &&
                    <button className="text-2xl border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold w-40"
                    onClick={tradeOption && tradeTokens(selectedTokens, tradeOption)}>
                    Trade
                    </button>
                }

                {trading === true &&
                    <button className="text-2xl border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold w-40" disabled={true}>
                    Trading
                    </button>
                }
                
            </div>
        </div>
    )
}

export default TokenShop;