import { Injectable } from '@angular/core';

export interface PageInfo {
  pageUrl: string;
  timeSpent: number;
  wallet: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimeSpentServiceService {
  timeSpentOnPages: PageInfo[] = [];
  constructor() { }
}
