
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
    let image = "https://bafkreiajmvoddrzqjupncsvhyyqdphmz3nrztglogtotimizqm7jhsmqza.ipfs.nftstorage.link/"
    let txn = await nftContract.createTickets("Metallica concert Warsaw!", "First concert of metallica in Warsaw!", unixTime, image, st );
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