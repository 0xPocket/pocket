const fr = require('./fr.json');
const us = require('./en-US.json');

export function compareLang() {
  const usKeys = Object.keys(us);
  const frKeys = Object.keys(fr);

  usKeys.forEach((key) => {
    if (us[key] == '') console.log('Be carefule', key, 'in us is empty');

    if (fr[key] == undefined || fr[key] == '')
      console.log('missing :', key, 'in fr');
  });
  frKeys.forEach((key) => {
    if (fr[key] == '') console.log('Be carefule', key, 'in fr is empty');
    if (us[key] == undefined || us[key] == '')
      console.log('missing :', key, 'in us');
  });
}
