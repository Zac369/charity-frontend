import React, { useState } from 'react'

const Register = ({ currentAccount, charitiesContract, setCharityStatus }) => {

    const [newCharityName, setNewCharityName] = useState("");
    const [addingCharity, setAddingCharity] = useState(false);

    const registerCharityAction = (charityName) => async () => {
        if (!newCharityName) {
            console.log("Name must not be empty");
            return;
        }
        setNewCharityName("");
        try {
            const registered = await charitiesContract.isRegistered(currentAccount);
            if (registered) {
                console.log("You are already registered");
                return;
            }
            setAddingCharity(true);
            console.log('Adding charity in progress...');
            const mintTxn = await charitiesContract.newCharity(currentAccount, charityName);
            await mintTxn.wait();
            console.log('mintTxn:', mintTxn);
            setCharityStatus(true);
        } catch (error) {
            console.warn('Add Charity Error:', error);
        }
        setAddingCharity(false);
    };

    return (
        <div className="border-b border-grey pb-5 text-center">
            <p className="text-xl p-5">Register As A Charity</p>
            <p className="inline-flex pl-5 text-lg">Name:</p>
            <label className="p-5">
                <input 
                type="text" 
                value={newCharityName}
                onChange={(e) => setNewCharityName(e.target.value)}
                />
                {!addingCharity &&
                    <button className="ml-5 text-lg border-8 border-blue rounded-lg bg-blue text-gray hover:text-white" onClick={registerCharityAction(newCharityName)}>
                    Register
                    </button>
                }
                {addingCharity &&
                    <p className="pl-5">Registering...</p>
                }
            </label>
        </div>
    )
}

export default Register
