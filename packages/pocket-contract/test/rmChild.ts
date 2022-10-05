import { assert, expect } from 'chai';
import * as constants from '../utils/constants';
import setup, { User } from '../utils/testSetup';
import { addStdChildAndSend } from '../utils/addChild';
import { checkChildIsInit } from '../utils/getters';

describe('Testing rm child', function () {
  let parent1: User, child1: User, child2: User;
  let rdmUsers: User[];
  const tokenAddr = constants.CHOSEN_TOKEN;

  before(async function () {
    const { parents, children, randomUsers } = await setup();
    child1 = children[0];
    child2 = children[1];
    parent1 = parents[0];
    rdmUsers = randomUsers;
  });

  it('Should remove child1', async function () {
    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
    const tx = await parent1.pocketFaucet.removeChild(child1.address);
    await tx.wait();
    assert(
      (await checkChildIsInit(parent1, child1.address)) === false,
      'Child 1 is still related to parent1'
    );
  });

  it('Should revert because child2 is not set for this parent', async function () {
    await addStdChildAndSend(parent1.pocketFaucet, child1.address, tokenAddr);
    await expect(
      parent1.pocketFaucet.removeChild(child2.address)
    ).to.be.revertedWith("!_areRelated: child doesn't match");
  });

  it('Should add multiple child and remove 2', async function () {
    // TO DO : refactor
    await addStdChildAndSend(
      parent1.pocketFaucet,
      rdmUsers[0].address,
      tokenAddr
    );
    await addStdChildAndSend(
      parent1.pocketFaucet,
      rdmUsers[1].address,
      tokenAddr
    );
    await addStdChildAndSend(
      parent1.pocketFaucet,
      rdmUsers[2].address,
      tokenAddr
    );
    await addStdChildAndSend(
      parent1.pocketFaucet,
      rdmUsers[3].address,
      tokenAddr
    );
    await addStdChildAndSend(
      parent1.pocketFaucet,
      rdmUsers[4].address,
      tokenAddr
    );
    let tx = await parent1.pocketFaucet.removeChild(rdmUsers[1].address);
    await tx.wait();
    tx = await parent1.pocketFaucet.removeChild(rdmUsers[4].address);
    await tx.wait();
    await addStdChildAndSend(
      parent1.pocketFaucet,
      rdmUsers[1].address,
      tokenAddr
    );
    tx = await parent1.pocketFaucet.removeChild(rdmUsers[0].address);
    await tx.wait();

    assert(
      (await checkChildIsInit(parent1, rdmUsers[4].address)) === false &&
        (await checkChildIsInit(parent1, rdmUsers[0].address)) === false,
      'The two child were not removed'
    );
  });
});
