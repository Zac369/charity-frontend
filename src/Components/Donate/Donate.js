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

        if (amount <= 0) {
            console.log("You cannot donate 0 tokens");
            return;
        }

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
            const txnApprove = await tokenContract.approve(charitiesContract.address, weiAmount);
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
        <div className="border-b border-grey pb-5 text-center">
            <p className="p-5 text-xl">Donate To Charity</p>
            <p className="inline px-5 text-lg">Address:</p>
            <label>
                <input className="text-center"
                type="text"
                value={newCharityAddress}
                onChange={(e) => setNewCharityAddress(e.target.value)}
                />
            </label>
            <p className="inline px-5 text-lg">Tokens:</p>
            <label>
                <input className="text-center"
                type="number" 
                value={newCharityAmount}
                onChange={(e) => setNewCharityAmount(e.target.value)}
                />
                {!donatingCharity &&
                    <button className="ml-5 text-xl border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold" onClick={donateCharityAction(newCharityAddress, newCharityAmount)}>
                    Donate
                    </button>
                }
                {donatingCharity &&
                    <button className="ml-5 text-xl border-8 border-blue rounded-lg bg-blue font-semibold" disabled={true}>
                    Donating
                    </button>
                }
            </label>
        </div>
    )
}

export default Donate
