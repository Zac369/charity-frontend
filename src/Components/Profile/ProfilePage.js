import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ProfilePage = ({currentAccount, charitiesContract, tokenContract, charityStatus}) => {

  const [usersNFTs, setUsersNFTs] = useState([]);

  useEffect(() => {
    const updateUsersNFTIDs = async () => {
      try {
        const listOfNFTs = await charitiesContract.getNFTs(currentAccount);

        const NFTs = [];
        
        if (listOfNFTs.length === usersNFTs.length) {
          return;
        }
        
        for (let i = 0; i < listOfNFTs.length; i++) {
          const nft = listOfNFTs[i];
          const nftName = nft[0];
          let nftAmount = Math.round(ethers.utils.formatEther(nft[2]));
          //nftAmount = nftAmount.toNumber();
          const nftImage = nft[3];
          let nftID = parseInt(nft[4].toString());
          //nftID = nftID.toNumber();

          const NFT = {
            index: i,
            name: nftName,
            amount: nftAmount,
            image: nftImage,
            id: nftID
          }
          console.log(NFT.amount)
          console.log(NFT.id);
          NFTs.push(NFT);
        }
        setUsersNFTs(NFTs);

      } catch (error) {
        console.log(error);
      }
    };

    if (charitiesContract && currentAccount) {
      updateUsersNFTIDs();
    }
  }, [charitiesContract, currentAccount, usersNFTs.length]);
  

  return (
    <div>
        <p className="py-10 text-3xl font-bold text-gray text-center">Your NFTs</p>
        <div className="mt-4 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 px-8 pb-10">
            {usersNFTs.map((nft) => (
                <div key={nft.index} className="group relative bg-white rounded-xl">
                    <div className="rounded-lg">
                        <h1 className="text-3xl font-semibold text-gray pt-3 text-center">{nft.name}</h1>
                    </div>
                    <img className="pt-8 object-cover w-full h-96 mx-auto" src={`https://ipfs.infura.io/ipfs/${nft.image}`} alt=""  />
                    <div className="rounded-b-lg bg-blue grid">
                        <h1 className="pb-4 text-xl font-semibold text-gray pt-3 text-center">{`You Donated: ${nft.amount} Tokens`}</h1>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProfilePage