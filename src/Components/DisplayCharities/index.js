import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './DisplayCharities.css';
import { shortenAddress } from './../../constants';

const DisplayCharities = ({currentAccount, charitiesContract}) => {
    const [allCharities, setAllCharities] = useState([]);
    const [newCharityName, setNewCharityName] = useState("");
    const [addingCharity, setAddingCharity] = useState(false);
    const [numOfCharities, setNumOfCharities] = useState(0);
    const [charityStatus, setCharityStatus] = useState(null);


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
            setAddingCharity(false);
            setNumOfCharities(numOfCharities + 1)
        } catch (error) {
            console.warn('Add Charity Error:', error);
            setAddingCharity(false);
        }
      };

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
    }, [charitiesContract, numOfCharities, currentAccount]);

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
                        {addingCharity === false &&
                            <button className="add-charity-button" onClick={addCharityAction(newCharityName)}>
                            Register
                            </button>
                        }
                        {addingCharity === true &&
                            <p className="adding-charity">Registering...</p>
                        }
                    </label>
                </div>
            }
            {charityStatus &&
                <p className="table-header">You Are Registered As A Charity</p>
            }

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