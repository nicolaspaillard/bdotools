import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '@models/item';
import { ReplaySubject, Subject } from 'rxjs';

const API_URL = '';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private _db: Subject<Item[]> = new ReplaySubject(1);
  constructor(private http: HttpClient) {
    this.http.get('https://api.arsha.io/util/db?lang=en').subscribe({
      next: (res) => {
        console.log(res.toString());
        this._db.next(<Item[]>res);
      },
      error: (err) => console.log(err),
    });
  }
  db = () => this._db.asObservable();
}
