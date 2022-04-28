const CONTRACT_ADDRESS = '0xC6Ee86f954f6e0F60cb32ee3d5709220FE20b0d9';

const TOKEN_ADDRESS = '0xA2F4cBedEb4C02dC38988bA0a07dc4a1020797B1';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };