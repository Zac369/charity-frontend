import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderContent = () => {
    /*
     * User Is Not Logged In
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
     * User Is Logged In
     */
    } else if (currentAccount) {
      return (
        <div className="header-container">
          <p className="sub-text">You are now logged in!</p>
          <p className="sub-text">{currentAccount}</p>
        </div>
      );
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="sub-text">Login With Metamask</p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;