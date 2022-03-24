import React, { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';

const DisplayFundraisers = ({currentAccount, charitiesContract, tokenContract, allFundraisers, donatingFund, setDonatingFund}) => {
  
    const [donatingAmount, setDonatingAmount] = useState(0);

    const donateFundAction = (index) => async () => {
        const amount = 10;
        setDonatingAmount(0);

        let tokenBalance = await charitiesContract.getTokenBalance();
        tokenBalance = BigNumber.from(tokenBalance);
        tokenBalance = ethers.utils.formatEther(tokenBalance);
        console.log(tokenBalance);

        if (amount <= 0) {
            console.log("You cannot donate 0 tokens");
            return;
        }

        if (Number(tokenBalance) < Number(amount)) {
            console.log("You do not have enough tokens");
            return;
        }
        
        try {
            const fundList = await charitiesContract.getFundList();
            console.log(fundList);
            setDonatingFund(true);
            let weiAmount = ethers.utils.parseEther(amount.toString());
            console.log('Approving in progress...');
            const txnApprove = await tokenContract.approve(charitiesContract.address, weiAmount.toString());
            await txnApprove.wait();
            console.log('Donating in progress...');
            const donateTxn = await charitiesContract.pledge(index, weiAmount);
            await donateTxn.wait();
            console.log('donateTxn', donateTxn);
        } catch (e) {
            console.warn('Donation Error:', e);
        }
        setDonatingFund(false);
    }

    return (
        <>
        
        
        <div className="py-10 mx-24">
            <p className="py-10 text-3xl font-bold text-gray">Active Fundraisers</p>
            <div className="mt-4 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {allFundraisers.map((fund) => (
                    <div key={fund.index} className="group relative bg-white rounded-xl p-2">
                        <img className="pb-4 pt-2 object-cover h-64 w-96" src={`https://ipfs.infura.io/ipfs/${fund.image}`} alt=""  />
                        <div className="w-full min-h-80 bg-blue bg-opacity-20 aspect-w-1 aspect-h-1 rounded-b-xl overflow-y-auto no-scrollbar lg:h-80 lg:aspect-none">
                            <h1 className="text-2xl font-semibold text-gray p-3">{fund.title}</h1>
                            <h2 className="text-l font-semibold text-gray sm:mt-12 lg:mt-4 mt-12 p-3">{fund.description}</h2>
                        </div>
                        <div className="mt-4 ml-2 flex justify-between">
                            <div>
                                <h3 className="text-m text-gray font-medium">
                                    Start: {fund.start}
                                </h3>
                                <h3 className="text-m text-gray font-medium mt-1">
                                    End: {fund.deadline}
                                </h3>
                                <p className="my-3 text-xl font-bold text-gray">{fund.balance} / {fund.goal}</p>

                                <label>
                                    {!donatingFund &&
                                        <button className="my-3 text-xl border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold" value={fund.index} onClick={(async (e) => await donateFundAction(e.target.value)())}>
                                        Donate
                                        </button>
                                    }
                                    {donatingFund &&
                                        <button className="my-3 text-xl border-8 border-blue rounded-lg bg-blue font-semibold" disabled={true}>
                                        Donating
                                        </button>
                                    }
                                </label>
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default DisplayFundraisers