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

function createIonicProject(typeName, templateName, directoryName): string {
  // create project
  execSync('rm -rf ' + typeName + '-' + templateName);
  execSync('npx ionic start ' + typeName + '/' + templateName + ' ' + templateName + ' --type=' + typeName);

  if (typeName === 'angular') {
    execSync('cd ' + directoryName + '&& npx ng build --prod');
  } else if (typeName === 'react') {
    execSync('cd ' + directoryName + '&& npm run build');
  }

  // check version
  const packageJson = JSON.parse(fs.readFileSync('./' + directoryName + '/node_modules/@ionic/' + typeName + '/package.json', 'utf8'));
  return packageJson['_id']
}

function getRecord(typeName, directoryName): Record<string, number> {
  let publicDir;
  if (typeName === 'angular') {
    publicDir = 'www';
  } else if (typeName === 'react') {
    publicDir = 'build';
  }

  execSync('rm -rf .lighthouseci');
  execSync('npx lhci collect --staticDistDir=' + directoryName + '/' + publicDir + ' --config=./lighthouserc.json');

  const lhFiles = fs.readdirSync('./.lighthouseci');
  const lhFilePath = lhFiles.find((file) => {
    return /.*\.json$/.test(file); //絞り込み
  });
  if (!lhFilePath) {
    console.error('do not run lighthouse');
    return;
  }
  const stats = JSON.parse(fs.readFileSync('./.lighthouseci/' + lhFilePath, 'utf8'));
  const audits: {
    [key:string]: {
      numericValue?: number;
      details?: {
        items?: {
          group?: string;
          duration?: number;
        }[]
      }
    }
  } = stats.audits;

  const breakdown = Object.entries(audits['mainthread-work-breakdown'].details.items).reduce((acc, [key, a]) => {
    return Object.assign({}, acc, {[a.group]: a.duration })
  }, {});

  return Object.assign(breakdown, Object.entries(audits).reduce((acc, [key, a]) => {
    if (a.numericValue && typeof a.numericValue === 'number') {
      return Object.assign({}, acc, {[key]: a.numericValue })
    }
    return acc
  }, {}));
}

function ci() {
  if (!['angular', 'react'].includes(TYPE)) {
    console.error('error type: ' + TYPE);
    return;
  }

  if (!['blank', 'sidemenu', 'tabs', 'conference'].includes(TEMPLATE)) {
    console.error('error template: ' + TEMPLATE);
    return;
  }

  const packageName = createIonicProject(TYPE, TEMPLATE, DIRECTORY);
  const recordMap = getRecord(TYPE, DIRECTORY);

  if (!fs.existsSync('./records/' + DIRECTORY) ) {
    fs.mkdirSync('./records/' + DIRECTORY);
  }

  const recordsFile = './records/' + DIRECTORY + '/' + packageName.replace('/', '-') + '.json';
  let records;
  if (fs.existsSync(recordsFile) ) {
    records = JSON.parse(fs.readFileSync(recordsFile, 'utf8'));
  } else {
    records = [];
  }
  const today = new Date();
  records.push({
    date: today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2),
    datetime: today.toISOString(),
    package: packageName,
    audits: recordMap,
    time: today.getTime(),
  });
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 4));
}

ci();
