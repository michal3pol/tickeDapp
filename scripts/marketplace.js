const main = async () => {
    const [owner, adr1] = await ethers.getSigners();

    const nftContractFactory = await hre.ethers.getContractFactory('nftMarketplace');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    
    // run contract
    let t = await nftContract.deleteOffer(owner.address, 1);
    t.wait();

    let st = [ 0, 1, owner.address ]
    let txn = await nftContract.insertOffer(owner.address, 1,st);
    await txn.wait();

    let txn2 = await nftContract.getSellerIds(owner.address);
    console.log(txn2);

    let listing = await nftContract.listing(owner.address, txn2[0]);
    console.log(listing);

    //nftContract.connect(adr1).deleteOffer(owner.address, 1);
    nftContract.deleteOffer(owner.address, 1);
    // let txn3 = await nftContract.deleteTicket(owner.address, 1);
    // await txn3.wait();

    listing = await nftContract.listing(owner.address, txn2[0]);
    //console.log(listing);
    

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