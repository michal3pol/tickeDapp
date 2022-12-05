import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Sector, Ticket } from 'src/types/concert.model';

// constants
const concertName = 'Concert';
const concertDescription = 'First concert of xyz in town';
const concertDate = 1675450800;
const imageUrl = 'https://image.url';
// sectorName/isNumerable/seatStart/seatStop/mintedByOrg/price
const sectorA = ['A1', '0', '0', '10', '1', '1000000000000000'];
const sectorB = ['B2', '1', '1', '5', '1', '2000000000000000'];
const sectorC = ['C3', '1', '1', '10', '0', '1000000000000000'];
const sectors = sectorA.concat(sectorB).concat(sectorC);
const sectorD = ['D4', '1', '1', '10', '0', '4000000000000000'];

// runs before each
async function deployFixtureWithManySectors() {
  // wallets:
  const [owner, orgAuth1, concertgoer] = await ethers.getSigners();
  // deploy libraries
  const base64LibFactory = await ethers.getContractFactory('Base64');
  const base64Lib = await base64LibFactory.deploy();
  await base64Lib.deployed();
  const castLibFactory = await ethers.getContractFactory('Cast');
  const castLib = await castLibFactory.deploy();
  await castLib.deployed();

  const tickeD1155Factory = await ethers.getContractFactory('tickeD1155', {
    libraries: {
      Base64: base64Lib.address,
      Cast: castLib.address,
    },
  });
  const tickeD1155 = await tickeD1155Factory.deploy(
    owner.address,
    concertName,
    concertDescription,
    concertDate,
    imageUrl,
    sectors
  );
  await tickeD1155.deployed();

  return {
    tickeD1155,
    owner,
    orgAuth1,
    concertgoer,
  };
}

describe('TickeD1155 contract tests', function () {
  describe('Deploy contract & initialize sectors', function () {
    it('Should create contract and initialize fields', async function () {
      const { tickeD1155, owner } = await loadFixture(
        deployFixtureWithManySectors
      );
      expect(
        await tickeD1155['orgAddress'](),
        'Wrong organizator address'
      ).to.equal(owner.address);
      expect(await tickeD1155['name'](), 'Wrong concert name').to.equal(
        concertName
      );
      expect(
        await tickeD1155['description'](),
        'Wrong concert description'
      ).to.equal(concertDescription);
      expect(await tickeD1155['date'](), 'Wrong concert date').to.equal(
        concertDate
      );
      expect(await tickeD1155['image'](), 'Wrong concert image').to.equal(
        imageUrl
      );
    });

    it('Should create sector A1', async function () {
      const { tickeD1155 } = await loadFixture(deployFixtureWithManySectors);
      const sectors: Sector[] = await tickeD1155['getSectors']();

      expect(sectors[0].name, 'Wrong property name of sector A').to.equal(
        sectorA[0]
      );
      expect(
        sectors[0].isNumerable,
        'Wrong property isNumerable of sector A'
      ).to.equal(Boolean(JSON.parse(sectorA[1])));
      expect(
        sectors[0].seatStart,
        'Wrong property seatStart of sector A'
      ).to.equal(sectorA[2]);
      expect(
        sectors[0].seatStop,
        'Wrong property seatStop of sector A'
      ).to.equal(sectorA[3]);
      expect(
        sectors[0].mintedByOrg,
        'Wrong property mintedByOrg of sector A'
      ).to.equal(Boolean(JSON.parse(sectorA[4])));
      expect(sectors[0].price, 'Wrong property price of sector A').to.equal(
        sectorA[5]
      );
    });

    it('Should create sector B2', async function () {
      const { tickeD1155 } = await loadFixture(deployFixtureWithManySectors);
      const sectors: Sector[] = await tickeD1155['getSectors']();

      expect(sectors[1].name, 'Wrong property name of sector B').to.equal(
        sectorB[0]
      );
      expect(
        sectors[1].isNumerable,
        'Wrong property isNumerable of sector B'
      ).to.equal(Boolean(JSON.parse(sectorB[1])));
      expect(
        sectors[1].seatStart,
        'Wrong property seatStart of sector B'
      ).to.equal(sectorB[2]);
      expect(
        sectors[1].seatStop,
        'Wrong property seatStop of sector B'
      ).to.equal(sectorB[3]);
      expect(
        sectors[1].mintedByOrg,
        'Wrong property mintedByOrg of sector B'
      ).to.equal(Boolean(JSON.parse(sectorB[4])));
      expect(sectors[1].price, 'Wrong property price of sector B').to.equal(
        sectorB[5]
      );
    });

    it('Should create sector C3', async function () {
      const { tickeD1155 } = await loadFixture(deployFixtureWithManySectors);
      const sectors: Sector[] = await tickeD1155['getSectors']();

      expect(sectors[2].name, 'Wrong property name of sector C').to.equal(
        sectorC[0]
      );
      expect(
        sectors[2].isNumerable,
        'Wrong property isNumerable of sector C'
      ).to.equal(Boolean(JSON.parse(sectorC[1])));
      expect(
        sectors[2].seatStart,
        'Wrong property seatStart of sector C'
      ).to.equal(sectorC[2]);
      expect(
        sectors[2].seatStop,
        'Wrong property seatStop of sector C'
      ).to.equal(sectorC[3]);
      expect(
        sectors[2].mintedByOrg,
        'Wrong property mintedByOrg of sector C'
      ).to.equal(Boolean(JSON.parse(sectorC[4])));
      expect(sectors[2].price, 'Wrong property price of sector C').to.equal(
        sectorC[5]
      );
    });
  });

  describe('Create tickets for sectors and mint if specified', function () {
    it('Should revert if not owner try to create and mint tickets', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );

      await expect(
        tickeD1155.connect(concertgoer)['createAndMintTickets']()
      ).to.be.revertedWith('Only owner!');
    });

    it('Should revert if owner try to create and mint tickets second time', async function () {
      const { tickeD1155 } = await loadFixture(deployFixtureWithManySectors);
      await tickeD1155['createAndMintTickets']();
      await expect(tickeD1155['createAndMintTickets']()).to.be.revertedWith(
        'Add new sectors!'
      );
    });

    it('Should create and mint tickets if new sectors added', async function () {
      const { tickeD1155 } = await loadFixture(deployFixtureWithManySectors);
      await tickeD1155['createAndMintTickets']();
      await tickeD1155['addSectors'](sectorD);
      await tickeD1155['createAndMintTickets']();
    });

    it("Should mint tickets if it's specified for sector", async function () {
      const { tickeD1155 } = await loadFixture(deployFixtureWithManySectors);
      await tickeD1155['createAndMintTickets']();
      let tokenId = 0;

      if (Boolean(JSON.parse(sectorA[4]))) {
        //is minted by org
        if (Boolean(JSON.parse(sectorA[1]))) {
          //is numerable - NFT
          for (let i = Number(sectorA[2]); i <= Number(sectorA[3]); i++) {
            expect(
              await tickeD1155['balanceOf'](tickeD1155.address, tokenId),
              "Wrong amount of NFT's in sec A (numerable)"
            ).equal(1);
            tokenId++;
          }
        } else {
          expect(
            await tickeD1155['balanceOf'](tickeD1155.address, tokenId),
            "Wrong amount of SFT's in sec A"
          ).equal(Number(sectorA[3]));
          tokenId++;
        }
      } else {
        // tokenIds are assigned but should not be minted - we have to skip those tokens
        tokenId += Boolean(JSON.parse(sectorA[1]))
          ? Number(sectorA[3]) - Number(sectorA[2]) + 1
          : 1;
      }
      if (Boolean(JSON.parse(sectorB[4]))) {
        //is minted by org
        if (Boolean(JSON.parse(sectorB[1]))) {
          //is numerable - NFT
          for (let i = Number(sectorB[2]); i <= Number(sectorB[3]); i++) {
            expect(
              await tickeD1155['balanceOf'](tickeD1155.address, tokenId),
              "Wrong amount of NFT's in sec B (numerable)"
            ).equal(1);
            tokenId++;
          }
        } else {
          expect(
            await tickeD1155['balanceOf'](tickeD1155.address, tokenId),
            "Wrong amount of SFT's in sec B"
          ).equal(Number(sectorB[3]));
          tokenId++;
        }
      } else {
        // tokenIds are assigned but should not be minted - we have to skip those tokens
        tokenId += Boolean(JSON.parse(sectorB[1]))
          ? Number(sectorB[3]) - Number(sectorB[2]) + 1
          : 1;
      }
      if (Boolean(JSON.parse(sectorC[4]))) {
        //is minted by org
        if (Boolean(JSON.parse(sectorC[1]))) {
          //is numerable - NFT
          for (let i = Number(sectorC[2]); i <= Number(sectorC[3]); i++) {
            expect(
              await tickeD1155['balanceOf'](tickeD1155.address, tokenId),
              "Wrong amount of NFT's in sec C (numerable)"
            ).equal(1);
            tokenId++;
          }
        } else {
          expect(
            await tickeD1155['balanceOf'](tickeD1155.address, tokenId),
            "Wrong amount of SFT's in sec C"
          ).equal(Number(sectorC[3]));
          tokenId++;
        }
      } else {
        // tokenIds are assigned but should not be minted - we have to skip those tokens
        tokenId += Boolean(JSON.parse(sectorC[1]))
          ? Number(sectorC[3]) - Number(sectorC[2]) + 1
          : 1;
      }
    });

    it('Should assign correct attrubites for ticket in sector', async function () {
      const { tickeD1155 } = await loadFixture(deployFixtureWithManySectors);
      await tickeD1155['createAndMintTickets']();
      const sectors: Sector[] = await tickeD1155['getSectors']();

      for (let sector of sectors) {
        for (let tokenId of sector.availableTokenIds) {
          const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);

          expect(ticket.sectorName).to.be.equal(
            sector.name,
            'Wrong sector name for ticket ' + tokenId
          );
          if (sector.isNumerable) {
            expect(
              ticket.seatNumber,
              'Wrong seat for ticket ' + tokenId
            ).to.be.at.least(sector.seatStart);
            expect(
              ticket.seatNumber,
              'Wrong seat for ticket ' + tokenId
            ).to.be.not.above(sector.seatStop);
          } else {
            expect(
              ticket.seatNumber,
              'Wrong seat for ticket ' + tokenId
            ).to.be.equal(0);
          }
          expect(ticket.minted).to.be.equal(
            sector.mintedByOrg,
            'Wrong minted toggle for ticket ' + tokenId
          );
          expect(ticket.price).to.be.equal(
            sector.price,
            'Wrong price for ticket ' + tokenId
          );
          expect(ticket.sold).to.be.equal(
            false,
            'Wrong price for ticket ' + tokenId
          );
        }
      }
    });
  });

  describe('Buying tickets', function () {
    it("Should revert if tokenId doesn't exists", async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const tokenId = 990;
      const amount = 1;

      await expect(
        tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount)
      ).to.be.revertedWith('Too big tokenId');
    });

    it('Should revert if user want to buy more than is available', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const tokenId = 0;
      const amount = await tickeD1155['balanceOf'](tickeD1155.address, tokenId);

      await expect(
        tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount + 1)
      ).to.be.revertedWith('Not enough tokens');
    });

    it('Should revert if user dont pay', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const tokenId = 0;
      const amount = await tickeD1155['balanceOf'](tickeD1155.address, tokenId);

      await expect(
        tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount)
      ).to.be.revertedWith('Too small value');
    });

    it('Should revert if user dont pay enough', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const tokenId = 0;
      const amount = await tickeD1155['balanceOf'](tickeD1155.address, tokenId);
      const ticket = await tickeD1155['ticketAttr'](tokenId);

      await expect(
        tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount, {
          value: ethers.utils.parseUnits(
            ((ticket.price - 1) * amount).toString(),
            'wei'
          ),
        })
      ).to.be.revertedWith('Too small value');
    });

    it('Should revert if ticket is already sold', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const tokenId = 0;
      const amount = await tickeD1155['balanceOf'](tickeD1155.address, tokenId);
      const ticket = await tickeD1155['ticketAttr'](tokenId);
      await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount, {
        value: ethers.utils.parseUnits(
          (ticket.price * amount).toString(),
          'wei'
        ),
      });
      await expect(
        tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount, {
          value: ethers.utils.parseUnits(
            (ticket.price * amount).toString(),
            'wei'
          ),
        })
      ).to.be.revertedWith('Not enough tokens');
    });

    it('Should buy and transfer token', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const tokenId = 0;
      const amount = await tickeD1155['balanceOf'](tickeD1155.address, tokenId);
      const ticket = await tickeD1155['ticketAttr'](tokenId);
      await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount, {
        value: ethers.utils.parseUnits(
          (ticket.price * amount).toString(),
          'wei'
        ),
      });
      expect(
        await tickeD1155['balanceOf'](concertgoer.address, tokenId)
      ).to.be.equal(amount);
    });

    it('Should buy, mint and transfer not yet minted token', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const sectors = await tickeD1155['getSectors']();

      // find not minted ticket
      for (let sector of sectors) {
        for (let tokenId of sector.availableTokenIds) {
          const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);
          if (ticket.minted === false) {
            await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, 1, {
              value: ethers.utils.parseUnits(
                (ticket.price.toNumber() * 1).toString(),
                'wei'
              ),
            });
            expect(
              await tickeD1155['balanceOf'](concertgoer.address, tokenId)
            ).to.be.equal(1);
            break;
          }
        }
      }
    });

    it('Should buy and transfer minted unique token (NFT)', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const sectors = await tickeD1155['getSectors']();

      for (let sector of sectors) {
        if (sector.isNumerable) {
          for (let tokenId of sector.availableTokenIds) {
            const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);
            if (ticket.minted) {
              await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, 1, {
                value: ethers.utils.parseUnits(
                  (ticket.price.toNumber() * 1).toString(),
                  'wei'
                ),
              });
              expect(
                await tickeD1155['balanceOf'](concertgoer.address, tokenId)
              ).to.be.equal(1);
              expect(
                await tickeD1155['balanceOf'](tickeD1155.address, tokenId)
              ).to.be.equal(0);
              break;
            }
          }
        }
      }
    });

    it('Should buy and transfer part of possible amount of minted token (SFT)', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const sectors = await tickeD1155['getSectors']();

      for (let sector of sectors) {
        if (!sector.isNumerable) {
          for (let tokenId of sector.availableTokenIds) {
            const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);
            const amount = await tickeD1155['balanceOf'](
              tickeD1155.address,
              tokenId
            );
            const part = amount - 1;
            if (ticket.minted) {
              await tickeD1155
                .connect(concertgoer)
                ['buyTicket'](tokenId, part, {
                  value: ethers.utils.parseUnits(
                    (ticket.price.toNumber() * part).toString(),
                    'wei'
                  ),
                });
              expect(
                await tickeD1155['balanceOf'](concertgoer.address, tokenId)
              ).to.be.equal(part);
              expect(
                await tickeD1155['balanceOf'](tickeD1155.address, tokenId)
              ).to.be.equal(amount - part);
              break;
            }
          }
        }
      }
    });

    it('Should buy all possible amount of SFT token and add to soldTokenIds', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const sectors = await tickeD1155['getSectors']();

      for (let sector of sectors) {
        if (!sector.isNumerable && sector.mintedByOrg) {
          const tokenId = sector.availableTokenIds[0];
          const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);
          const amount = await tickeD1155['balanceOf'](
            tickeD1155.address,
            tokenId
          );
          await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, amount, {
            value: ethers.utils.parseUnits(
              (ticket.price.toNumber() * amount).toString(),
              'wei'
            ),
          });
          const soldTokenId = await tickeD1155['soldTokenIds'](
            ticket.sectorName,
            0
          );
          expect(soldTokenId).to.be.equal(tokenId);
        }
      }
    });

    it('Should buy part of possible amount SFT token and not add to soldTokenIds', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const sectors = await tickeD1155['getSectors']();

      for (let sector of sectors) {
        if (!sector.isNumerable && sector.mintedByOrg) {
          const tokenId = sector.availableTokenIds[0];
          const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);
          const amount = await tickeD1155['balanceOf'](
            tickeD1155.address,
            tokenId
          );
          const part = amount - 1;
          await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, part, {
            value: ethers.utils.parseUnits(
              (ticket.price.toNumber() * part).toString(),
              'wei'
            ),
          });
          const soldTokenIds = await tickeD1155['getSoldTokenIds'](
            ticket.sectorName
          );
          expect(soldTokenIds.length).to.be.equal(0);
        }
      }
    });

    it('Should buy minted unique NFT token and add to soldTokenIds', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const sectors = await tickeD1155['getSectors']();

      for (let sector of sectors) {
        if (sector.isNumerable && sector.mintedByOrg) {
          const tokenId = sector.availableTokenIds[0];
          const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);
          await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, 1, {
            value: ethers.utils.parseUnits(
              (ticket.price.toNumber() * 1).toString(),
              'wei'
            ),
          });
          const soldTokenId = await tickeD1155['soldTokenIds'](
            ticket.sectorName,
            0
          );
          expect(soldTokenId).to.be.equal(tokenId);
        }
      }
    });

    it('Should buy not yet minted unique NFT token and add to soldTokenIds', async function () {
      const { tickeD1155, concertgoer } = await loadFixture(
        deployFixtureWithManySectors
      );
      await tickeD1155['createAndMintTickets']();
      const sectors = await tickeD1155['getSectors']();

      for (let sector of sectors) {
        if (sector.isNumerable && !sector.mintedByOrg) {
          const tokenId = sector.availableTokenIds[0];
          const ticket: Ticket = await tickeD1155['ticketAttr'](tokenId);
          await tickeD1155.connect(concertgoer)['buyTicket'](tokenId, 1, {
            value: ethers.utils.parseUnits(
              (ticket.price.toNumber() * 1).toString(),
              'wei'
            ),
          });
          const soldTokenId = await tickeD1155['soldTokenIds'](
            ticket.sectorName,
            0
          );
          expect(soldTokenId).to.be.equal(tokenId);
        }
      }
    });
  });

  // uri, addtickets, withdraw
});
