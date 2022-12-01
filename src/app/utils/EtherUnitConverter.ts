import { BigNumber, ethers } from "ethers"

export default class EtherUnitConverter {
    
    // static weiToGwei(amount: number): number {
    //     return amount * 0.000000001
    //     return amount.mul(0.000000001)
    // }

    static weiToEther(amount: BigNumber): string {
        return ethers.utils.formatEther(amount)
    }

    // static gweiToWei(amount: BigNumber): BigNumber {
    //     return amount.mul(1000000000)
    // }

    // static gweiToEther(amount: BigNumber): BigNumber {
    //     return amount.mul(0.000000001)
    // }

    static etherToWei(amount: number): BigNumber {
        return ethers.utils.parseUnits(amount.toString(), "ether")
        //return amount.mul(1000000000000000000)
    }

    // static etherToGwei(amount: BigNumber): BigNumber {
    //     return amount.mul(1000000000)
    // }

}