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

  options = {
    scales: {
      yAxes: [
        {
          ticks: {
            false: true,
          },
        },
      ],
    },
  };

  constructor(public dataService: CreateDataSetService) {}

  ngOnInit() {
    this.graph1 = this.dataService.create(0, this.type, this.template);
    this.graph2 = this.dataService.create(1, this.type, this.template);
    this.graph3 = this.dataService.create(2, this.type, this.template);
    this.graph4 = this.dataService.create(3, this.type, this.template);
    // console.log(this.data);
  }
}
