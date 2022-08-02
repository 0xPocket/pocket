import * as constants from '../utils/constants';

async function main() {
  console.log('Network selected :', constants.CHOSEN);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
