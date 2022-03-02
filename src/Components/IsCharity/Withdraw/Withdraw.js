import React, { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'

const Withdraw = ({currentAccount, charitiesContract}) => {

    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawingCharity, setWithdrawingCharity] = useState(false);
    const [recievedTokens, setRecievedTokens] = useState(0);

    useEffect(() => {
        const getRecievedTokens = async () => {
            try {
                let txn = await charitiesContract.getTokensRecieved(currentAccount);
                txn = BigNumber.from(txn);
                let wei = ethers.utils.formatEther(txn);
                setRecievedTokens(wei);
            } catch (e) {
                console.warn('Error fetching tokens:', e);
                setRecievedTokens(0);
            }
        }

        if (charitiesContract && currentAccount) {
            getRecievedTokens();
        }

    }, [charitiesContract, currentAccount, withdrawingCharity]);

    const withdrawCharityAction = (amount) => async () => {
        if (amount <= 0) {
            console.log("Tokens must be greater than 0");
            return;
        } 
        let finalBalance = await charitiesContract.getTokensRecieved(currentAccount);
        finalBalance = BigNumber.from(finalBalance);
        finalBalance = ethers.utils.formatEther(finalBalance);
        if (Number(amount) > Number(finalBalance)) {
            console.log("You have not recieved enough tokens");
            return;
        }
        setWithdrawAmount(0);
        try {
            setWithdrawingCharity(true);
            let weiAmount = ethers.utils.parseEther(amount.toString());
            console.log('Withdrawing in progress...');
            const withdrawTxn = await charitiesContract.withdraw(currentAccount, weiAmount);
            await withdrawTxn.wait();
            console.log('withdrawTxn', withdrawTxn);
        } catch (e) {
            console.warn('Withdraw Error:', e);
        }
        setWithdrawingCharity(false);
    };

    return (
        <div className="text-center border-b border-grey py-5">
            <p className="text-xl pb-5">You Have been donated {recievedTokens} Tokens</p>
            {recievedTokens > 0 &&
                <>
                <p className="inline px-5 text-lg">Amount:</p>
                <label>
                    <input className="text-center"
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <button className="ml-5 text-xl border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold" onClick={withdrawCharityAction(withdrawAmount)}>
                        Withdraw
                    </button>
                </label>
                </>
            }
        </div>
    )
}

export default Withdraw
