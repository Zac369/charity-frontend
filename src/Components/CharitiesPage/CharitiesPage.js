import React from 'react'

import NewestCharities from '../NewestCharities/NewestCharities'
import Donate from '../Donate/Donate'
import IsCharity from '../IsCharity/IsCharity'

import './DisplayCharities.css'

const CharitiesPage = ({currentAccount, charitiesContract, tokenContract}) => {
    return (
        <div className="add-charity-container">
            < IsCharity currentAccount={currentAccount} charitiesContract={charitiesContract} />
            < Donate charitiesContract={charitiesContract} tokenContract={tokenContract} />
            < NewestCharities currentAccount={currentAccount} charitiesContract={charitiesContract} />
        </div>
    );
};

export default CharitiesPage