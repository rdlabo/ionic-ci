import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvas', { static: false })
  ref: ElementRef;

  @Input()
  data: ChartData;

  @Input()
  options: ChartOptions;

  isReady = false;
  context: CanvasRenderingContext2D;
  chart: Chart;

  constructor(private _elementRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.init();
    this.isReady = true;
  }

  ngOnChanges() {
    if (this.isReady) {
      this.init();
    }
  }

  init() {
    this.context = this.ref.nativeElement.getContext('2d');
    this.chart = new Chart(this.context, {
      type: 'line',
      data: this.data,
      options: this.options
    });
  }
}
