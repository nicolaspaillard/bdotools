export class PearlItem {
  Date: Date;
  ID: number;
  Itemid: number;
  Name: string;
  Percentage: number;
  Preorders: number;
  Sold: number;
  constructor(pearlItem: PearlItem) {
    Object.assign(this, pearlItem);
    this.Percentage = pearlItem.Sold - pearlItem.Preorders;
  }
}
