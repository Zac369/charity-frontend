import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { shortenAddress } from './../../constants'

const NewestCharities = ({ charitiesContract, currentAccount, charityStatus }) => {

    const [allCharities, setAllCharities] = useState([]);
    const [numOfCharities, setNumOfCharities] = useState(0);

    useEffect(() => {
        const updateCharities = async () => {
            try {
                let listOfCharities = await charitiesContract.getCharityList();

                // used when page first loads
                if(listOfCharities.length > numOfCharities) {
                    setNumOfCharities(listOfCharities.length);
                }

                const charities = [];
                for (let i = 0; i < listOfCharities.length; i++) {
                    const beneficiary = listOfCharities[i];
                    const ch = await charitiesContract.getCharity(beneficiary);
                    const charityName = ch[1];
                    let charityAmount = ch[2];

                    charityAmount = ethers.utils.formatEther(charityAmount);
                    const charity = {
                        index: i,
                        name: charityName,
                        address: beneficiary,
                        amount: charityAmount
                    };
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
    }, [charitiesContract, currentAccount, numOfCharities, charityStatus]);

    return (
        <>
        <div className="text-center">
            <p className="p-5 text-xl">Newest Charities</p>
        </div>
        <div className="flex flex-col mx-2 justify-center items-center">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-full">
                <div className="pt-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-y border-gray sm:rounded-lg">
                        <table className="divide-y divide-gray min-w-full">
                            <thead>
                                <tr className="bg-gray">
                                    <th className="px-6 py-3 text-left text-2xl font-medium text-white uppercase tracking-wider">Charity</th>
                                    <th className="px-6 py-3 text-left text-2xl font-medium text-white uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-2xl font-medium text-white uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray text-xl">
                                {numOfCharities !==0 && allCharities.slice(-5).reverse().map((charity) => {
                                    return (
                                        <tr key={charity.index}>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold">{charity.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font">{shortenAddress(charity.address)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{charity.amount}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default NewestCharities
