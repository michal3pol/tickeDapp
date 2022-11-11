
// SCRIPT FOR RUNNING LOCALLY WITH HARDHAT

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
    const st = ["A1","0","0","1000","A2","1","1","1000"];    
    let unixTime = 	1669492800; // Sat Nov 26 2022 21:00:00 GMT+0100 (czas środkowoeuropejski standardowy)
    let txn = await nftContract.createTickets("Metallica concert Warsaw!", "First concert of metallica in Warsaw!", unixTime, st );
    await txn.wait();
    let adr = await nftContract.getDepContracts(owner.address);
    console.log("Address subcontract " + adr[0]);

    // deployed nft smartcontract
    const subcontractFactory = await hre.ethers.getContractFactory('tickeD1155', {
        libraries: {
          Base64: nftLib.address,
          Cast: nftLib1.address,
        }
    });

    const subcontract = await subcontractFactory.attach(adr[0]);
    let txn2 = await subcontract.mintTickets();
    await txn2.wait();

    let sectors = await subcontract.getSectors();
    console.log(sectors);

    let uri= await subcontract.uri(1);
    console.log("THIS IS URI 1" + uri);

    // SECOND CONCERT 
    const st2nd = ["A1","0","0","1000","A2","1","1","1000"];
    let txn2nd = await nftContract.createTickets("SECOND concert!", "This is description", 1, st2nd );
    await txn2nd.wait();
    let adr2nd = await nftContract.getDepContracts(owner.address);
    console.log("Address subcontract " + adr2nd[1]);
    const subcontract2nd = await subcontractFactory.attach(adr2nd[1]);
    let txn2ndMINT = await subcontract2nd.mintTickets();
    await txn2ndMINT.wait();
    let sectors2nd = await subcontract2nd.getSectors();
    console.log(sectors2nd);

    let uri2 = await subcontract.uri(0);
    console.log("THIS IS URI 2" + uri2);


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