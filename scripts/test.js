
// SCRIPT FOR RUNNING LOCALLY WITH HARDHAT

const { ethers } = require("hardhat");

const main = async () => {

    // wallets:
    const [owner, addr1, addr2] = await ethers.getSigners();
    //waveTxn = await waveContract.connect(addr1);

    // first deploy libraries
    const nftLibFactory = await hre.ethers.getContractFactory('Base64');
    const nftLib = await nftLibFactory.deploy();
    await nftLib.deployed();
    console.log("Library Base64 deployed to:", nftLib.address);

    const nftLibFactory1 = await hre.ethers.getContractFactory('Cast');
    const nftLib1 = await nftLibFactory1.deploy();
    await nftLib1.deployed();
    console.log("Library Cast deployed to:", nftLib1.address);
    
    // deploy contract
    const nftContractFactory = await hre.ethers.getContractFactory('tickeDFactory', {
      libraries: {
        Base64: nftLib.address,
        Cast: nftLib1.address,
      }
    });

    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    
    // add to whitelist
    let access = await nftContract.setOrganizatorPermission(owner.address, true);
    await access.wait();


    // FIRST CONCERT
    const st = ["A1","0","0","1000","1","1","A2","1","1","100","1","1","C5","1","1","20","1","500"];    
    let unixTime = 	1669492800; // Sat Nov 26 2022 21:00:00 GMT+0100 (czas środkowoeuropejski standardowy)
    let svg = "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='829.000000pt' height='440.000000pt' viewBox='0 0 829.000000 440.000000' preserveAspectRatio='xMidYMid meet'><g transform='translate(0.000000,440.000000) scale(0.100000,-0.100000)' fill='#000000' stroke='none'><path d='M3135 4234 c-22 -2 -103 -9 -180 -15 -632 -51 -1203 -247 -1453 -498 -107 -108 -162 -223 -162 -337 0 -113 86 -269 203 -365 287 -240 758 -394 1407 -461 160 -16 706 -16 860 0 701 75 1201 249 1454 506 140 142 184 283 136 437 -25 83 -68 150 -145 225 -247 243 -759 422 -1395 490 -135 14 -635 27 -725 18z m730 -69 c753 -82 1319 -322 1467 -622 30 -61 33 -76 33 -153 0 -77 -3 -92 -33 -153 -151 -307 -732 -547 -1522 -629 -187 -19 -716 -16 -908 5 -745 84 -1284 304 -1459 597 -27 45 -53 133 -53 181 0 99 77 242 176 325 308 259 832 416 1554 468 125 9 602 -3 745 -19z'/><path d='M2584 3604 c-79 -39 -66 -147 22 -189 69 -32 94 -54 94 -83 0 -35 -10 -49 -43 -61 -31 -12 -71 -6 -102 15 -27 19 -35 17 -35 -6 0 -42 90 -72 154 -50 49 16 76 53 76 104 0 49 -21 76 -83 107 -85 43 -111 91 -65 123 28 20 55 20 92 1 36 -19 36 -19 36 9 0 42 -86 60 -146 30z'/><path d='M2902 3601 c-112 -53 -125 -278 -20 -354 60 -45 189 -24 196 32 2 13 0 21 -5 19 -87 -43 -119 -44 -167 -7 -47 37 -58 158 -20 231 28 54 104 69 159 32 27 -19 35 -17 35 6 0 50 -106 74 -178 41z'/><path d='M3154 3597 c-2 -7 -3 -91 -2 -187 l3 -175 103 -3 c97 -3 102 -2 102 18 0 18 -6 20 -80 20 l-80 0 0 70 0 69 67 3 c55 2 68 6 71 21 3 15 -5 17 -67 17 l-71 0 0 60 0 60 80 0 c73 0 80 2 80 20 0 19 -7 20 -100 20 -73 0 -102 -4 -106 -13z'/><path d='M3447 3604 c-4 -4 -7 -90 -7 -191 l0 -183 25 0 25 0 0 158 0 157 65 -115 c112 -202 112 -202 143 -198 l27 3 0 185 c0 184 0 185 -22 188 -22 3 -22 2 -25 -146 l-3 -150 -81 146 c-74 132 -85 147 -111 150 -16 2 -32 0 -36 -4z'/><path d='M3834 3597 c-2 -7 -3 -91 -2 -187 l3 -175 103 -3 c97 -3 102 -2 102 18 0 18 -6 20 -80 20 l-80 0 0 70 0 69 67 3 c55 2 68 6 71 21 3 15 -5 17 -67 17 l-71 0 0 60 0 60 80 0 c73 0 80 2 80 20 0 19 -7 20 -100 20 -73 0 -102 -4 -106 -13z'/><path d='M5730 3385 l0 -555 875 0 875 0 0 555 0 555 -875 0 -875 0 0 -555z m1700 0 l0 -505 -405 0 c-366 0 -406 2 -412 16 -5 14 8 110 23 165 3 11 19 19 42 22 83 13 108 20 138 43 29 21 31 28 38 103 5 67 3 87 -11 114 -10 18 -20 63 -23 105 -3 40 -9 72 -15 72 -6 0 -11 -66 -13 -172 -2 -122 -6 -174 -15 -180 -6 -4 -30 -8 -52 -8 -23 0 -47 -6 -53 -12 -10 -10 -17 -10 -31 -1 -10 7 -22 8 -27 3 -5 -5 -31 -10 -59 -12 -27 -2 -49 -7 -48 -13 1 -5 -5 -14 -13 -18 -27 -15 -3 -27 54 -27 43 0 53 -3 44 -12 -8 -8 -12 -45 -12 -100 l0 -88 -400 0 -400 0 0 505 0 505 825 0 825 0 0 -505z m-603 -117 c-2 -13 -4 -5 -4 17 -1 22 1 32 4 23 2 -10 2 -28 0 -40z m-117 -148 c-8 -5 -19 -10 -25 -10 -5 0 -3 5 5 10 8 5 20 10 25 10 6 0 3 -5 -5 -10z'/><path d='M6365 3809 c-4 -6 2 -13 14 -16 18 -5 21 -13 21 -62 -1 -61 -26 -126 -50 -126 -12 0 -16 20 -20 95 -3 53 -9 95 -15 95 -6 0 -11 -41 -13 -96 l-3 -96 -115 -6 c-63 -4 -119 -9 -125 -12 -21 -13 5 -25 54 -25 40 0 48 -3 39 -12 -18 -18 -15 -139 4 -166 18 -27 39 -20 24 8 -14 25 -13 30 5 24 13 -5 15 6 15 69 l0 75 80 4 c90 4 113 18 136 85 17 48 18 145 2 161 -15 15 -45 16 -53 1z'/><path d='M6518 3723 c-8 -10 -18 -31 -22 -48 -4 -16 -20 -46 -36 -66 -16 -20 -26 -39 -23 -43 14 -14 34 -4 51 23 17 28 17 28 17 -67 0 -64 4 -97 12 -99 8 -3 13 23 17 84 3 48 8 117 12 152 6 69 -3 92 -28 64z'/><path d='M7067 3399 c-26 -15 -68 -106 -70 -151 -3 -55 19 -60 27 -7 10 62 57 139 84 139 19 0 32 -55 32 -135 0 -83 0 -84 -30 -98 -29 -15 -31 -14 -54 16 -22 28 -28 30 -53 21 -23 -8 -28 -15 -28 -44 l0 -35 123 -3 c97 -2 123 0 120 10 -3 7 -15 14 -29 16 -24 3 -24 3 -21 110 2 93 0 111 -17 140 -22 33 -50 41 -84 21z m-32 -259 c3 -5 -3 -10 -14 -10 -12 0 -21 5 -21 10 0 6 6 10 14 10 8 0 18 -4 21 -10z'/><path d='M130 1850 l0 -530 3110 0 3110 0 0 530 0 530 -3110 0 -3110 0 0 -530z m6170 0 l0 -480 -3060 0 -3060 0 0 480 0 480 3060 0 3060 0 0 -480z'/><path d='M3822 2125 c-39 -17 -34 -38 6 -29 33 8 54 23 46 35 -7 12 -13 11 -52 -6z'/><path d='M5886 2133 c-3 -3 -6 -14 -6 -24 0 -9 -12 -26 -27 -37 -25 -18 -26 -21 -10 -28 24 -9 67 31 67 62 0 24 -13 38 -24 27z'/><path d='M2477 2114 c-10 -11 -8 -82 2 -89 13 -8 19 4 22 49 4 37 -8 55 -24 40z'/><path d='M1369 2094 c-7 -9 -24 -20 -37 -25 -24 -9 -22 -29 3 -29 19 0 76 50 69 61 -8 13 -20 11 -35 -7z'/><path d='M2941 1853 c-36 -98 -66 -184 -69 -190 -3 -8 5 -13 21 -13 22 0 28 8 42 50 l17 51 80 -3 80 -3 17 -45 c12 -32 23 -46 39 -48 32 -5 29 11 -41 203 -61 166 -63 170 -92 173 l-30 3 -64 -178z m126 27 l32 -90 -64 0 c-36 0 -65 3 -65 7 0 15 55 173 60 173 3 0 20 -40 37 -90z'/><path d='M3312 1998 c-31 -20 -52 -40 -52 -50 0 -23 7 -23 48 2 18 11 35 20 37 20 3 0 5 -63 5 -139 l0 -140 -42 -3 c-30 -2 -43 -8 -43 -18 0 -12 20 -16 108 -18 102 -3 107 -2 107 18 0 17 -6 20 -40 20 l-40 0 0 170 c0 196 2 193 -88 138z'/><path d='M4834 1846 c-18 -14 -18 -15 -1 -22 22 -8 46 11 31 26 -7 7 -17 5 -30 -4z'/><path d='M2522 1712 c-21 -3 -47 -34 -36 -45 6 -6 61 20 69 33 7 12 -6 17 -33 12z'/><path d='M888 1631 c-64 -18 -78 -28 -55 -37 17 -6 113 22 122 36 10 16 -10 16 -67 1z'/><path d='M3600 1626 c-13 -17 -10 -81 5 -81 12 0 25 84 14 90 -4 3 -12 -2 -19 -9z'/><path d='M1865 1600 c-11 -18 5 -31 26 -20 11 6 17 15 14 21 -8 12 -32 12 -40 -1z'/><path d='M5175 1540 c-3 -5 0 -13 8 -16 23 -8 127 0 130 11 3 14 -129 19 -138 5z'/><path d='M130 590 l0 -500 618 0 c339 0 922 0 1294 0 675 0 677 0 680 -20 4 -27 22 -27 26 0 3 20 9 20 253 20 l249 0 0 500 0 500 -1560 0 -1560 0 0 -500z m3070 0 l0 -450 -223 0 -223 0 4 41 c3 29 7 38 15 30 20 -20 24 -11 31 81 3 56 12 101 21 115 17 25 11 47 -10 39 -7 -2 -15 4 -18 14 -5 18 2 19 82 22 81 3 86 4 89 26 2 13 10 22 21 22 26 0 88 70 106 119 17 50 20 192 5 222 -14 24 -32 24 -54 0 -19 -21 -12 -51 7 -32 22 22 27 9 27 -68 0 -93 -12 -135 -53 -179 -50 -52 -54 -46 -53 91 1 165 -17 171 -26 9 -4 -68 -8 -125 -10 -127 -2 -1 -40 -5 -85 -9 l-83 -6 0 26 c0 14 7 41 16 60 26 55 16 64 -71 64 -41 0 -75 3 -75 8 0 4 27 36 60 71 55 57 70 86 44 86 -5 0 -37 -30 -72 -67 -52 -54 -63 -71 -60 -95 3 -28 4 -28 76 -31 65 -3 73 -5 67 -20 -4 -9 -10 -36 -12 -59 l-5 -42 -54 -3 c-76 -4 -72 -22 6 -28 l65 -4 -78 -6 c-42 -3 -77 -9 -77 -15 0 -6 38 -11 88 -13 l87 -3 -6 -93 c-4 -52 -12 -103 -18 -114 -6 -12 -14 -45 -19 -74 l-7 -53 -668 -3 -667 -2 4 22 c3 13 10 59 16 103 6 44 13 94 16 110 3 17 8 44 10 60 12 79 1 73 133 77 l120 3 55 60 c59 63 70 90 64 165 -5 67 -22 54 -29 -20 -6 -70 -27 -110 -79 -148 l-28 -21 -8 152 c-12 198 -29 198 -29 -1 l0 -147 -88 -3 c-54 -2 -94 2 -102 8 -9 7 -15 8 -19 1 -4 -6 -50 -10 -109 -9 -80 0 -102 -2 -102 -13 0 -11 23 -15 101 -17 l101 -3 -9 -47 c-25 -131 -37 -211 -37 -254 -1 -86 58 -78 -602 -78 l-589 0 0 450 0 450 1510 0 1510 0 0 -450z m-260 -70 c0 -6 -35 -10 -87 -9 -62 1 -79 4 -58 9 45 11 145 11 145 0z'/><path d='M2376 893 c-3 -3 -6 -43 -6 -87 0 -103 -15 -195 -35 -215 -13 -14 -15 -12 -15 15 0 44 20 147 32 161 12 15 6 88 -7 88 -5 0 -13 -16 -17 -35 -4 -19 -14 -64 -22 -100 -9 -36 -16 -91 -16 -124 l0 -59 -130 5 c-71 3 -133 1 -137 -3 -4 -4 -21 -9 -38 -11 -41 -4 -38 -22 5 -26 19 -1 54 -5 78 -8 l43 -5 -3 -47 c-2 -34 -7 -47 -18 -47 -12 0 -17 -19 -22 -85 -4 -47 -8 -101 -10 -120 -3 -31 0 -35 23 -38 26 -3 26 -3 33 90 3 51 11 109 16 128 6 19 10 52 10 72 l0 38 85 0 c67 0 85 3 85 14 0 8 16 35 35 60 40 52 55 121 55 253 0 75 -7 102 -24 86z'/><path d='M541 858 c-5 -14 -32 -45 -60 -69 -28 -24 -51 -49 -51 -56 0 -26 20 -21 60 17 48 45 59 45 41 2 -15 -35 -11 -104 6 -109 11 -4 16 25 29 161 7 65 -8 97 -25 54z'/><path d='M735 858 c-3 -7 -6 -74 -7 -148 l-3 -135 -200 -5 c-123 -3 -200 -9 -200 -15 0 -13 455 -19 468 -6 20 20 40 292 22 301 -10 5 -16 -33 -33 -197 -12 -120 -22 -94 -22 60 0 87 -4 148 -10 152 -6 3 -12 0 -15 -7z'/><path d='M1440 847 c-40 -21 -45 -28 -45 -57 0 -18 6 -35 13 -37 7 -3 12 5 12 19 0 16 10 30 29 41 42 25 51 21 51 -21 0 -63 -70 -110 -180 -121 -87 -9 -60 -26 46 -29 81 -2 96 0 91 12 -4 9 9 27 34 47 l40 32 -3 66 c-4 78 -16 85 -88 48z'/><path d='M2045 850 c-3 -6 5 -14 19 -20 18 -7 26 -17 26 -34 0 -25 -4 -27 -65 -41 -31 -7 -55 -22 -55 -35 0 -4 30 -10 68 -13 78 -6 102 -14 102 -32 0 -18 -53 -37 -123 -44 -81 -8 -72 -26 13 -26 86 1 140 26 140 66 0 31 -31 59 -65 59 -19 1 -19 1 -2 14 19 15 23 66 7 97 -11 20 -54 26 -65 9z'/><path d='M526 523 c-3 -3 -6 -26 -6 -50 0 -29 -4 -42 -12 -40 -18 3 -22 -67 -8 -133 17 -80 27 -100 49 -100 25 0 37 18 17 26 -14 5 -16 29 -16 149 0 131 -6 166 -24 148z'/></g></svg>";
    let txn = await nftContract.createTickets("Metallica concert Warsaw!", "First concert of metallica in Warsaw!", unixTime, svg, st );
    await txn.wait();
    let adr = await nftContract.getDepContracts(owner.address);
    console.log("Address subcontract " + adr[0].contractAddress);
    console.log("Name subcontract " + adr[0].name);


    // deployed nft smartcontract
    const subcontractFactory = await hre.ethers.getContractFactory('tickeD1155', {
        libraries: {
          Base64: nftLib.address,
          Cast: nftLib1.address,
        }
    });

    const subcontract = await subcontractFactory.attach(adr[0].contractAddress);
    // let txsren = await subcontract.orgAddress();
    // console.log(txsren)
    let txn2 = await subcontract.createAndMintTickets();
    await txn2.wait();

    let sectors = await subcontract.getSectors();
    //console.log(sectors);

    console.log("-------------------00000000000-----------------");
    let uri= await subcontract.uri(1);
    console.log("THIS IS URI 1" + uri);
    console.log("-------------------00000000000-----------------");

    // SELLING!
    console.log(await subcontract.ticketAttr(2));
    
    console.log("owner ballance" +await owner.getBalance());
    subcontract.connect(addr1);
    console.log("addr1 ballance" + await addr1.getBalance());
    console.log("-------------------")
    console.log(await subcontract.ticketAttr(2));
    console.log("-------------------")
    let txn3 = await subcontract.buyTicket(2, 1, {
      value: ethers.utils.parseEther("0.1")
    });
    // 1 -> w smartocntracie to 1000000000000000000
    await txn3.wait();

    console.log(await subcontract.ticketAttr(2));

    console.log("addr1 ballance" + await addr1.getBalance());
    // let txn4 = await subcontract.buyTicket(2, 1, {
    //   value: ethers.utils.parseEther("20.0")
    // });
    // await txn4.wait();
    // WITHDRAW
    await subcontract.connect(owner);
    console.log("owner ballance" +await owner.getBalance());
    let tx6 = await subcontract.withdrawOrgCredits(owner.address);
    await tx6.wait();
    console.log("owner ballance" + await owner.getBalance());

    // SECOND CONCERT 
    // const st2nd = ["A1","0","0","1000","1","1","A2","1","1","100","1","2"];
    // let txn2nd = await nftContract.createTickets("SECOND concert!", "This is description", 1, st2nd );
    // await txn2nd.wait();
    // let adr2nd = await nftContract.getDepContracts(owner.address);
    // console.log("Address subcontract " + adr2nd[1].contractAddress);
    // console.log("Name subcontract " + adr2nd[1].name);
    // const subcontract2nd = await subcontractFactory.attach(adr2nd[1].contractAddress);
    // let txn2ndMINT = await subcontract2nd.createAndMintTickets();
    // await txn2ndMINT.wait();
    // let sectors2nd = await subcontract2nd.getSectors();
    // console.log(sectors2nd);

    // let uri2 = await subcontract.uri(0);
    // console.log("THIS IS URI 2" + uri2);


  };

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();