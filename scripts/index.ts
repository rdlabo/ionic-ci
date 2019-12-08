const type = process.argv[2];
const template = process.argv[3];
const { spawnSync } = require("child_process");
const execSync = (commands) => {
  spawnSync(commands, { stdio: "inherit", shell: true });
};

function ci() {
  if (!['angular', 'react'].includes(type)) {
    console.log('error type' + type);
    return;
  }

  if (!['blank', 'sidemenu', 'tabs', 'conference'].includes(template)) {
    console.log('error template' + template);
    return;
  }

  execSync('rm -rf ' + type + '-' + template);
  execSync('npx ionic start ' + type + '/' + template + ' ' + template + ' --type=' + type);
  execSync('cd ' + type + '-' + template + '&& npx ng build --prod');
  execSync('lhci collect --staticDistDir=' + type + '-' + template + '/www --config=./lighthouserc.json');
}

ci();
