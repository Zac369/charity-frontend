const CONTRACT_ADDRESS = '0x06dC70eF06d5044bc62a83b610DEe504c59E3f40';

const TOKEN_ADDRESS = '0xccdC8AA041C152C2414ef942765a95d1B96D6B03';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };