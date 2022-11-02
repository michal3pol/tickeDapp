
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

    const st = ["A1","0","0","10","A2","1","1","3"];

    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    
    // add to whitelist
    let access = await nftContract.setOrganizatorPermission(owner.address, true);
    await access.wait();

    let txn = await nftContract.createTickets("First concert!", "This is description", 1, st );
    await txn.wait();

    let adr = await nftContract.getAddr();
    console.log("Address subcontract " + adr);

    // deployed nft smartcontract
    const subcontractFactory = await hre.ethers.getContractFactory('tickeD1155', {
        libraries: {
          Base64: "0xA838A27DC8EEa77ad676Ae0C2c52c36Adf82C69f",
          Cast: "0xE8d24b027574ba4c351a61216Bd748f6eC54CC19",
        }
    });

    const subcontract = await subcontractFactory.attach(adr);
    let txn2 = await subcontract.mintTickets();
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