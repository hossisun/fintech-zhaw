import { TickerService } from './../core/service/ticker.service';
import { TickerDataSource } from './../core/service/ticker.datasource';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: ['./company-table.component.scss']
})
export class CompanyTableComponent implements OnInit {

  constructor(private tickerService: TickerService){}

  displayedColumns: string[] = ['ticker', 'exchange'];
  dataSource: TickerDataSource;

  ngOnInit() {
    this.dataSource = new TickerDataSource(this.tickerService);
    this.dataSource.loadTickers();
  }

}
