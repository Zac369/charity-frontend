import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './DisplayCharities.css';
import { CONTRACT_ADDRESS } from './../../constants';
import Charities from './../../utils/Charities.json'; // ABI

const DisplayCharities = () => {
    const [charitiesContract, setCharitiesContract] = useState(null);
    const [allCharities, setAllCharities] = useState([]);
    const [newCharity, setNewCharity] = useState("");
    const [addingCharity, setAddingCharity] = useState(false);
    const [numOfCharities, setNumOfCharities] = useState(0);

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

    const addCharityAction = (charityAddress) => async () => {
        try {
          if (charitiesContract) {
            setAddingCharity(true);
            console.log('Adding charity in progress...');
            const mintTxn = await charitiesContract.newCharity(charityAddress);
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
                let amount = await charitiesContract.getCharityAmount(i);
                amount = ethers.utils.formatEther(amount)
                console.log(amount)
                const charity = {index: i, amount: amount};
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
                <p className="sub-text"></p>

                <input 
                type="text" 
                value={newCharity}
                onChange={(e) => setNewCharity(e.target.value)}
                />
                
                {addingCharity === false &&
                    <button className="cta-button connect-wallet-button" onClick={addCharityAction(newCharity)}>
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
                                    <td>Add</td>
                                    <td>Later</td>
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