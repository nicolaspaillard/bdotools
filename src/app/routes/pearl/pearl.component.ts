import { Component } from '@angular/core';
import { Item } from '@models/item';
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
  items: Item[] = [];
  constructor(private marketService: MarketService) {
    this.marketService.db().subscribe((items) => (this.items = items.filter((i) => i.name.match(/^(?:.*)Premium Set$/))));
  }
}
