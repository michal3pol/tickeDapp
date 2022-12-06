import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

const concertName = 'Concert';
const concertDescription = 'First concert of xyz in town';
const concertDate = 1675450800;
const imageUrl = 'https://image.url';
const sectorA = ['A1', '0', '0', '10', '1', '1000000000000000'];
const sectorB = ['B2', '1', '1', '5', '1', '1000000000000000'];
const sectors = sectorA.concat(sectorB);

// specify tickets to buy (based on sectors!)
const ticket1 = {
  // 3 sft tokens from sectorA
  tokenId: 0,
  price: Number(sectorA[5]),
  amount: 3,
};
const ticket2 = {
  // nft tokens from sectorB/seat1
  tokenId: 1,
  price: Number(sectorB[5]),
  amount: 1,
};
const ticket3 = {
  // nft tokens from sectorB/seat3
  tokenId: 3,
  price: Number(sectorB[5]),
  amount: 1,
};

describe('TickeDFactory contract', function () {
  // fixture runs once but state is restored in each test
  async function deployFactoryFixture() {
    // wallets:
    const [owner, orgAuth1, concertgoer, reseller] = await ethers.getSigners();

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
    const tickeD1155Factory = await ethers.getContractFactory('tickeD1155', {
      libraries: {
        Base64: base64Lib.address,
        Cast: castLib.address,
      },
    });

    const tickeDFactory = await tickeDFactoryF.deploy();
    await tickeDFactory.deployed();
    // create concert
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
    const createdConcert = await tickeD1155Factory.attach(
      depConcerts[0].contractAddress
    );
    // mint tickets
    await createdConcert.connect(orgAuth1)['createAndMintTickets']();

    // reseller buy some tickets
    await createdConcert
      .connect(reseller)
      ['buyTicket'](ticket1.tokenId, ticket1.amount, {
        value: ethers.utils.parseUnits(
          (ticket1.price * ticket1.amount).toString(),
          'wei'
        ),
      });
    await createdConcert
      .connect(reseller)
      ['buyTicket'](ticket2.tokenId, ticket2.amount, {
        value: ethers.utils.parseUnits(
          (ticket2.price * ticket2.amount).toString(),
          'wei'
        ),
      });
    await createdConcert
      .connect(reseller)
      ['buyTicket'](ticket3.tokenId, ticket3.amount, {
        value: ethers.utils.parseUnits(
          (ticket3.price * ticket3.amount).toString(),
          'wei'
        ),
      });

    // deploy marketplace
    const nftMarketplaceFactory = await ethers.getContractFactory(
      'nftMarketplace'
    );
    const nftMarketplace = await nftMarketplaceFactory.deploy();
    await nftMarketplace.deployed();

    return {
      nftMarketplace,
      owner,
      orgAuth1,
      concertgoer,
      reseller,
    };
  }

  describe('Adding to listing', function () {
    it('Should add ticket to listing', async function () {
      const { nftMarketplace } = await loadFixture(deployFactoryFixture);
    });
  });
});
