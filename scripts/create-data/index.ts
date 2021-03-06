const fs = require('fs');
const records = [
  'angular-blank',
  'angular-conference',
  'angular-sidemenu',
  'angular-tabs'
];
const auditsType = [
  "speed-index",
  "first-contentful-paint",
  "first-meaningful-paint",
  "load-fast-enough-for-pwa",
  "estimated-input-latency",
  "max-potential-fid",
  "time-to-first-byte",
  "first-cpu-idle",
  "interactive",
  "mainthread-work-breakdown",
  "bootup-time",
  "network-rtt",
  "network-server-latency",
  "metrics",

  "total-byte-weight",
  "network-requests",
  "dom-size",

  "render-blocking-resources",
  "total-blocking-time",
  "main-thread-tasks",

  // mainthread-work-breakdown
  "scriptEvaluation",
  "other",
  "styleLayout",
  "scriptParseCompile",
  "paintCompositeRender",
  "parseHTML",
  "garbageCollection",
];
const DATA: object[] = [];

function median(arr: number[]) {
  if (arr.length === 0) {
    return null;
  }

  const half = (arr.length / 2) | 0;
  const temp = arr.sort((a, b) => {
    return a - b;
  });

  if (temp.length % 2) {
    return temp[half];
  }

  return (temp[half-1] + temp[half])/2;
}

function outputData() {
  const tmp = [];
  for (let template of records) {
    // 格納変数の整形
    const type = template.split('-');

    const dir = './records/' + template;
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const recordFiles = files.filter((file) => {
        return /.*\.json$/.test(file); //絞り込み
      });
      recordFiles.sort((a, b) => {
        const version_a = a.split('@')[2].split('.');
        const version_b = b.split('@')[2].split('.');
        if (version_a[0] !== version_b[0]) {
          return version_a[0] - version_b[0];
        } else if (version_a[1] !== version_b[1]) {
          return version_a[1] - version_b[1];
        } else {
          return version_a[2] - version_b[2];
        }
      });

      for (let recordFile of recordFiles) {
        const records = JSON.parse(fs.readFileSync(dir + '/' + recordFile, 'utf8'));
        for (let audit of auditsType) {
          const value = [];
          for (let record of records) {
            if (record.audits[audit] || record.audits[audit] === 0) {
              value.push(record.audits[audit]);
            }
          }
          tmp.push([type[0], type[1], audit, records[0].package, median(value)]);
        }
      }
    }
  }

  for (let template of records) {
    const type = template.split('-');
    let data = {
      [type[0]]: {
        [type[1]]: {}
      }
    };
    for(let audit of auditsType){
      if (!data[type[0]][type[1]][audit]) {
        data[type[0]][type[1]] = Object.assign(data[type[0]][type[1]], {
          [audit]: []
        });
      }
      const fills = tmp.filter(d => (d[0] === type[0] && d[1] === type[1] && d[2] === audit && d[4]));
      for(let f of fills) {
        data[f[0]][f[1]][audit].push({
          package: f[3],
          value: f[4],
        })
      }
    }
    DATA.push(data);
  }

  const writeData = [];
  for(let d of DATA){
    writeData.push({
      type: Object.keys(d)[0],
      template: Object.keys(d[Object.keys(d)[0]])[0],
      audits: d[Object.keys(d)[0]][Object.keys(d[Object.keys(d)[0]])[0]]
    });
  }
  fs.writeFileSync('./records/data.json', JSON.stringify(writeData, null, 4));
}

outputData();
