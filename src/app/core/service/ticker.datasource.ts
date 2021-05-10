import { TickerService } from './ticker.service';
import { Ticker } from './../model/ticker.model';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

export class TickerDataSource implements DataSource<Ticker> {

  private tickersSubject = new BehaviorSubject<Ticker[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private tickerService: TickerService) {}

  connect(collectionViewer: CollectionViewer): Observable<Ticker[]> {
    return this.tickersSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.tickersSubject.complete();
    this.loadingSubject.complete();
  }

  /**
   * Update binded values in table, when service has returned data.
   */
  loadTickers() {
    this.loadingSubject.next(true);
    this.tickerService.loadTickers().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false)))
      .subscribe(tickers => {
        this.tickersSubject.next(tickers)
      });
  }

}
