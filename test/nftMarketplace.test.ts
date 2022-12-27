import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Listing, SellerOffer } from 'src/types/marketplace.model';
import { BigNumber } from 'ethers';

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

describe('Nft Marketplace contract', function () {
  // fixture runs once but state is restored in each test
  async function deployFactoryFixture() {
    // wallets:
    const [owner, orgAuth1, concertgoer, reseller, walletAccount] =
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

    // approve marketplace
    await createdConcert
      .connect(reseller)
      ['setApprovalForAll'](nftMarketplace.address, true);

    const concertAddress = depConcerts[0].contractAddress;
    return {
      nftMarketplace,
      owner,
      orgAuth1,
      concertgoer,
      reseller,
      concertAddress,
      createdConcert,
      walletAccount,
    };
  }

  describe('Adding to listing', function () {
    it('Should add seller to sellerIds', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };

      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      const sellerIds: string[] = await nftMarketplace['getSellerIds'](
        concertAddress
      );

      expect(sellerIds[0], 'Wrong sellerId').to.be.equal(
        reseller.address
          .concat(BigNumber.from(ticket1.tokenId).toHexString())
          .toLowerCase()
      );
    });

    it('Should add seller to sellerOffers', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      const sellerOffers: SellerOffer[] = await nftMarketplace[
        'getOffersBySeller'
      ](reseller.address);

      expect(sellerOffers[0].sellerId, 'Wrong sellerId').to.be.equal(
        reseller.address
          .concat(BigNumber.from(ticket1.tokenId).toHexString())
          .toLowerCase()
      );
      expect(sellerOffers[0].concertAddr, 'Wrong concertAddress').to.be.equal(
        concertAddress
      );
    });

    it('Should add ticket offer to listing', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };

      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      const newListing: Listing = await nftMarketplace['listing'](
        concertAddress,
        reseller.address
          .concat(BigNumber.from(ticket1.tokenId).toHexString())
          .toLowerCase()
      );

      expect(newListing.tokenId, 'Wrong ticket tokenId in listing').to.be.equal(
        ticket1.tokenId
      );
      expect(newListing.amount, 'Wrong ticket amount in listing').to.be.equal(
        ticket1.amount
      );
      expect(newListing.price, 'Wrong ticket price in listing').to.be.equal(
        ticket1.price
      );
      expect(newListing.seller, 'Wrong ticket seller in listing').to.be.equal(
        reseller.address
      );
    });

    it('Should add two different tickets offer to listing', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing1: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      const listing2: Listing = {
        tokenId: ticket2.tokenId,
        amount: ticket2.amount,
        price: BigNumber.from(ticket2.price),
        seller: reseller.address,
      };

      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing1);
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing2);

      const newListing1: Listing = await nftMarketplace['listing'](
        concertAddress,
        reseller.address
          .concat(BigNumber.from(ticket1.tokenId).toHexString())
          .toLowerCase()
      );
      const newListing2: Listing = await nftMarketplace['listing'](
        concertAddress,
        reseller.address
          .concat(BigNumber.from(ticket2.tokenId).toHexString())
          .toLowerCase()
      );

      expect(
        newListing1.tokenId,
        'Wrong ticket(1) tokenId in listing'
      ).to.be.equal(ticket1.tokenId);
      expect(
        newListing1.amount,
        'Wrong ticket(1) amount in listing'
      ).to.be.equal(ticket1.amount);
      expect(newListing1.price, 'Wrong ticket(1) price in listing').to.be.equal(
        ticket1.price
      );
      expect(
        newListing1.seller,
        'Wrong ticket(1) seller in listing'
      ).to.be.equal(reseller.address);
      // second ticket
      expect(
        newListing2.tokenId,
        'Wrong ticket(2) tokenId in listing'
      ).to.be.equal(ticket2.tokenId);
      expect(
        newListing2.amount,
        'Wrong ticket(2) amount in listing'
      ).to.be.equal(ticket2.amount);
      expect(newListing2.price, 'Wrong ticket(2) price in listing').to.be.equal(
        ticket2.price
      );
      expect(
        newListing2.seller,
        'Wrong ticket(2) seller in listing'
      ).to.be.equal(reseller.address);
    });

    it('Should revert adding ticket offer if its listed', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount - (ticket1.amount - 1),
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await expect(
        nftMarketplace.connect(reseller)['insertOffer'](concertAddress, listing)
      ).to.be.revertedWith('Already listed - use update');
    });

    it('Should revert adding ticket offer if user dont own this amount', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount + 1,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };

      await expect(
        nftMarketplace.connect(reseller)['insertOffer'](concertAddress, listing)
      ).to.be.revertedWith("Don't own enough tokens");
    });

    it('Should revert adding ticket offer if price equals 0', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(0),
        seller: reseller.address,
      };

      await expect(
        nftMarketplace.connect(reseller)['insertOffer'](concertAddress, listing)
      ).to.be.revertedWith('Invalid price');
    });

    it('Should transfer tokens to smartcontract', async function () {
      const { nftMarketplace, reseller, concertAddress, createdConcert } =
        await loadFixture(deployFactoryFixture);

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };

      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      expect(
        await createdConcert['balanceOf'](reseller.address, ticket1.tokenId)
      ).to.be.equal(0);
      expect(
        await createdConcert['balanceOf'](
          nftMarketplace.address,
          ticket1.tokenId
        )
      ).to.be.equal(ticket1.amount);
    });
  });

  describe('Update listing', function () {
    it('Should update offer', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      const newAmount = ticket1.amount - 1;
      const newPrice = BigNumber.from(ticket1.price + 10000000);
      const updateListing: Listing = {
        tokenId: ticket1.tokenId,
        amount: newAmount,
        price: newPrice,
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['updateOffer'](concertAddress, updateListing);

      const newListing: Listing = await nftMarketplace['listing'](
        concertAddress,
        reseller.address
          .concat(BigNumber.from(ticket1.tokenId).toHexString())
          .toLowerCase()
      );

      expect(newListing.tokenId, 'Wrong ticket tokenId in listing').to.be.equal(
        ticket1.tokenId
      );
      expect(newListing.amount, 'Wrong ticket amount in listing').to.be.equal(
        newAmount
      );
      expect(newListing.price, 'Wrong ticket price in listing').to.be.equal(
        newPrice
      );
      expect(newListing.seller, 'Wrong ticket seller in listing').to.be.equal(
        reseller.address
      );
    });

    it('Should revert updating ticket offer if price equals 0', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );
      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      const newAmount = ticket1.amount;
      const newPrice = BigNumber.from(0);
      const updateListing: Listing = {
        tokenId: ticket1.tokenId,
        amount: newAmount,
        price: newPrice,
        seller: reseller.address,
      };

      await expect(
        nftMarketplace
          .connect(reseller)
          ['updateOffer'](concertAddress, updateListing)
      ).to.be.revertedWith('Invalid price');
    });

    it('Should revert updating offer if ticket is not listed', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };

      await expect(
        nftMarketplace.connect(reseller)['updateOffer'](concertAddress, listing)
      ).to.be.revertedWith('Not yet listed');
    });

    it('Should revert if trying to update offer that user dont own', async function () {
      const { nftMarketplace, reseller, concertAddress, concertgoer } =
        await loadFixture(deployFactoryFixture);

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      const newPrice = BigNumber.from(0);
      const updateListing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: newPrice,
        seller: reseller.address,
      };
      await expect(
        nftMarketplace
          .connect(concertgoer)
          ['updateOffer'](concertAddress, updateListing)
      ).to.be.revertedWith('Not yet listed');
    });
  });

  describe('Delete listing', function () {
    it('Should delete offer', async function () {
      const { nftMarketplace, reseller, concertAddress } = await loadFixture(
        deployFactoryFixture
      );

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await nftMarketplace
        .connect(reseller)
        ['deleteOffer'](concertAddress, ticket1.tokenId);

      const newListing: Listing = await nftMarketplace['listing'](
        concertAddress,
        reseller.address
          .concat(BigNumber.from(ticket1.tokenId).toHexString())
          .toLowerCase()
      );

      expect(newListing.tokenId, 'Wrong ticket tokenId in listing').to.be.equal(
        0
      );
      expect(newListing.amount, 'Wrong ticket amount in listing').to.be.equal(
        0
      );
      expect(newListing.price, 'Wrong ticket price in listing').to.be.equal(0);
      expect(newListing.seller, 'Wrong ticket seller in listing').to.be.equal(
        '0x0000000000000000000000000000000000000000'
      );
    });

    it('Should revert if trying to delete offer that user dont own', async function () {
      const { nftMarketplace, reseller, concertAddress, concertgoer } =
        await loadFixture(deployFactoryFixture);

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await expect(
        nftMarketplace
          .connect(concertgoer)
          ['deleteOffer'](concertAddress, ticket1.tokenId)
      ).to.be.revertedWith('Not yet listed');
    });

    it('Should revert deleting offer that is not listed', async function () {
      const { nftMarketplace, concertAddress, concertgoer } = await loadFixture(
        deployFactoryFixture
      );

      await expect(
        nftMarketplace
          .connect(concertgoer)
          ['deleteOffer'](concertAddress, ticket1.tokenId)
      ).to.be.revertedWith('Not yet listed');
    });
  });

  describe('Buy tickets', function () {
    it('Should buy ticket and transfer token', async function () {
      const {
        nftMarketplace,
        reseller,
        concertAddress,
        concertgoer,
        createdConcert,
      } = await loadFixture(deployFactoryFixture);

      const amount = 1;
      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await nftMarketplace
        .connect(concertgoer)
        ['buyTicket'](concertAddress, reseller.address, ticket1.tokenId, 1, {
          value: ethers.utils.parseUnits(
            (ticket1.price * amount).toString(),
            'wei'
          ),
        });

      expect(
        await createdConcert['balanceOf'](
          nftMarketplace.address,
          ticket1.tokenId
        )
      ).to.be.equal(ticket1.amount - amount);
      expect(
        await createdConcert['balanceOf'](concertgoer.address, ticket1.tokenId)
      ).to.be.equal(amount);
    });

    it('Should update seller balance after buying', async function () {
      const { nftMarketplace, reseller, concertAddress, concertgoer } =
        await loadFixture(deployFactoryFixture);

      const amount = 1;
      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);
      const resellFee = (ticket1.price * amount) * 0.05;
      await nftMarketplace
        .connect(concertgoer)
        ['buyTicket'](concertAddress, reseller.address, ticket1.tokenId, 1, {
          value: ethers.utils.parseUnits(
            (ticket1.price * amount).toString(),
            'wei'
          ),
        });

      expect(await nftMarketplace['balance'](reseller.address)).to.be.equal(
        (ticket1.price * amount) - resellFee
      );
    });

    it('Should delete offer after buying', async function () {
      const { nftMarketplace, reseller, concertAddress, concertgoer } =
        await loadFixture(deployFactoryFixture);

      const amount = 1;
      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await nftMarketplace
        .connect(concertgoer)
        ['buyTicket'](
          concertAddress,
          reseller.address,
          ticket1.tokenId,
          ticket1.amount,
          {
            value: ethers.utils.parseUnits(
              (ticket1.price * ticket1.amount).toString(),
              'wei'
            ),
          }
        );

      const newListing: Listing = await nftMarketplace['listing'](
        concertAddress,
        reseller.address
          .concat(BigNumber.from(ticket1.tokenId).toHexString())
          .toLowerCase()
      );
      expect(newListing.tokenId, 'Wrong ticket tokenId in listing').to.be.equal(
        0
      );
      expect(newListing.amount, 'Wrong ticket amount in listing').to.be.equal(
        0
      );
      expect(newListing.price, 'Wrong ticket price in listing').to.be.equal(0);
      expect(newListing.seller, 'Wrong ticket seller in listing').to.be.equal(
        '0x0000000000000000000000000000000000000000'
      );
    });

    it('Should revert if ticket is not listed', async function () {
      const { nftMarketplace, reseller, concertAddress, concertgoer } =
        await loadFixture(deployFactoryFixture);

      await expect(
        nftMarketplace
          .connect(concertgoer)
          ['buyTicket'](concertAddress, reseller.address, ticket1.tokenId, 1, {
            value: ethers.utils.parseUnits((10 * 1).toString(), 'wei'),
          })
      ).to.be.revertedWith('Not yet listed');
    });

    it('Should revert if someone try to buy more than available', async function () {
      const { nftMarketplace, reseller, concertAddress, concertgoer } =
        await loadFixture(deployFactoryFixture);

      const amount = 1;
      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await expect(
        nftMarketplace.connect(concertgoer)['buyTicket'](
          concertAddress,
          reseller.address,
          ticket1.tokenId,
          ticket1.amount + 1, // amount + 1
          {
            value: ethers.utils.parseUnits(
              (ticket1.price * ticket1.amount).toString(),
              'wei'
            ),
          }
        )
      ).to.be.revertedWith('Invalid amount');
    });

    it('Should revert if someone try to pay less than should', async function () {
      const { nftMarketplace, reseller, concertAddress, concertgoer } =
        await loadFixture(deployFactoryFixture);

      const amount = 1;
      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await expect(
        nftMarketplace
          .connect(concertgoer)
          ['buyTicket'](
            concertAddress,
            reseller.address,
            ticket1.tokenId,
            ticket1.amount,
            {
              value: ethers.utils.parseUnits(
                (ticket1.price - 1 * ticket1.amount).toString(), // price - 1
                'wei'
              ),
            }
          )
      ).to.be.revertedWith('Not enough ETH');
    });
  });

  describe('Withdraw', function () {
    it('Should withdraw credits - based on sellings', async function () {
      const {
        nftMarketplace,
        reseller,
        concertAddress,
        concertgoer,
        walletAccount,
      } = await loadFixture(deployFactoryFixture);

      const credits = ticket1.price * 0.95;
      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await nftMarketplace
        .connect(concertgoer)
        ['buyTicket'](concertAddress, reseller.address, ticket1.tokenId, 1, {
          value: ethers.utils.parseUnits((ticket1.price * 1).toString(), 'wei'),
        });

      const prevBalance = await walletAccount.getBalance();
      await nftMarketplace.connect(reseller)['withdraw'](walletAccount.address);
      const newBalance = await walletAccount.getBalance();
      expect(newBalance).to.be.equal(prevBalance.add(BigNumber.from(credits)));
    });

    it('Should revert withdrawing credits second time', async function () {
      const {
        nftMarketplace,
        reseller,
        concertAddress,
        concertgoer,
        walletAccount,
      } = await loadFixture(deployFactoryFixture);

      const listing: Listing = {
        tokenId: ticket1.tokenId,
        amount: ticket1.amount,
        price: BigNumber.from(ticket1.price),
        seller: reseller.address,
      };
      await nftMarketplace
        .connect(reseller)
        ['insertOffer'](concertAddress, listing);

      await nftMarketplace
        .connect(concertgoer)
        ['buyTicket'](concertAddress, reseller.address, ticket1.tokenId, 1, {
          value: ethers.utils.parseUnits((ticket1.price * 1).toString(), 'wei'),
        });

      await nftMarketplace.connect(reseller)['withdraw'](walletAccount.address);
      await expect(
        nftMarketplace.connect(reseller)['withdraw'](walletAccount.address)
      ).to.be.revertedWith('0 credits');
    });

    it('Should revert withdrawing credits without selling', async function () {
      const { nftMarketplace, reseller } = await loadFixture(
        deployFactoryFixture
      );

      await expect(
        nftMarketplace.connect(reseller)['withdraw'](reseller.address)
      ).to.be.revertedWith('0 credits');
    });
  });
});
