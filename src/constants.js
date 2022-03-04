const CONTRACT_ADDRESS = '0xB732166F0CA8760c3d37F72D95915a75D89Dc758';

const TOKEN_ADDRESS = '0xF9B5E835782088abb264D0d1A74040fBb6Df465A';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };