import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './DisplayCharities.css';
import { CONTRACT_ADDRESS } from './../../constants';
import Charities from './../../utils/Charities.json'; // ABI

const DisplayCharities = () => {
    const [charitiesContract, setCharitiesContract] = useState(null);
    const [allCharities, setAllCharities] = useState([]);
    const [newCharityName, setNewCharityName] = useState("");
    const [newCharityAddress, setNewCharityAddress] = useState("");
    const [addingCharity, setAddingCharity] = useState(false);
    const [numOfCharities, setNumOfCharities] = useState(0);

    const shortenAddress = (str) => {
        return str.substring(0, 6) + "..." + str.substring(str.length - 4);
      };

    useEffect(() => {
        const { ethereum } = window;
    
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const charitiesContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            Charities.abi,
            signer
          );
    
          setCharitiesContract(charitiesContract);
          console.log('Ethereum object found');
        } else {
          console.log('Ethereum object not found');
        }
    }, []);

    const addCharityAction = (charityName, charityAddress) => async () => {
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
          console.warn('MintCharacterAction Error:', error);
          setAddingCharity(false);
        }
      };

    useEffect(() => {
        const updateCharities = async () => {
            try {
            console.log('Getting number of charities');
        
            let numberOfCharities = await charitiesContract.numOfCharities();
            
            numberOfCharities = numberOfCharities.toNumber()
            console.log('Number of charities:', numberOfCharities);

            // used when page first loads
            if(numberOfCharities > numOfCharities) {
                setNumOfCharities(numberOfCharities);
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
        
        if (charitiesContract) {
            updateCharities();
        }
    }, [charitiesContract, numOfCharities]);

    return (
        <div>
            <div>
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
                    <button className="cta-button connect-wallet-button" onClick={addCharityAction(newCharityName, newCharityAddress)}>
                    Add Charity
                    </button>
                }

                {addingCharity === true &&
                    <p className="sub-text">Adding Charity...</p>
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
                        {allCharities.map((charity) => {
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