import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import logo from './utils/eth-logo.png'

import CharitiesPage from './Components/CharitiesPage/CharitiesPage';
import TokenShop from './Components/TokenShop/TokenPage';
import FundraisePage from './Components/FundraisePage/FundraisePage';
import ProfilePage from './Components/Profile/ProfilePage';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress } from './constants';
import Charities from './utils/Charities.json'; // ABI
import Token from './utils/Token.json'; // ABI

const App = () => {
  // State
  const [charityStatus, setCharityStatus] = useState(null);
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
  const renderLogin = () => {
    /*
     * User Is Not Logged In
     */
    if (!currentAccount) {
      return (
          <button className="hover:bg-orange rounded-md border-8 border-gray hover:border-orange" to="/fundraise"
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
        <button
          disabled={true}>{shortenAddress(currentAccount)}</button>
      );
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const getCharityStatus = async () => {
        try {
            let status = await charitiesContract.getCharity(currentAccount);
            setCharityStatus(status[0]);
        } catch (e) {
            console.warn(e);
        }
    }

    if (charitiesContract && currentAccount) {
        getCharityStatus();
    }

}, [charitiesContract, currentAccount]);

  return (
    <div className="bg-silver min-h-screen">
      <Router>
        <nav className="bg-gray container flex justify-around py-5 mx-auto text-white text-xl max-w-full">
          <div>
            <Link to="/">
              <img className="h-14 w-auto hover:bg-orange rounded-md border-8 border-gray hover:border-orange" src={logo} alt=""/>
            </Link>
          </div>
          <div className="flex items-center space-x-12">
            <Link className="hover:bg-orange rounded-md border-8 border-gray hover:border-orange" to="/"> Charities </Link>
            <Link className="hover:bg-orange rounded-md border-8 border-gray hover:border-orange" to="/token">Token Shop</Link>
            <Link className="hover:bg-orange rounded-md border-8 border-gray hover:border-orange" to="/fundraise">Fundraise</Link>
            <Link className="hover:bg-orange rounded-md border-8 border-gray hover:border-orange" to="/profile">Profile</Link>
          </div>
          
          {renderLogin()}
          
        </nav>
        <Routes>
          <Route path="/" element={<CharitiesPage currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} charityStatus={charityStatus} setCharityStatus={setCharityStatus} />} />
          <Route path="/token" element={<TokenShop currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract}/>} />
          <Route path="/fundraise" element={<FundraisePage currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} charityStatus={charityStatus} />} />
          <Route path="/profile" element={<ProfilePage currentAccount={currentAccount} charitiesContract={charitiesContract} tokenContract={tokenContract} charityStatus={charityStatus} />} />
        </Routes>
        
      </Router>
    </div>
  );
};

export default App;