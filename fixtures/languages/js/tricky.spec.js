// it('commented out', () => { expect(1).toBe(1); });
/*
 * test.skip('block comment', () => {});
 * expect(2).toBe(2);
 */
const url = 'http://example.com/it.skip(';
const re = /x/;
const message = "expect(not a call) // still a string";
const tpl = `test.only(${url}) multi
line expect(`;

function helper() {
  return re.test('abc'); // regex.test is not a test case
}

it('real test', () => {
  expect(helper()).toBe(false); /* inline */ expect(url).toContain('example');
});

profit(); // a fit-like name must not count
