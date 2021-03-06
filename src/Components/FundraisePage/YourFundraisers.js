import React, { useEffect, useState } from 'react';

function YourFundraisers({currentAccount, charitiesContract, tokenContract, allFundraisers, yourFundraisers}) {

    const [charityStatus, setCharityStatus] = useState(null);
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        const getCharityStatus = async () => {
            try {
                let status = await charitiesContract.getCharity(currentAccount);
                setCharityStatus(status[0]);
            } catch (e) {
                console.warn(e);
            }
        }

        if (charitiesContract && currentAccount) {
            getCharityStatus();
        }

    }, [charitiesContract, currentAccount]);

    const claimFundAction = (index) => async () => {
        setClaiming(true);

        try {
            console.log(`Claiming fund: ${index}`);
            let claimTxn = await charitiesContract.claim(index);
            await claimTxn.wait();
            console.log(`Claimed fund: ${index}`);
            console.log(claimTxn);
        } catch (error) {
            console.log(error);
        }
        
        setClaiming(false);
    }

    const activeFund = (fundIndex) => {
        const fundDeadline = allFundraisers[fundIndex].deadline;
        const fundClaimed = allFundraisers[fundIndex].claimed
        const currentDate = new Date().toLocaleString();
        let fundBalance = 0;
        try {
            fundBalance = yourFundraisers[fundIndex].balance;
        } catch (error) {
            fundBalance = 0;
        }
        const fundGoal = allFundraisers[fundIndex].goal;

        if (currentDate > fundDeadline) {
            return (
                <div>
                    {fundClaimed &&
                        <div className="inline-block">
                            <p className="inline-block">Ended</p>
                            <button disabled={true} className="ml-2 border-8 border-blue rounded-lg bg-blue font-semibold">Claimed</button>
                        </div>
                    }
                    {!fundClaimed && (fundBalance >= fundGoal) &&
                        <div className="inline-block">
                            <p className="inline-block">Ended</p>
                            {!claiming &&
                            <button className="ml-2 border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold" value={fundIndex} onClick={(async (e) => await claimFundAction(e.target.value)())}>Claim</button>
                            }
                            {claiming &&
                            <button className="ml-2 border-8 border-blue rounded-lg bg-blue text-gray font-semibold" disabled={true}>Claiming</button>
                            }
                        </div>
                    }
                    {!fundClaimed && (fundBalance < fundGoal) &&
                        <div className="inline-block">
                            <p>Failed</p>
                        </div>
                    }
                </div>
            )
        } else {
            return (
                <div>
                    <p>Active</p>
                </div>
            ) 
        }
        
    }
   
    
    return (
        <div>
            {charityStatus &&
            <div className="text-center top-20 py-1 right-0 absolute w-3/5">
                <p className="py-10 text-3xl font-bold text-gray w-1/2 inline-flex">Your Fundraisers</p>
                <div className="flex flex-col mx-2 justify-center items-center">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-full">
                        <div className="pt-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-y border-gray sm:rounded-lg">
                                <table className="divide-y divide-gray min-w-full">
                                    <thead>
                                        <tr className="bg-gray">
                                            <th className="px-6 py-3 text-2xl font-medium text-white uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-2xl font-medium text-white uppercase tracking-wider">Fund</th>
                                            <th className="px-6 py-3 text-2xl font-medium text-white uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray text-xl">
                                        {yourFundraisers.map((fund) => {
                                            return (
                                                <tr key={fund.index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{activeFund(fund.index)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap font">{fund.title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{fund.balance} / {fund.goal}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default YourFundraisers