pragma solidity ^0.8.17;
// SPDX-License-Identifier: MIT

library Cast {

  // library functions as public (https://soliditydeveloper.com/max-contract-size)
  function uint2str(uint _i) public pure returns (string memory _uintAsString) {
    if (_i == 0) {
        return "0";
    }
    uint j = _i;
    uint len;
    while (j != 0) {
        len++;
        j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len;
    while (_i != 0) {
        k = k-1;
        uint8 temp = (48 + uint8(_i - _i / 10 * 10));
        bytes1 b1 = bytes1(temp);
        bstr[k] = b1;
        _i /= 10;
    }
    return string(bstr);
  }

  function str2uint(string memory numString) public pure returns(uint) {
      uint  val=0;
      bytes   memory stringBytes = bytes(numString);
      for (uint  i =  0; i<stringBytes.length; i++) {
          uint exp = stringBytes.length - i;
          bytes1 ival = stringBytes[i];
          uint8 uval = uint8(ival);
          uint jval = uval - uint(0x30);
  
          val +=  (uint(jval) * (10**(exp-1))); 
      }
    return val;
  }

}