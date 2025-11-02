import { Component } from '@angular/core';
import { PearlItem } from '@models/pearl-item';
import { MarketService } from '@services/market.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-pearl',
  imports: [TableModule, Button],
  templateUrl: './pearl.component.html',
  styles: ``,
})
export class PearlComponent {
  pearlItems: PearlItem[] = [];
  constructor(private marketService: MarketService) {
    this.marketService.pearlItems().subscribe((items) => {
      console.log(items);
      this.pearlItems = items;
    });
  }
  getPearlItems = (at: string) => {
    let date: Date;
    switch (at) {
      default:
        date = new Date(new Date().valueOf() - 3 * 3600000);
        break;
      case '12 hours':
        date = new Date(new Date().valueOf() - 12 * 3600000);
        break;
      case '24 hours':
        date = new Date(new Date().valueOf() - 24 * 3600000);
        break;
      case '3 days':
        date = new Date(new Date().valueOf() - 3 * 86400000);
        break;
      case '1 week':
        date = new Date(new Date().valueOf() - 7 * 86400000);
        break;
      case '2 weeks':
        date = new Date(new Date().valueOf() - 14 * 86400000);
        break;
    }
    this.marketService.getPearlItems(date);
  };
}
