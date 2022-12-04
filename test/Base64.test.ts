import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

const simpleText =
  'Lorem ipsum dolor sit amet, "consectetur" adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const encodedSimpleText =
  'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsICJjb25zZWN0ZXR1ciIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0u';

const numSymbols = '0123456789+/!@#$%^&*(){}[]-=_+<>?:"|,./;"`';
const encodedNumSymbols =
  'MDEyMzQ1Njc4OSsvIUAjJCVeJiooKXt9W10tPV8rPD4/OiJ8LC4vOyJg';

const alphabet =
  'a ą b c ć d e ę f g h i j k l ł m n ń o ó p r s ś t u w y z ź ż A Ą B C Ć D E Ę F G H I J K L Ł M N Ń O Ó P R S Ś T U W Y Z Ź Ż';
const encodedAlphabet =
  'YSDEhSBiIGMgxIcgZCBlIMSZIGYgZyBoIGkgaiBrIGwgxYIgbSBuIMWEIG8gw7MgcCByIHMgxZsgdCB1IHcgeSB6IMW6IMW8IEEgxIQgQiBDIMSGIEQgRSDEmCBGIEcgSCBJIEogSyBMIMWBIE0gTiDFgyBPIMOTIFAgUiBTIMWaIFQgVSBXIFkgWiDFuSDFuw==';

describe('Base64 library', function () {
  // fixture runs once but state is restored before each test
  async function deployFactoryFixture() {
    const base64LibFactory = await ethers.getContractFactory('Base64');
    const base64Lib = await base64LibFactory.deploy();
    await base64Lib.deployed();

    const utf8Encode = new TextEncoder();

    return {
      base64Lib,
      utf8Encode,
    };
  }

  describe('Encoding', function () {
    it('Should encode alphabet', async function () {
      const { base64Lib, utf8Encode } = await loadFixture(deployFactoryFixture);
      expect(await base64Lib.encode(utf8Encode.encode(alphabet))).to.equal(
        encodedAlphabet
      );
    });

    it('Should encode numbers and symbols', async function () {
      const { base64Lib, utf8Encode } = await loadFixture(deployFactoryFixture);
      expect(await base64Lib.encode(utf8Encode.encode(numSymbols))).to.equal(
        encodedNumSymbols
      );
    });

    it('Should encode simple text', async function () {
      const { base64Lib, utf8Encode } = await loadFixture(deployFactoryFixture);
      expect(await base64Lib.encode(utf8Encode.encode(simpleText))).to.equal(
        encodedSimpleText
      );
    });
  });
});
