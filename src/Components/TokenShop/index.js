import React from 'react';
import './TokenShop.css';

function TokenShop() {
    return (
        <div className="container">
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