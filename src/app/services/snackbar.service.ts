import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  /**
   * Function displays error snackbar
   * 
   * @returns error snackbar
   * 
   */
  error(message: string) {
    return this.snackBar.open(message, "Close", {panelClass: ['snackbar-error']});
  }

  /**
   * Function displays success snackbar
   * 
   * @returns success snackbar
   * 
   */
  success(message: string) {
    return this.snackBar.open(message, "Close", {panelClass: ['snackbar-success']});
  }

  /**
   * Function displays info snackbar
   * 
   * @returns info snackbar
   * 
   */
  info(message: string) {
    return this.snackBar.open(message, "Close", {panelClass: ['snackbar-info']});
  }

}
