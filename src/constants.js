const CONTRACT_ADDRESS = '0x0101E8A6f62FaC8265DC34b280Dbe1840bC13a0C';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, shortenAddress };