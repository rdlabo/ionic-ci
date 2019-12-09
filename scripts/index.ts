const TYPE = process.argv[2];
const TEMPLATE = process.argv[3];
const DIRECTORY = TYPE + '-' + TEMPLATE;
const { spawnSync } = require("child_process");
const execSync = (commands) => {
  spawnSync(commands, { stdio: "inherit", shell: true });
};
const fs = require('fs');
export interface ILighthouse {
  audits: {
    numericValue? :number;
  }
}

function preci(typeName, templateName) {
  // init
  execSync('rm -rf ' + typeName + '-' + templateName);
  execSync('rm -rf .lighthouseci');
}

function createIonicProject(typeName, templateName): string {
  // create project
  execSync('npx ionic start ' + typeName + '/' + templateName + ' ' + templateName + ' --type=' + typeName);
  execSync('cd ' + DIRECTORY + '&& npx ng build --prod');

  // check version
  const packageJson = JSON.parse(fs.readFileSync('./' + DIRECTORY + '/node_modules/@ionic/' + typeName + '/package.json', 'utf8'));
  return packageJson['_id']
    .replace( '/', '-' )
    .replace(/\./g, '-');
}

function getRecord(directoryName): Record<string, number> {
  execSync('npx lhci collect --staticDistDir=' + directoryName + '/www --config=./lighthouserc.json');

  const lhFiles = fs.readdirSync('./.lighthouseci');
  const lhFilePath = lhFiles.find((file) => {
    return /.*\.json$/.test(file); //絞り込み
  });
  const stats = JSON.parse(fs.readFileSync('./.lighthouseci/' + lhFilePath, 'utf8'));
  const audits: {
    numericValue? :number;
  }[] = stats.audits;
  return Object.entries(audits).reduce((acc, [key, a]) => {
    if (a.numericValue && typeof a.numericValue === 'number') {
      return Object.assign({}, acc, {[key]: a.numericValue })
    }
    return acc
  }, {});
}

function ci() {
  preci(TYPE, TEMPLATE);
  if (!['angular', 'react'].includes(TYPE)) {
    console.error('error type: ' + TYPE);
    return;
  }

  if (!['blank', 'sidemenu', 'tabs', 'conference'].includes(TEMPLATE)) {
    console.error('error template: ' + TEMPLATE);
    return;
  }

  const packageName = createIonicProject(TYPE, TEMPLATE);
  const recordMap = getRecord(DIRECTORY);

  if (!fs.existsSync('./records/' + DIRECTORY) ) {
    fs.mkdirSync('./records/' + DIRECTORY);
  }

  const recordsFile = './records/' + DIRECTORY + '/' + packageName + '.json';
  let records;
  if (fs.existsSync(recordsFile) ) {
    records = JSON.parse(fs.readFileSync(recordsFile, 'utf8'));
  } else {
    records = [];
  }
  const today = new Date();
  records.push({
    date: today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2),
    time: today.getTime(),
    audits: recordMap
  });
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 4));
}

ci();
