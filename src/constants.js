const CONTRACT_ADDRESS = '0xE2694f18804d11D4b74394d4D104EecfF38a49fD';

const TOKEN_ADDRESS = '0x7d7cc0b6175feba744e54e17e3e1674b29dc08f1';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };