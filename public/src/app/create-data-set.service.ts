import { Injectable } from '@angular/core';
import recordData from './../../../records/data.json';

@Injectable({
  providedIn: 'root'
})
export class CreateDataSetService {
  private recordsGroup = [
    [
      "first-meaningful-paint",
      "first-contentful-paint",
      "speed-index",
      "interactive",
      // "max-potential-fid",
      // "load-fast-enough-for-pwa",
    ],
    [
      "time-to-first-byte",
      "first-cpu-idle",
      // "estimated-input-latency",
      // "mainthread-work-breakdown",
      // "bootup-time",
      // "network-server-latency",
      // "dom-size",
      "network-requests",
      "network-rtt",
      "metrics",
    ],
    [
      "total-blocking-time",
      "main-thread-tasks",
      "render-blocking-resources",
    ]
  ];
  constructor() { }

  create(num, type, template) {
    const selectedData = recordData.find(data => (data.type === type && data.template === template));
    const selected = selectedData.audits;
    const label = [];
    const dataSet = [];
    const backgroundColors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
    ];
    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];
    let index = 0;

    for(let key in selected) {
      if (!this.recordsGroup[num].includes(key)) {
        continue;
      }
      const data = [];
      if (selected.hasOwnProperty(key)) {
        for(let i in selected[key]) {
          if (selected[key].hasOwnProperty(i)) {
            if (!label.includes(selected[key][i].package)) {
              label.push(selected[key][i].package);
            }
            data.push(selected[key][i].value);
          }
        }

        dataSet.push({
          label: key,
          data: data,
          backgroundColor: backgroundColors[index],
          borderColor: borderColors[index],
          borderWidth: 1,
        });
        index ++;
      }
    }

    return {
      labels: label,
      datasets: dataSet,
    };
  }
}
