import { Component, OnInit } from '@angular/core';
import Amplify, { API } from 'aws-amplify';


@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss']
})
export class CompanyAddComponent implements OnInit {

  ticker = '';
  startDate: any;
  endDate: any;

  constructor() {}

  ngOnInit(): void {
  }

  click(): void {
    API.get("fintechconnector", "/addticker", {})
      .then(response => {
        // Add your code here
        console.log(response);
      })
      .catch(error => {
        console.log(error.response)
      })
  }

  inputTicker(ticker: string) {
    this.ticker = ticker;
  }

  clearInput() {
    this.ticker = '';
  }

  OnDateChange(datefield: string, date: string): void {
    if (datefield == 'startDate') {
      this.startDate = new Date(date).getTime();
      console.log('Timestamp::' + this.startDate);
    }
    if (datefield == 'endDate') {
      this.endDate = new Date(date).getTime();
    }
  }

}
