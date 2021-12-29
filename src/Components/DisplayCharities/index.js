import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './DisplayCharities.css';
import { CONTRACT_ADDRESS } from './../../constants';
import Charities from './../../utils/Charities.json'; // ABI

const DisplayCharities = () => {
    const [charitiesContract, setCharitiesContract] = useState(null);

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

    useEffect(() => {
        const getCharities = async () => {
            try {
            console.log('Getting all charities');
        
            const all = await charitiesContract.numOfCharities();
            console.log('Number of charities:', all.toNumber());
        
            } catch (error) {
            console.error('Something went wrong fetching charities:', error);
            }
        };
        
        if (charitiesContract) {
            getCharities();
        }
    }, [charitiesContract]);

    return (
        <table className="amount">
            <thead>
                <tr>
                    <th>Charity</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Charity 1</td>
                    <td>532446</td>
                </tr>
                <tr>
                    <td>Charity 2</td>
                    <td>46634</td>
                </tr>
                <tr>
                    <td>Charity 3</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
    );
};

export default DisplayCharities;