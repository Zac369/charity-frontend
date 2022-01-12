import React, { useEffect, useState } from 'react'
import Withdraw from './Withdraw/Withdraw';
import Register from './Register/Register';

const IsCharity = ({currentAccount, charitiesContract}) => {

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
        <div>
            {!charityStatus &&
                < Register currentAccount={currentAccount} charitiesContract={charitiesContract} setCharityStatus={setCharityStatus} />
            }
            {charityStatus &&
                < Withdraw currentAccount={currentAccount} charitiesContract={charitiesContract} />
            }
        </div>
    )
}

export default IsCharity
