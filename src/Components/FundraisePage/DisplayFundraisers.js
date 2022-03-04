import React, { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'

const DisplayFundraisers = ({currentAccount, charitiesContract, tokenContract}) => {
  
    const [allFundraisers, setAllFundraisers] = useState([]);
    const [numOfFundraisers, setNumOfFundraisers] = useState(0);
    const [donatingFund, setDonatingFund] = useState(false);
    const [donatingAmount, setDonatingAmount] = useState(0);
    const [currentFund, setCurrentFund] = useState(null);

    const donateFundAction = (index) => async () => {
        console.log(index);
        const amount = 5;
        console.log(amount);
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
            const donateTxn = await charitiesContract.pledge(index + 1, weiAmount);
            await donateTxn.wait();
            console.log('donateTxn', donateTxn);
        } catch (e) {
            console.warn('Donation Error:', e);
        }
        setDonatingFund(false);
    }

    const unixToDate = (unix) => {
        const milliseconds = unix * 1000

        const dateObject = new Date(milliseconds)

        const humanDateFormat = dateObject.toLocaleString();

        return humanDateFormat;
    }

    useEffect(() => {
        const updateFundraisers = async () => {
            try {
                const listOfFunds = await charitiesContract.getFundList();

                // used when page first loads
                if(listOfFunds.length > numOfFundraisers) {
                    setNumOfFundraisers(listOfFunds.length);
                }

                const funds = [];
                for (let i = 0; i < listOfFunds.length; i++) {
                    const f = await charitiesContract.getFund(i+1);
                    const fundOwner = f[0];
                    const fundTitle = f[1];
                    const fundDescription = f[2];
                    let fundStart = f[3];
                    let fundDeadline = f[4];
                    let fundGoal = f[5];
                    let fundBalance = f[6];

                    fundGoal = ethers.utils.formatEther(fundGoal);
                    fundBalance = ethers.utils.formatEther(fundBalance);
                    fundStart = unixToDate(fundStart);
                    fundDeadline = unixToDate(fundDeadline);

                    const fund = {
                        index: i,
                        owner: fundOwner,
                        title: fundTitle,
                        description: fundDescription,
                        start: fundStart,
                        deadline: fundDeadline,
                        goal: fundGoal,
                        balance: fundBalance
                    };
                    funds.push(fund);
                }
                setAllFundraisers(funds);

            } catch (error) {
                console.error('Something went wrong fetching fundraisers:', error);
            }
        }

        if (charitiesContract && currentAccount) {
            updateFundraisers();
        }

    }, [charitiesContract, currentAccount])
   
    return (
        <>
        <div className="text-center top-20 py-1 right-0 absolute w-3/5">
            <p className="py-10 text-3xl font-bold text-gray w-1/2 inline-flex">Top Fundraiser</p>
        </div>
        <div className="py-10 mx-24">
            <p className="py-10 text-3xl font-bold text-gray">Active Fundraisers</p>
            <div className="mt-4 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {allFundraisers.map((fund) => (
                    <div key={fund.index} className="group relative bg-white rounded-xl p-2">
                        <div className="w-full min-h-80 bg-blue bg-opacity-20 aspect-w-1 aspect-h-1 rounded-xl overflow-y-auto no-scrollbar lg:h-80 lg:aspect-none">
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