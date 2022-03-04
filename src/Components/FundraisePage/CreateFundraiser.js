import React, { useState } from 'react';
import { ethers } from 'ethers'

const CreateFundraiser = ({currentAccount, charitiesContract, tokenContract}) => {

    const [fundTitle, setFundTitle] = useState("");
    const [fundDescription, setFundDescription] = useState("");
    const [fundStart, setFundStart] = useState();
    const [fundDeadline, setFundDeadline] = useState();
    const [fundGoal, setFundGoal] = useState(0);
    const [fundraising, setFundraising] = useState(false);

    const addFundAction = (title, description, start, deadline, goal) => async () => {
        setFundTitle("");
        setFundDescription("");
        setFundGoal(0);

        const currentTime = Math.round(Date.now()/1000);

        if (start === undefined || deadline === undefined || title === "" || description === "" || goal <= 0) {
            console.log("Parameters must be set");
            return;
        }
        if (currentTime > deadline) {
            console.log("Deadline has already passed");
            return;
        }
        if (start >= deadline) {
            console.log("Deadline must be after start");
            return;
        }
    
        try {
            setFundraising(true);
            const weigoal = ethers.utils.parseEther(goal.toString());
            const txnAdd = await charitiesContract.createFund(title, description, start, deadline, weigoal);
            await txnAdd.wait();
            console.log(txnAdd);
        } catch (e) {
            console.warn(e);
        }
        setFundraising(false);
    }

    return (
        <>
        <p className="py-10 text-3xl font-bold text-gray ml-24">Create Fundraiser</p>
        <div className="text-center grid ml-24 w-2/3">
            <p className="flex text-md font-semibold pt-5">Title:</p>
            <label className="flex py-2 text-xl">
                <input className="w-2/5"
                type="text"
                value={fundTitle}
                onChange={(e) => setFundTitle(e.target.value)}
                />
            </label>
            <p className="flex text-md font-semibold pt-5">Description:</p>
            <label className="flex py-2 text-xl">
                <input className="w-2/5"
                type="text"
                value={fundDescription}
                onChange={(e) => setFundDescription(e.target.value)}
                />
            </label>
            <p className="flex text-md font-semibold pt-5">Start:</p>
            <label className="flex py-2 text-xl">
                <input className="w-2/5"
                type="datetime-local"
                onChange={(e) => setFundStart(Math.round(new Date(e.target.value).getTime()/1000))}
                />
            </label>
            <p className="flex text-md font-semibold pt-5">Deadline:</p>
            <label className="flex py-2 text-xl">
                <input className="w-2/5"
                type="datetime-local"
                onChange={(e) => setFundDeadline(Math.round(new Date(e.target.value).getTime()/1000))}
                />
            </label>
            <p className="flex text-md font-semibold pt-5">Token Goal:</p>
            <label className="flex py-2 pb-10 text-xl">
                <input className="w-2/5 text-center"
                type="number"
                value={fundGoal}
                onChange={(e) => setFundGoal(e.target.value)}
                />
            </label>
            {!fundraising &&
                <button className="text-2xl border-8 border-blue rounded-lg bg-blue text-gray hover:text-white font-semibold w-40" onClick={addFundAction(fundTitle, fundDescription, fundStart, fundDeadline, fundGoal)}>
                Add Fund
                </button>
            }
            {fundraising &&
                <button className="text-2xl border-8 border-blue rounded-lg bg-blue text-gray font-semibold w-40" disabled={true}>
                Adding Fund
                </button>
            }
        </div>
        </>
    )
}

export default CreateFundraiser