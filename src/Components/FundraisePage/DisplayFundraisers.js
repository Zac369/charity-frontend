import React, {useState } from 'react';
import { BigNumber, ethers } from 'ethers';

const DisplayFundraisers = ({currentAccount, charitiesContract, tokenContract, allFundraisers, donatingFund, setDonatingFund, donatedToFundraisers}) => {
  
    const [donatingAmount, setDonatingAmount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [currentFund, setCurrentFund] = useState(null);

    const openModal = (index) => async () => {
        setCurrentFund(index);
        setShowModal(true);
    }

    const donateFundAction = (amount) => async () => {
        const index = currentFund;
        setDonatingAmount(0);

        let tokenBalance = await charitiesContract.getTokenBalance();
        tokenBalance = BigNumber.from(tokenBalance);
        tokenBalance = ethers.utils.formatEther(tokenBalance);
        console.log(tokenBalance);

        if (amount <= 0) {
            console.log("You cannot donate 0 tokens");
            return;
        }

        if (Number(tokenBalance) < Number(amount)) {
            console.log("You do not have enough tokens");
            return;
        }
        
        try {
            const fundList = await charitiesContract.getFundList();
            console.log(fundList);
            setDonatingFund(true);
            let weiAmount = ethers.utils.parseEther(amount.toString());
            console.log('Approving in progress...');
            const txnApprove = await tokenContract.approve(charitiesContract.address, weiAmount.toString());
            await txnApprove.wait();
            console.log('Donating in progress...');
            const donateTxn = await charitiesContract.pledge(index, weiAmount);
            await donateTxn.wait();
            console.log('donateTxn', donateTxn);
        } catch (e) {
            console.warn('Donation Error:', e);
        }
        setDonatingFund(false);
    }

    const unixToDate = (unix) => {
        const dateObject = new Date(unix)

        const humanDateFormat = dateObject.toLocaleString();

        return humanDateFormat;
    }

    return (
        <>
        <div className="py-10 mx-24">
            <p className="py-10 text-3xl font-bold text-gray">Active Fundraisers</p>
            
                {allFundraisers.map((fund) => {
                    if (fund.deadline > unixToDate(Date.now())) {
                        return (
                            <div className="mt-4 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                <div key={fund.index} className="group relative bg-white rounded-xl p-2">
                                    <img className="pb-4 pt-2 object-cover h-64 w-96" src={`https://ipfs.infura.io/ipfs/${fund.image}`} alt=""  />
                                    <div className="w-full min-h-80 bg-blue bg-opacity-20 aspect-w-1 aspect-h-1 rounded-b-xl overflow-y-auto no-scrollbar lg:h-80 lg:aspect-none">
                                        <h1 className="text-2xl font-semibold text-gray p-3">{fund.title}</h1>
                                        <h2 className="text-l font-semibold text-gray sm:mt-12 lg:mt-4 mt-12 p-3">{fund.description}</h2>
                                    </div>
                                    <div className="mt-4 ml-2 flex justify-between">
                                        <div>
                                            <h3 className="text-m text-gray font-medium">
                                                Start: {fund.start}
                                            </h3>
                                            <h3 className="text-m text-gray font-medium mt-1">
                                                End: {fund.deadline}
                                            </h3>
                                            <p className="my-3 text-xl font-bold text-gray">{fund.balance} / {fund.goal}</p>

                                            <label>
                                                {!donatingFund &&
                                                    <button className="my-3 text-xl border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold" value={fund.index} onClick={(async (e) => await openModal(e.target.value)())}>
                                                    Donate
                                                    </button>
                                                }
                                                {donatingFund &&
                                                    <button className="my-3 text-xl border-8 border-blue rounded-lg bg-blue font-semibold" disabled={true}>
                                                    Donating
                                                    </button>
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div></div>
                        )
                    }
                    
                })}
            
        </div>
        {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t text-gray">
                  <h3 className="text-3xl font-semibold">
                    Donate To:
                  </h3>
                  <h3 className="text-3xl font-semibold pl-5 text-black">
                    {allFundraisers[currentFund].title}
                  </h3>
                  <button
                    className="px-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-4xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                  {allFundraisers[currentFund].description}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <p className="flex text-2xl font-semibold py-3 pr-5">Amount:</p>
                    <label className="flex py-2 text-2xl">
                        <input className="w-2/5 text-center"
                        type="number"
                        value={donatingAmount}
                        onChange={(e) => setDonatingAmount(e.target.value)}
                        />
                    </label>
                  <button
                    className="bg-blue text-gray active:bg-blue font-bold uppercase text-m px-6 py-3 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:text-white"
                    type="button"
                    onClick={donateFundAction(donatingAmount)}
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
        </>
    )
}

export default DisplayFundraisers