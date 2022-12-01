import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BigNumber } from 'ethers';
import { NftMarketplaceService } from 'src/app/services/smartcontracts/nft-marketplace.service';
import { Ticked1155Service } from 'src/app/services/smartcontracts/ticked1155.service';
import { WalletService } from 'src/app/services/wallet.service';
import EtherUnitConverter from 'src/app/utils/EtherUnitConverter';
import { environment } from 'src/environments/environment';
import { CreateOfferDialogData } from 'src/types/dialogs.model';
import { NFT } from 'src/types/nft.model';

@Component({
  selector: 'app-create-offer-dialog',
  templateUrl: './create-offer-dialog.component.html',
  styleUrls: ['./create-offer-dialog.component.scss']
})
export class CreateOfferDialogComponent implements OnInit {

  public isMarketplaceApproved: boolean = false;
  public nft!: NFT;
  protected amount: number = 1;
  protected price!: number;

  constructor(
    public dialogRef: MatDialogRef<CreateOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateOfferDialogData,
    private ticked1155Service: Ticked1155Service,
    private walletService: WalletService,
    private nftMarketplaceService: NftMarketplaceService,
  ) {
      this.nft = data.nft;
   }

  async ngOnInit() {
    // check if collection is approved
    this.isMarketplaceApproved = await this.ticked1155Service.isApprovedForAll(
      this.nft.contract.address,
      await this.walletService.getWalletAddress(),
      environment.contractNftMarketplaceAddress,
    )
  }

  approveMarketplace() {
    this.ticked1155Service.setApprovalForAll(
      this.nft.contract.address,
      environment.contractNftMarketplaceAddress,
      true
    )
  }

  revokeMarketplaceApproval() {
    this.ticked1155Service.setApprovalForAll(
      this.nft.contract.address,
      environment.contractNftMarketplaceAddress,
      true
    )
  }

  async createOffer() {
    this.nftMarketplaceService.insertOffer(
      this.nft.contract.address,
      { tokenId: this.nft.id.tokenId,
        amount: this.amount,
        price: EtherUnitConverter.etherToWei(this.price),
        seller: await this.walletService.getWalletAddress() }
    )
  }

  async refresh() {
    this.isMarketplaceApproved = await this.ticked1155Service.isApprovedForAll(
      this.nft.contract.address,
      await this.walletService.getWalletAddress(),
      environment.contractNftMarketplaceAddress,
    )
  }
}
