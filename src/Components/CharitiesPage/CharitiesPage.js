import React from 'react'

import NewestCharities from '../NewestCharities/NewestCharities'
import Donate from '../Donate/Donate'
import IsCharity from '../IsCharity/IsCharity'

const CharitiesPage = ({currentAccount, charitiesContract, tokenContract, charityStatus, setCharityStatus}) => {
    return (
        <>
            < IsCharity currentAccount={currentAccount} charitiesContract={charitiesContract} charityStatus={charityStatus} setCharityStatus={setCharityStatus} />
            < Donate charitiesContract={charitiesContract} tokenContract={tokenContract} />
            < NewestCharities currentAccount={currentAccount} charitiesContract={charitiesContract} charityStatus={charityStatus} />
        </>
    );
};

export default CharitiesPage