import React, { useEffect, useState } from 'react'

const DisplayFundraisers = ({currentAccount, charitiesContract, tokenContract}) => {
  
    const [allFundraisers, setAllFundraisers] = useState([]);
    const [numOfFundraisers, setNumOfFundraisers] = useState(0);

    useEffect(() => {
        const updateFundraisers = async () => {
            try {
                const listOfFunds = await charitiesContract.getFundList();

                // used when page first loads
                if(listOfFunds.length > numOfFundraisers) {
                    setNumOfFundraisers(listOfFunds.length);
                    return;
                }

                const funds = [];
                for (let i = 0; i < listOfFunds.length; i++) {
                    const fund = listOfFunds[i];

                }

            } catch (error) {
                console.error('Something went wrong fetching fundraisers:', error);
            }
        }
    })
   
    return (
    <div className="text-center">
        <p className="py-5 text-2xl font-semibold text-gray">Current Fundraisers</p>
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Goal</th>
                    <th>Deadline</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
  )
}

export default DisplayFundraisers