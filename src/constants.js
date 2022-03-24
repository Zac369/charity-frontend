const CONTRACT_ADDRESS = '0x58D6FC8694330dd62Df27A92807097491921dc86';

const TOKEN_ADDRESS = '0xb583AdBf91375B8d57AeFe3006ABCC3208E280F8';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };