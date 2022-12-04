import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Cast library', function () {
  async function deployFactoryFixture() {
    const castLibFactory = await ethers.getContractFactory('Cast');
    const castLib = await castLibFactory.deploy();
    await castLib.deployed();

    return {
      castLib,
    };
  }

  describe('Test casting number to string', function () {
    it('Should cast one digit', async function () {
      const { castLib } = await loadFixture(deployFactoryFixture);
      const numberTwo: number = 2;
      const stringTwo: string = '2';

      expect(await castLib.uint2str(numberTwo), 'Two not converted').to.equal(
        stringTwo
      );
    });

    it('Should cast max safe integer', async function () {
      const { castLib } = await loadFixture(deployFactoryFixture);
      const maxSafeInteger: number = 9007199254740990;
      const maxSafeIntegerString: string = '9007199254740990';

      expect(await castLib.uint2str(maxSafeInteger)).to.equal(
        maxSafeIntegerString
      );
    });

    // ethers converts number to BigNumber and error occurs in conversion before calling castLib.uint2str
    // it('Should fail if cast float', async function () {
    //   const { castLib } = await loadFixture(deployFactoryFixture);
    //   const floatNumber: number = 12.3456;
    //   expect(await castLib.uint2str(floatNumber)).to.throw('Error: underflow');
    // });

    // same in case of number < 0
  });

  describe('Test casting string to number', function () {
    it('Should cast one digit', async function () {
      const { castLib } = await loadFixture(deployFactoryFixture);
      const numberTwo: number = 2;
      const stringTwo: string = '2';

      expect(await castLib.str2uint(stringTwo), 'Two not converted').to.equal(
        numberTwo
      );
    });

    it('Should cast max safe integer', async function () {
      const { castLib } = await loadFixture(deployFactoryFixture);
      const maxSafeInteger: number = 9007199254740990;
      const maxSafeIntegerString: string = '9007199254740990';

      expect(await castLib.str2uint(maxSafeIntegerString)).to.equal(
        maxSafeInteger
      );
    });
  });
});
