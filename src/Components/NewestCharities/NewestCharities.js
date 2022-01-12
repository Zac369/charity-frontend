import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { shortenAddress } from './../../constants'

const NewestCharities = ({ charitiesContract, currentAccount }) => {

    const [allCharities, setAllCharities] = useState([]);
    const [numOfCharities, setNumOfCharities] = useState(0);

    useEffect(() => {
        const updateCharities = async () => {
            try {
                let listOfCharities = await charitiesContract.getCharityList();

                // used when page first loads
                if(listOfCharities.length > numOfCharities) {
                    setNumOfCharities(listOfCharities.length);
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
    )
}

export default NewestCharities
