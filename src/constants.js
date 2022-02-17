const CONTRACT_ADDRESS = '0x2F02851d34AF7a536bBf8f503399d820824060AF';

const TOKEN_ADDRESS = '0xcaa25a01d8a5fe1830ee870830a846ee5c57fb9b';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };