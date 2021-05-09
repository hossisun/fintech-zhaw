import { AfterViewInit, Component, OnInit } from '@angular/core';
import Amplify, { API } from 'aws-amplify';
import {merge, Observable, of as observableOf} from 'rxjs';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface StockElement {
  ticker: string;
  exchange: string;
  prices: StockPrice[];
}

export interface StockPrice {
  date: Date;
  volume: number;
}

@Component({
  selector: 'app-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: ['./company-table.component.scss']
})
export class CompanyTableComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
  }

  displayedColumns: string[] = ['position', 'name'];
  dataSource: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

  stocks: StockElement[];

  ngOnInit(): void {

    API.get("fintechconnector", "/tickers", {})
    .then(response => {
      console.log(response);
        for (var ticker in response) {
          console.log(response[ticker].ticker);
          this.stocks.push(response[ticker]);
        }
        console.log(this.stocks);
    })
    .catch(error => {
      console.log(error.response)
    })
  }

}
