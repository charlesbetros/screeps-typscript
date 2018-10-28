/**
* @jest-environment node
*/

import * as TestHelpers from "../src/jest/test.helpers";

beforeEach(async () => {
  await TestHelpers.setupMockScreepsServer();
});

afterEach(async () => {
  await TestHelpers.teardownMockScreepsServer();
});

test('Test tick', async (done) => {
  await TestHelpers.tickMockScreepsServer();
  expect(true).toBe(true);
  done();
});
