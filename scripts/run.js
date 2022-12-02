
// SCRIPT FOR RUNNING ON TESTNETS - GOERLI

const main = async () => {

  const [owner] = await ethers.getSigners();

    const nftContractFactory = await hre.ethers.getContractFactory('tickeDFactory', {
      libraries: {
        Base64: "0xA838A27DC8EEa77ad676Ae0C2c52c36Adf82C69f",
        Cast: "0xE8d24b027574ba4c351a61216Bd748f6eC54CC19",
      }
    });

    //const nftContractFactory = await hre.ethers.getContractFactory('tickeDFactory', {libraries: {Base64: "0xA838A27DC8EEa77ad676Ae0C2c52c36Adf82C69f",Cast: "0xE8d24b027574ba4c351a61216Bd748f6eC54CC19",}});

    const st = ["A1","0","0","10","1","1000000000000000","A2","1","1","5","1","1000000000000000","C5","1","1","4","0","10000000000000000"];

    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    
    // add to whitelist
    let access = await nftContract.setOrganizatorPermission(owner.address, true);
    await access.wait();

    const unixTime = 1669492800; // Sat Nov 26 2022 21:00:00 GMT+0100 (czas środkowoeuropejski standardowy)

    //let txn = await nftContract.createTickets("Initial concert from run!", "First concert of aaa in aaa!", 1669495020, st );
    //await txn.wait();
    let image = "https://bafkreiajmvoddrzqjupncsvhyyqdphmz3nrztglogtotimizqm7jhsmqza.ipfs.nftstorage.link/"
    let txn = await nftContract.createTickets("Test concert!", "First concert of test in Warsaw!", unixTime, image, st );
    await txn.wait();
    
    let adr = await nftContract.getDepContracts(owner.address);
    console.log("Address subcontract " + adr[0].contractAddress);
    console.log("Name subcontract " + adr[0].name);

    // deployed nft smartcontract
    const subcontractFactory = await hre.ethers.getContractFactory('tickeD1155', {
        libraries: {
          Base64: "0xA838A27DC8EEa77ad676Ae0C2c52c36Adf82C69f",
          Cast: "0xE8d24b027574ba4c351a61216Bd748f6eC54CC19",
        }
    });
    // const subcontractFactory = await hre.ethers.getContractFactory('tickeD1155', {libraries: {Base64: "0xA838A27DC8EEa77ad676Ae0C2c52c36Adf82C69f",Cast: "0xE8d24b027574ba4c351a61216Bd748f6eC54CC19",}});

    const subcontract = await subcontractFactory.attach(adr[0].contractAddress);
    let txn2 = await subcontract.createAndMintTickets();
    await txn2.wait();

    let sectors = await subcontract.getSectors();
    console.log(sectors);

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