import React from 'react'
import Withdraw from './Withdraw/Withdraw';
import Register from './Register/Register';

const IsCharity = ({currentAccount, charitiesContract, charityStatus, setCharityStatus}) => {

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
