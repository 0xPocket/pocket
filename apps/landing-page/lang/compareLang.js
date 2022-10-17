const fr = require('./fr.json');
const us = require('./en-US.json');

const usKeys = Object.keys(us);
const frKeys = Object.keys(fr);

console.log('ℹ️  Language Keys Checking...');
usKeys.forEach((key) => {
  if (us[key] == '') {
    console.error('❌ Be careful', key, 'in us is empty');
  }
  if (fr[key] == undefined || fr[key] == '') {
    console.error('❌ Missing', key, 'in fr');
  }
});

frKeys.forEach((key) => {
  if (fr[key] == '') {
    console.error('❌ Be careful', key, 'in fr is empty');
  }
  if (us[key] == undefined || us[key] == '') {
    console.error('❌ Missing', key, 'in us');
  }
});
