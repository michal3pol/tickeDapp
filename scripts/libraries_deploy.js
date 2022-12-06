/* 
* This script deploy ONLY libraries
*/

const main = async () => {

    const base64LibFactory = await hre.ethers.getContractFactory('Base64');
    const base64Lib = await base64LibFactory.deploy();
    await base64Lib.deployed();
    console.log("Library Base64 deployed to:", base64Lib.address);

    const castLibFactory = await hre.ethers.getContractFactory('Cast');
    const castLib = await castLibFactory.deploy();
    await castLib.deployed();
    console.log("Library Cast deployed to:", castLib.address);

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