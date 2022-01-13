import React, { useState } from 'react'
import { BigNumber, ethers } from 'ethers'

function Donate({ charitiesContract, tokenContract }) {

    const [newCharityAddress, setNewCharityAddress] = useState("");
    const [newCharityAmount, setNewCharityAmount] = useState(0);
    const [donatingCharity, setDonatingCharity] = useState(false);

    const donateCharityAction = (beneficiary, amount) => async () => {
        setNewCharityAddress("");
        setNewCharityAmount(0);
        let tokenBalance = await charitiesContract.getTokenBalance();
        tokenBalance = BigNumber.from(tokenBalance);
        tokenBalance = ethers.utils.formatEther(tokenBalance);
        console.log(tokenBalance);
        if (Number(tokenBalance) < Number(amount)) {
            console.log("You do not have enough tokens");
            return;
        }
        const listOfCharities = await charitiesContract.getCharityList();
        if (!listOfCharities.includes(beneficiary)) {
            console.log("Not a valid charity");
            return;
        }
        try {
            setDonatingCharity(true);
            let weiAmount = ethers.utils.parseEther(amount.toString());
            console.log('Approving in progress...');
            const txnApprove = await tokenContract.approve(charitiesContract.address, weiAmount.toString());
            await txnApprove.wait();
            console.log('Donating in progress...');
            const donateTxn = await charitiesContract.donateToCharity(beneficiary, weiAmount);
            await donateTxn.wait();
            console.log('donateTxn', donateTxn);
        } catch (e) {
            console.warn('Donation Error:', e);
        }
        setDonatingCharity(false);
    }

    return (
        <div>
            <p className="donate-header">Donate To Charity</p>
                <label>Address:
                    <input 
                    type="text" 
                    value={newCharityAddress}
                    onChange={(e) => setNewCharityAddress(e.target.value)}
                    />
                </label>
                <label>Tokens:
                    <input 
                    type="text" 
                    value={newCharityAmount}
                    onChange={(e) => setNewCharityAmount(e.target.value)}
                    />
                    {!donatingCharity &&
                        <button className="add-charity-button" onClick={donateCharityAction(newCharityAddress, newCharityAmount)}>
                        Donate
                        </button>
                    }
                    {donatingCharity &&
                        <button className="add-charity-button" disabled={true}>
                        Donating
                        </button>
                    }
                </label>
        </div>
    )
}

export default Donate
