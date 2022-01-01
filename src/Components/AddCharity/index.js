import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './AddCharity.css';
import { CONTRACT_ADDRESS } from './../../constants';
import Charities from './../../utils/Charities.json'; // ABI

const AddCharity = () => {
    const [charitiesContract, setCharitiesContract] = useState(null);
    const [newCharity, setNewCharity] = useState(null);
    const [addingCharity, setAddingCharity] = useState(false);

    const addCharityAction = (charityAddress) => async () => {
        try {
          if (charitiesContract) {
            setAddingCharity(true);
            console.log('Adding charity in progress...');
            const mintTxn = await charitiesContract.newCharity(charityAddress);
            await mintTxn.wait();
            console.log('mintTxn:', mintTxn);
            setAddingCharity(false);
          }
        } catch (error) {
          console.warn('MintCharacterAction Error:', error);
          setAddingCharity(false);
        }
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

    return (
        <div>
            <p className="sub-text">{newCharity}</p>

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
    );
};

export default AddCharity;