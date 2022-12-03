import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

// constants
const concertName = 'Concert';
const concertDescription = 'First concert of xyz in town';
const concertDate = 1675450800;
const imageUrl = 'https://image.url';
const sectorA = ['A1', '0', '0', '10', '1', '1000000000000000'];
const sectorB = ['B2', '1', '1', '5', '1', '1000000000000000'];
const sectors = sectorA.concat(sectorB);

describe('TickeDFactory contract', function () {
  // fixture runs once but state is restored in each test
  async function deployFactoryFixture() {
    // wallets:
    const [owner, orgAuth1, orgAuth2, orgNotAuth, concertgoer] =
      await ethers.getSigners();

    // deploy libraries
    const base64LibFactory = await ethers.getContractFactory('Base64');
    const base64Lib = await base64LibFactory.deploy();
    await base64Lib.deployed();
    const castLibFactory = await ethers.getContractFactory('Cast');
    const castLib = await castLibFactory.deploy();
    await castLib.deployed();

    const tickeDFactoryF = await ethers.getContractFactory('tickeDFactory', {
      libraries: {
        Base64: base64Lib.address,
        Cast: castLib.address,
      },
    });
    const tickeDFactory = await tickeDFactoryF.deploy();
    await tickeDFactory.deployed();

    return {
      tickeDFactory,
      owner,
      orgAuth1,
      orgNotAuth,
      base64Lib,
      castLib,
    };
  }

  describe('Deployment & Admin permissions', function () {
    it('Should set the right owner', async function () {
      const { tickeDFactory, owner } = await loadFixture(deployFactoryFixture);
      expect(await tickeDFactory['owner']()).to.equal(owner.address);
    });

    it('Owner can grant permissions', async function () {
      const { tickeDFactory, orgAuth1 } = await loadFixture(
        deployFactoryFixture
      );
      tickeDFactory['setOrganizatorPermission'](orgAuth1.address, true);
      expect(await tickeDFactory['whitelist'](orgAuth1.address)).to.equal(true);
    });

    it('Owner can revoke permissions', async function () {
      const { tickeDFactory, orgAuth1 } = await loadFixture(
        deployFactoryFixture
      );
      tickeDFactory['setOrganizatorPermission'](orgAuth1.address, true);
      expect(await tickeDFactory['whitelist'](orgAuth1.address)).to.equal(true);
      tickeDFactory['setOrganizatorPermission'](orgAuth1.address, false);
      expect(await tickeDFactory['whitelist'](orgAuth1.address)).to.equal(
        false
      );
    });

    it('Should fail granting permissions if sender is not owner', async function () {
      const { tickeDFactory, orgAuth1 } = await loadFixture(
        deployFactoryFixture
      );
      await expect(
        tickeDFactory
          .connect(orgAuth1)
          ['setOrganizatorPermission'](orgAuth1.address, true)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Creating concerts by organizators', function () {
    it('Should fail if sender is not authorized', async function () {
      const { tickeDFactory, orgNotAuth } = await loadFixture(
        deployFactoryFixture
      );

      await expect(
        tickeDFactory
          .connect(orgNotAuth)
          ['createTickets'](
            concertName,
            concertDescription,
            concertDate,
            imageUrl,
            sectors
          )
      ).to.be.revertedWith('Not allowed to mint');
    });

    it('Should create concert for authorized sender', async function () {
      const { tickeDFactory, orgAuth1, base64Lib, castLib } = await loadFixture(
        deployFactoryFixture
      );

      tickeDFactory['setOrganizatorPermission'](orgAuth1.address, true);
      await tickeDFactory
        .connect(orgAuth1)
        ['createTickets'](
          concertName,
          concertDescription,
          concertDate,
          imageUrl,
          sectors
        );

      const depConcerts = await tickeDFactory['getDepContracts'](
        orgAuth1.address
      );

      expect(await depConcerts[0].name).to.equal(concertName);

      const tickeD1155Factory = await ethers.getContractFactory('tickeD1155', {
        libraries: {
          Base64: base64Lib.address,
          Cast: castLib.address,
        },
      });

      const createdContract = await tickeD1155Factory.attach(
        depConcerts[0].contractAddress
      );

      expect(await createdContract['orgAddress']()).to.equal(orgAuth1.address);
    });
  });
});
