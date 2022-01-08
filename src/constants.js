const CONTRACT_ADDRESS = '0x0101E8A6f62FaC8265DC34b280Dbe1840bC13a0C';

const TOKEN_ADDRESS = '0xa7f8c15af55ee157075d95d253ed2d86e63d5a65';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };