/* 
* This script deploy ONLY tickeDFactory smartcontract
*/

const main = async () => {
  
    // MAKE SURE that libraries addresses you've provided are correct! 
    base64 = "0xA838A27DC8EEa77ad676Ae0C2c52c36Adf82C69f";
    cast =  "0xE8d24b027574ba4c351a61216Bd748f6eC54CC19";
    const tickeDFactoryFactory = await hre.ethers.getContractFactory('tickeDFactory', {
      libraries: {
        Base64: base64,
        Cast: cast,
      }
    });
    const tickeDFactory = await tickeDFactoryFactory.deploy();
    await tickeDFactory.deployed();
    console.log("Contract tickeDFactory deployed to:", tickeDFactory.address);
  
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