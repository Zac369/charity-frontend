import React, { useEffect, useState } from 'react';
import './TokenShop.css';

const TokenShop = ({currentAccount, charitiesContract}) => {
    const [numTokens, setNumTokens] = useState(0);

    useEffect(() => {
        const getTokenBalance = async () => {
            try {
                const txn = await charitiesContract.getTokenBalance();
                setNumTokens(txn.toNumber())
            } catch (e) {
                console.warn('Error fetching tokens:', e);
                setNumTokens(0);
            }
        }

        if (charitiesContract && currentAccount) {
            getTokenBalance();
        }

    }, [charitiesContract, currentAccount]);

    return (
        <div className="container">
            <p className="num-tokens">You have {numTokens} tokens:</p>
            <button className="title-buy">Buy</button>
            <button className="title-sell">Sell</button>
            <div>
                <p>Select number of tokens to trade:</p>
                <input type="number" min="0"></input>
                <button>Trade</button>
            </div>
        </div>
    )
}

export default TokenShop;