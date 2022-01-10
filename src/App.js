import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import './App.css';
import DisplayCharities from './Components/DisplayCharities';
import Home from './Components/Home';
import TokenShop from './Components/TokenShop';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress } from './constants';
import Charities from './utils/Charities.json'; // ABI
import Token from './utils/Token.json'; // ABI

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [charitiesContract, setCharitiesContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const charitiesContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Charities.abi,
        signer
      );
      setCharitiesContract(charitiesContract);

      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        Token.abi,
        signer
      );
      setTokenContract(tokenContract);
      
      console.log('Ethereum object found');
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

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
          <button className="connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet
          </button>
      );
      /*
     * User Is Logged In
     */
    } else if (currentAccount) {
      return (
        <p className="connect-wallet-text">{shortenAddress(currentAccount)}</p>
      );
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <Link className="nav-link" to="/"> Home </Link>
        <Link className="nav-link" to="/charities"> Charities </Link>
        <Link className="nav-link" to="/token">Token Shop</Link>
        
        {renderContent()}
        
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/charities" element={<DisplayCharities currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract}/>} />
        <Route path="/token" element={<TokenShop currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract}/>} />
      </Routes>
      
    </Router>
  );
};

export default App;