import React, { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';

import './DisplayCharities.css';
import { shortenAddress } from './../../constants';

const DisplayCharities = ({currentAccount, charitiesContract, tokenContract}) => {
    const [allCharities, setAllCharities] = useState([]);
    const [newCharityName, setNewCharityName] = useState("");
    const [newCharityAddress, setNewCharityAddress] = useState("");
    const [newCharityAmount, setNewCharityAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [addingCharity, setAddingCharity] = useState(false);
    const [donatingCharity, setDonatingCharity] = useState(false);
    const [withdrawingCharity, setWithdrawingCharity] = useState(false);
    const [numOfCharities, setNumOfCharities] = useState(0);
    const [charityStatus, setCharityStatus] = useState(null);
    const [recievedTokens, setRecievedTokens] = useState(0);

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

    const withdrawCharityAction = (amount) => async () => {
        if (amount <= 0) {
            console.log("Tokens must be greater than 0");
            return;
        } 
        let finalBalance = await charitiesContract.getTokensRecieved(currentAccount);
        finalBalance = BigNumber.from(finalBalance);
        finalBalance = ethers.utils.formatEther(finalBalance);
        if (Number(amount) > Number(finalBalance)) {
            console.log("You have not recieved enough tokens");
            return;
        }
        setWithdrawAmount(0);
        try {
            setWithdrawingCharity(true);
            let weiAmount = ethers.utils.parseEther(amount.toString());
            console.log('Withdrawing in progress...');
            const withdrawTxn = await charitiesContract.withdraw(currentAccount, weiAmount);
            await withdrawTxn.wait();
            console.log('withdrawTxn', withdrawTxn);
        } catch (e) {
            console.warn('Withdraw Error:', e);
        }
        setWithdrawingCharity(false);
    };

    const addCharityAction = (charityName) => async () => {
        if (!newCharityName) {
            console.log("Name must not be empty");
            return;
        }
        setNewCharityName("");
        try {
            const registered = await charitiesContract.isRegistered(currentAccount);
            if (registered) {
                console.log("You are already registered");
                return;
            }
            setAddingCharity(true);
            console.log('Adding charity in progress...');
            const mintTxn = await charitiesContract.newCharity(currentAccount, charityName);
            await mintTxn.wait();
            console.log('mintTxn:', mintTxn);
            setNumOfCharities(numOfCharities + 1);
            setCharityStatus(true);
        } catch (error) {
            console.warn('Add Charity Error:', error);
        }
        setAddingCharity(false);
    };

    useEffect(() => {
        const getRecievedTokens = async () => {
            try {
                let txn = await charitiesContract.getTokensRecieved(currentAccount);
                txn = BigNumber.from(txn);
                let wei = ethers.utils.formatEther(txn);
                setRecievedTokens(wei);
            } catch (e) {
                console.warn('Error fetching tokens:', e);
                setRecievedTokens(0);
            }
        }

        if (charitiesContract && currentAccount) {
            getRecievedTokens();
        }

    }, [charitiesContract, currentAccount, withdrawingCharity]);

    useEffect(() => {
        const updateCharities = async () => {
            try {
                let listOfCharities = await charitiesContract.getCharityList();

                // used when page first loads
                if(listOfCharities.length > numOfCharities) {
                    setNumOfCharities(listOfCharities.length);
                    let status = await charitiesContract.getCharity(currentAccount);
                    setCharityStatus(status[0]);
                    return;
                }

                let charities = [];
                for (let i = 0; i < listOfCharities.length; i++) {
                    let beneficiary = listOfCharities[i];
                    let ch = await charitiesContract.getCharity(beneficiary);
                    let charityName = ch[1];
                    let charityAmount = ch[2];

                    charityAmount = ethers.utils.formatEther(charityAmount)
                    const charity = {index: i, name: charityName, address: beneficiary, amount: charityAmount};
                    charities.push(charity);
                }

                setAllCharities(charities);
            
            } catch (error) {
                console.error('Something went wrong fetching charities:', error);
            }
        };
        
        if (charitiesContract && currentAccount) {
            updateCharities();
        }
    }, [charitiesContract, numOfCharities, currentAccount, donatingCharity]);

    return (
        <div>
            {!charityStatus &&
                <div className="add-charity-container">
                    <p className="table-header">Register As A Charity</p>
                    <label>Name:
                        <input 
                        type="text" 
                        value={newCharityName}
                        onChange={(e) => setNewCharityName(e.target.value)}
                        />
                        {!addingCharity &&
                            <button className="add-charity-button" onClick={addCharityAction(newCharityName)}>
                            Register
                            </button>
                        }
                        {addingCharity &&
                            <p className="adding-charity">Registering...</p>
                        }
                    </label>
                </div>
            }
            {charityStatus &&
                <div className="add-charity-container">
                    <p className="table-header">You Have been donated {recievedTokens} Tokens</p>
                    {recievedTokens > 0 &&
                        <label>Amount:
                            <input 
                            type="text" 
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            />
                            <button className="add-charity-button" onClick={withdrawCharityAction(withdrawAmount)}>
                                Withdraw
                            </button>
                        </label>
                    }
                    
                </div>
            }

            <div className="add-charity-container">
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
                        <p className="adding-charity">Donating...</p>
                    }
                </label>
            </div>

            <div>
                <p className="table-header">Newest Charities</p>
                <table className="amount">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Address</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {numOfCharities !==0 && allCharities.slice(-5).reverse().map((charity) => {
                            return (
                                <tr key={charity.index}>
                                    <td>{charity.name}</td>
                                    <td>{shortenAddress(charity.address)}</td>
                                    <td>{charity.amount}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DisplayCharities;