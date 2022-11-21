export default class EtherUnitConverter {
    
    static weiToGwei(amount: number): number {
        return amount * 0.000000001
    }

    static weiToEther(amount: number): number {
        return amount * 0.000000000000000001
    }

    static gweiToWei(amount: number): number {
        return amount * 1000000000
    }

    static gweiToEther(amount: number): number {
        return amount * 0.000000001
    }

    static etherToWei(amount: number): number {
        return amount * 1000000000000000000
    }

    static etherToGwei(amount: number): number {
        return amount * 1000000000
    }

}