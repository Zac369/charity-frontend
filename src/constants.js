const CONTRACT_ADDRESS = '0xd0d4321D78e50a76170cD40d1b0C01B7bDf98f07';

const TOKEN_ADDRESS = '0xa74c06712e8c1d8e1116c576446e4c637c734be1';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };