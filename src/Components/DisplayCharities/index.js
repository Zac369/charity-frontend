import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './DisplayCharities.css';
import { shortenAddress } from './../../constants';

const DisplayCharities = ({currentAccount, charitiesContract}) => {
    const [allCharities, setAllCharities] = useState([]);
    const [newCharityName, setNewCharityName] = useState("");
    const [newCharityAddress, setNewCharityAddress] = useState("");
    const [addingCharity, setAddingCharity] = useState(false);
    const [numOfCharities, setNumOfCharities] = useState(0);

    const addCharityAction = (charityName, charityAddress) => async () => {
        setNewCharityName("");
        setNewCharityAddress("");
        try {
          if (charitiesContract) {
            setAddingCharity(true);
            console.log('Adding charity in progress...');
            const mintTxn = await charitiesContract.newCharity(charityAddress, charityName);
            await mintTxn.wait();
            console.log('mintTxn:', mintTxn);
            setAddingCharity(false);
            setNumOfCharities(numOfCharities + 1)
          }
        } catch (error) {
          console.warn('Add Charity Error:', error);
          setAddingCharity(false);
        }
      };

    useEffect(() => {
        const updateCharities = async () => {
            try {
                let numberOfCharities = await charitiesContract.numOfCharities();
                
                numberOfCharities = numberOfCharities.toNumber()

                // used when page first loads
                if(numberOfCharities > numOfCharities) {
                    setNumOfCharities(numberOfCharities);
                    return;
                }

                let charities = [];
                for (let i = 0; i < numberOfCharities; i++) {
                    let ch = await charitiesContract.getCharity(i+1);
                    let charityName = ch[0];
                    let charityAddress = ch[1];
                    let charityAmount = ch[2];

                    charityAmount = ethers.utils.formatEther(charityAmount)
                    const charity = {index: i, name: charityName, address: charityAddress, amount: charityAmount};
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
            <div className="add-charity-container">
                <p className="sub-text">
                    <label>Name:
                        <input 
                        type="text" 
                        value={newCharityName}
                        onChange={(e) => setNewCharityName(e.target.value)}
                        />
                    </label>
                    
                    <label>Address:
                        <input 
                        type="text" 
                        value={newCharityAddress}
                        onChange={(e) => setNewCharityAddress(e.target.value)}
                        />
                    </label>
                </p>
                {addingCharity === false &&
                    <button className="add-charity-button" onClick={addCharityAction(newCharityName, newCharityAddress)}>
                    Add Charity
                    </button>
                }

                {addingCharity === true &&
                    <p className="adding-charity">Adding...</p>
                }
            </div>
            <div>
                <table className="amount">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Address</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {numOfCharities !==0 && allCharities.map((charity) => {
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