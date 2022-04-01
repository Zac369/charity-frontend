const CONTRACT_ADDRESS = '0xB71131C666ea012A435DA1113f43c90CbD0cEE02';

const TOKEN_ADDRESS = '0xd00f14CdBd220eD083d608587996662C6F93EA93';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };