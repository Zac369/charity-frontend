import React from 'react'

import NewestCharities from '../NewestCharities/NewestCharities'
import Donate from '../Donate/Donate'
import IsCharity from '../IsCharity/IsCharity'

const CharitiesPage = ({currentAccount, charitiesContract, tokenContract, charityStatus}) => {
    return (
        <>
            < IsCharity currentAccount={currentAccount} charitiesContract={charitiesContract} charityStatus={charityStatus} />
            < Donate charitiesContract={charitiesContract} tokenContract={tokenContract} />
            < NewestCharities currentAccount={currentAccount} charitiesContract={charitiesContract} />
        </>
    );
};

export default CharitiesPage