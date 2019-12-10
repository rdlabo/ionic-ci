# ionic-ci
Lighthouse for Ionic starter template.

## Resources
### Measurement data
Saved in each folder named `type-template`. This is created by [the script](https://github.com/rdlabo/ionic-ci/blob/master/scripts/measurement/index.ts).

https://github.com/rdlabo/ionic-ci/tree/master/records

### Processing data
Processing data is created by [the script](https://github.com/rdlabo/ionic-ci/tree/master/scripts/create-data) that using median of Measurement data.

https://github.com/rdlabo/ionic-ci/blob/master/records/data.json

## Environment

| Environment  |  Key  | Value |
| ---- | ---- |  ---- |      
|  CircleCI  |  image  |  circleci/node:12.13-browsers  | 
|  Lighthouse  |  throttling-method  | simulate  |
|  Lighthouse  |  emulated-form-factor  | mobile  | 
