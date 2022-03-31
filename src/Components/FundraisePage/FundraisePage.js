import React, { useEffect, useState } from 'react';
import {ethers } from 'ethers'
import CreateFundraiser from './CreateFundraiser';
import DisplayFundraisers from './DisplayFundraisers';
import YourFundraisers from './YourFundraisers';
import DonatedToFundraisers from './DonatedToFundraisers';

const FundraisePage = ({currentAccount, charitiesContract, tokenContract, charityStatus}) => {

    const [allFundraisers, setAllFundraisers] = useState([]);
    const [yourFundraisers, setYourFundraisers] = useState([]);
    const [donatedToFundraisers, setDonatedToFundraisers] = useState([]);
    const [numOfFundraisers, setNumOfFundraisers] = useState(0);
    const [donatingFund, setDonatingFund] = useState(false);

    useEffect(() => {
        const updateFundraisers = async () => {
            try {
                const listOfFunds = await charitiesContract.getFundList();

                // used when page first loads
                if(listOfFunds.length > numOfFundraisers) {
                    setNumOfFundraisers(listOfFunds.length);
                }

                const funds = [];
                const yourFunds = [];
                const donatedToFunds = [];

                for (let i = 0; i < listOfFunds.length; i++) {
                    const f = await charitiesContract.getFund(i);
                    const fundOwner = f[0];
                    const fundTitle = f[1];
                    const fundDescription = f[2];
                    let fundStart = f[3];
                    let fundDeadline = f[4];
                    let fundGoal = f[5];
                    let fundBalance = f[6];
                    let fundImage = f[7];
                    let fundClaimed = f[8];

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
                        balance: fundBalance,
                        image: fundImage,
                        claimed: fundClaimed
                    };
                    funds.push(fund);
                    if (fund.owner.toUpperCase() === currentAccount.toUpperCase()) {
                        yourFunds.push(fund);
                    }
                    const amountUserDonated = await charitiesContract.getAmountDonatedToFund(currentAccount, i);
                    if (amountUserDonated > 0) {
                        donatedToFunds.push(fund);
                    }
                }
                setAllFundraisers(funds);
                setYourFundraisers(yourFunds);
                setDonatedToFundraisers(donatedToFunds);

            } catch (error) {
                console.error('Something went wrong fetching fundraisers:', error);
            }
            
        }

        if (charitiesContract && currentAccount) {
            updateFundraisers();
        }

    }, [charitiesContract, currentAccount, numOfFundraisers, donatedToFundraisers]);

    const unixToDate = (unix) => {
        const milliseconds = unix * 1000

        const dateObject = new Date(milliseconds)

        const humanDateFormat = dateObject.toLocaleString();

        return humanDateFormat;
    }

    return (
        <div className="fundraise-container">
            {charityStatus &&
            <>
                < CreateFundraiser currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} />
                < YourFundraisers currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} allFundraisers={allFundraisers} yourFundraisers={yourFundraisers} />
            </>
            }
            <div>
            < DonatedToFundraisers currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} charityStatus={charityStatus} donatedToFundraisers={donatedToFundraisers} allFundraisers={allFundraisers} />
            </div>
            <div>
            < DisplayFundraisers currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} allFundraisers={allFundraisers} donatingFund={donatingFund} setDonatingFund={setDonatingFund} donatedToFundraisers={donatedToFundraisers} />
            </div>
        </div>
    )
}

export default FundraisePage
