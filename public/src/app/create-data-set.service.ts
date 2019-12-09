import { Injectable } from '@angular/core';
import recordData from './../../../records/data.json';

@Injectable({
  providedIn: 'root'
})
export class CreateDataSetService {
  private recordsGroup = [
    [
      "speed-index",
      "first-meaningful-paint",
      "interactive",
      "first-cpu-idle",
      // "mainthread-work-breakdown",
      // "first-contentful-paint",
      // "max-potential-fid",
      // "load-fast-enough-for-pwa",
    ],
    [
      "parseHTML",
      "styleLayout",
      "scriptEvaluation",
      "scriptParseCompile",
      "paintCompositeRender",
      "garbageCollection",
      "other",
    ],
    [
      'total-byte-weight',
      "dom-size",
      "network-requests",
      // "time-to-first-byte",
      // "network-rtt",
      // "estimated-input-latency",
      // "bootup-time",
      // "network-server-latency",
      // "metrics",
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
      'rgba(255, 99, 132, 0.1)',
      'rgba(54, 162, 235, 0.1)',
      'rgba(255, 206, 86, 0.1)',
      'rgba(75, 192, 192, 0)',
      'rgba(153, 102, 255, 0)',
      'rgba(255, 159, 64, 0)',
      'rgba(255, 99, 132, 0)',
      'rgba(54, 162, 235, 0)',
      'rgba(255, 206, 86, 0)',
      'rgba(75, 192, 192, 0)',
      'rgba(153, 102, 255, 0)',
      'rgba(255, 159, 64, 0)',
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
        // 選択検証データの中に入ってるかを確認
        continue;
      }
      const data = [];
      if (selected.hasOwnProperty(key)) {
        for(let i in selected[key]) {
          if (selected[key].hasOwnProperty(i)) {
            const packageName = selected[key][i].package.split('@');
            if (!label.includes(packageName[2])) {
              label.push(packageName[2]);
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
