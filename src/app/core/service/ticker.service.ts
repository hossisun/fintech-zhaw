import { Ticker } from './../model/ticker.model';
import { Injectable } from '@angular/core';
import Amplify, { API } from 'aws-amplify';
import { Observable, from } from 'rxjs';

@Injectable()
export class TickerService {

  tickers: Ticker[] = [];

    /**
     * API call to AWS Lambda function to load data async via AWS SDK.
     *
     * @private
     * @returns {Promise<Ticker[]>}
     * @memberof TickerService
     */
    private async loadTickersAsync(): Promise<Ticker[]> {
      const test = await API.get("fintechconnector", "/tickers", {})
        .then(response => {
            for (var ticker in response) {
              this.tickers.push(
                {
                  ticker: response[ticker].ticker,
                  exchange: response[ticker].exchangeName,
                  prices: response[ticker].prices
                }
                );
            }
        })
        .catch(error => {
          console.log(error.response)
        });
        return this.tickers;
    }

    /**
     * Transform Promise return object to Observable so Angular Table component can consume
     * data as a datasource.
     * @returns
     */
    loadTickers(): Observable<Ticker[]> {
      return from(this.loadTickersAsync());
    }
}
