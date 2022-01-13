import React from 'react'

import NewestCharities from '../NewestCharities/NewestCharities'
import Donate from '../Donate/Donate'
import IsCharity from '../IsCharity/IsCharity'

import '../../Style/Charities.css'

const CharitiesPage = ({currentAccount, charitiesContract, tokenContract}) => {
    return (
        <>
            < IsCharity currentAccount={currentAccount} charitiesContract={charitiesContract} />
            < Donate charitiesContract={charitiesContract} tokenContract={tokenContract} />
            < NewestCharities currentAccount={currentAccount} charitiesContract={charitiesContract} />
        </>
    );
};

export default CharitiesPage