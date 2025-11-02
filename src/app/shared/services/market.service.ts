import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Item } from '@models/item';
import { PearlItem } from '@models/pearl-item';
import { Observable, ReplaySubject, Subject } from 'rxjs';

const API_URL = 'https://bdoapi.nicolaspaillard.fr/';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private _db: Subject<Item[]> = new ReplaySubject(1);
  private _pearlItems: Subject<PearlItem[]> = new ReplaySubject(1);
  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string,
  ) {
    this.http.get('https://api.arsha.io/util/db?lang=en').subscribe({
      next: (res) => {
        this._db.next(<Item[]>res);
      },
      error: (err) => console.log(err),
    });
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() - 3);
    this._getPearlItems(defaultDate).subscribe({
      next: (res: PearlItem[]) => this._pearlItems.next(res.map((item) => new PearlItem(item))),
      error: (err) => console.log(err),
    });
  }
  db = () => this._db.asObservable();
  getPearlItems = (date: Date) => {
    this._getPearlItems(date).subscribe({
      next: (res: PearlItem[]) => this._pearlItems.next(res.map((item) => new PearlItem(item))),
      error: (err) => console.log(err),
    });
  };
  pearlItems = () => this._pearlItems.asObservable();
  private _getPearlItems = (date: Date): Observable<any> => {
    let url = API_URL + 'pearlitems?date=' + formatDate(date, 'yyyy-MM-dd hh:00:00', 'fr-FR');
    console.log(url);
    return this.http.get(url);
  };
}
