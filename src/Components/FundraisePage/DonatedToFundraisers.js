import React, { useEffect, useState } from 'react';

function DonatedToFundraisers({currentAccount, charitiesContract, tokenContract, charityStatus, donatedToFundraisers, allFundraisers}) {

    const [refunding, setRefunding] = useState(false);
    const [claimingNFT, setClaimingNFT] = useState(false);

    const refundFundAction = (index) => async () => {
        setRefunding(true);

        try {
            console.log(`Refunding fund: ${index}`);
            let refundTxn = await charitiesContract.refund(index);
            await refundTxn.wait();
            console.log(`Refunded fund: ${index}`);
            console.log(refundTxn);
        } catch (e) {
            console.warn(e);
        }

        setRefunding(false);
    }

    const claimNFT = (index) => async () => {
        setClaimingNFT(true);
        try {
            console.log(`Claiming NFT: ${index}`);
            let claimTxn = await charitiesContract.claimNFT(index);
            await claimTxn.wait();
            console.log(`Claimed NFT: ${index}`);
            console.log(claimTxn);
        } catch (e) {
            console.warn(e);
        }
        setClaimingNFT(false);
    }


    const activeFund = (fundIndex) => {
        const fundDeadline = allFundraisers[fundIndex].deadline;
        const fundBalance = allFundraisers[fundIndex].balance;
        const fundGoal = allFundraisers[fundIndex].goal;

        const currentDate = new Date().toLocaleString();
        if (currentDate > fundDeadline) {
            return (
                <div>
                    <p className="inline-block">Ended</p>
                    {(!claimingNFT && fundBalance >= fundGoal) &&
                        <div className="inline-block">
                        <button className="ml-2 border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold" value={fundIndex} onClick={(async (e) => await claimNFT(e.target.value)())}>Claim NFT</button>
                        </div>
                    }
                    {(claimingNFT && fundBalance >= fundGoal) &&
                        <div className="inline-block">
                        <button className="ml-2 border-8 border-blue rounded-lg bg-blue text-gray font-semibold" disabled={true}>Claiming NFT</button>
                        </div>
                    }
                    {(fundBalance < fundGoal && !refunding) &&
                        <div className="inline-block">
                        <button className="ml-2 border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold" value={fundIndex} onClick={(async (e) => await refundFundAction(e.target.value)())}>Refund</button>
                        </div>
                    }
                    {(fundBalance < fundGoal && refunding) &&
                        <div className="inline-block">
                        <button className="ml-2 border-8 border-blue rounded-lg bg-blue text-gray font-semibold" disabled={true}>Refunding</button>
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
            <div className="text-center top-20 py-1">
                <p className="py-10 text-3xl font-bold text-gray inline-flex">You have donated to:</p>
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
                                        {donatedToFundraisers.map((fund) => {
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
        </div>
    )
    }

export default DonatedToFundraisers