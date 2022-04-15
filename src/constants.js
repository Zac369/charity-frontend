const CONTRACT_ADDRESS = '0x9eDAd1175A4af5AAC32BDfa483F86e5a04abA016';

const TOKEN_ADDRESS = '0x9e8356f489C86Ad669A0A2C2d19375311EFd9e04';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };