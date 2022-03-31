const CONTRACT_ADDRESS = '0xDAFa0260639aa7536ae5753be2A7D0aD19F9C744';

const TOKEN_ADDRESS = '0x710235d3D2904660994D18E54EA92b1CB1436E59';

const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  
export { CONTRACT_ADDRESS, TOKEN_ADDRESS, shortenAddress };