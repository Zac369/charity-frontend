import React, { useEffect, useState } from 'react'
import Register from '../IsCharity/Register/Register'
import CreateFundraiser from './CreateFundraiser';
import DisplayFundraisers from './DisplayFundraisers';

const FundraisePage = ({currentAccount, charitiesContract, tokenContract}) => {

    const [charityStatus, setCharityStatus] = useState(null);

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

    return (
        <div className="fundraise-container">
            {!charityStatus &&
                < Register currentAccount={currentAccount} charitiesContract={charitiesContract} setCharityStatus={setCharityStatus} />
            }
            {charityStatus &&
                < CreateFundraiser currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} />
            }
            < DisplayFundraisers currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} />
        </div>
    )
}

export default FundraisePage
