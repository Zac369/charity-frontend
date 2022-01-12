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
        <div>
            <p className="table-header">Register As A Charity</p>
            <label>Name:
                <input 
                type="text" 
                value={newCharityName}
                onChange={(e) => setNewCharityName(e.target.value)}
                />
                {!addingCharity &&
                    <button className="add-charity-button" onClick={registerCharityAction(newCharityName)}>
                    Register
                    </button>
                }
                {addingCharity &&
                    <p className="adding-charity">Registering...</p>
                }
            </label>
        </div>
    )
}

export default Register
