import { Component, OnInit } from '@angular/core';
import { CreateDataSetService } from './create-data-set.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public type: 'angular' | 'react' | 'vue' = 'angular';
  public template: 'blank' | 'sidemenu' | 'tabs' | 'conference' = 'blank';
  public graph1: ChartData;
  public graph2: ChartData;
  public graph3: ChartData;
  public graph4: ChartData;
  public options1;
  public options2;
  public options3;
  public options4;

  constructor(public dataService: CreateDataSetService) {}

  ngOnInit() {
    this.graph1 = this.dataService.create(0, this.type, this.template);
    this.options1 = this.options(2000);

    this.graph2 = this.dataService.create(1, this.type, this.template);
    this.options2 = this.options(0);

    this.graph3 = this.dataService.create(2, this.type, this.template);
    this.options3 = this.options(100000);

    this.graph4 = this.dataService.create(3, this.type, this.template);
    this.options4 = this.options(0);
    // console.log(this.data);
  }

  options(min: number = 0): object {
    return {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: min,
            },
          },
        ],
      },
    }
  };
}
