import { Component, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TickedFactoryService } from 'src/app/services/smartcontracts/ticked-factory.service';
import moment from 'moment';
import { TimeSpentServiceService } from 'src/app/services/time-spent-service.service';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss']
})
export class WhitelistComponent {

  protected address!: string;
  protected permission!: string;
  protected checkAddress!: string;

  timeSpentOnPages = this.timeSpentService.timeSpentOnPages;

  moment = moment;

  constructor(
    private tickedFactoryService: TickedFactoryService,
    private snackbarService: SnackbarService,
    private timeSpentService: TimeSpentServiceService,
  ) { }

  
  /**
   * Function that changes permission based on form 
   */
  changePermissions() {
    if(this.permission === undefined || this.address === undefined){
      this.snackbarService.error("Specify arguments!")
      return
    }
    let toggle = this.permission === "grant" ? true : false; 
    this.tickedFactoryService.setOrganizatorPermission(this.address, toggle);
  }

  /**
   * Function that checks permission based on form 
   */
  async checkPermissions() {
    if(this.checkAddress === undefined) {
      this.snackbarService.error("Specify arguments!")
      return
    }

    let toggle = await this.tickedFactoryService.authorizeAccess(this.checkAddress)
    let info = toggle ? "have" : "don't have"
    this.snackbarService.info("This wallet " + info + " access")
  }

}
