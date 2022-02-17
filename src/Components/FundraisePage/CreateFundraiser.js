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
        const currentTime = Math.round(Date.now()/1000);

        if (start === undefined || deadline === undefined || title === "" || description === "" || goal <= 0) {
            console.log("Parameters must be set");
            return;
        }
        if (currentTime > deadline) {
            console.log("Deadline has already passed");
            return;
        }
        if (start > deadline) {
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
        <div>
            <p>Create Fundraiser</p>
            <label>
                Title:
                    <input
                    type="text"
                    value={fundTitle}
                    onChange={(e) => setFundTitle(e.target.value)}
                    />
            </label>
            <label>
                Description:
                    <input
                    type="text"
                    value={fundDescription}
                    onChange={(e) => setFundDescription(e.target.value)}
                    />
            </label>
            <label>
                Start:
                    <input
                    type="datetime-local"
                    onChange={(e) => setFundStart(Math.round(new Date(e.target.value).getTime()/1000))}
                    />
            </label>
            <label>
                Deadline:
                    <input
                    type="datetime-local"
                    onChange={(e) => setFundDeadline(Math.round(new Date(e.target.value).getTime()/1000))}
                    />
            </label>
            <label>
                Goal:
                    <input
                    type="number"
                    value={fundGoal}
                    onChange={(e) => setFundGoal(e.target.value)}
                    />
            </label>
            {!fundraising &&
                <button onClick={addFundAction(fundTitle, fundDescription, fundStart, fundDeadline, fundGoal)}>
                Add Fund
                </button>
            }
            {fundraising &&
                <button disabled={true}>
                Adding Fund
                </button>
            }
        </div>
    
    )
}

export default CreateFundraiser