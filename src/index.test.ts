import { parse, toRegExp } from '.';

describe('parse', () => {
  ([
    ['', { and: [] }],
    [' ', { and: [] }],
    ['foo', { and: [{ op: null, value: 'foo' }] }],
    [' foo ', { and: [{ op: null, value: 'foo' }] }],
    [
      'foo -bar baz',
      {
        and: [
          { op: null, value: 'foo' },
          { op: 'not', value: 'bar' },
          { op: null, value: 'baz' },
        ],
      },
    ],
    [
      `"foo bar" -'test\\'s query' -""`,
      {
        and: [
          { op: null, value: 'foo bar' },
          { op: 'not', value: "test's query" },
          { op: 'not', value: '' },
        ],
      },
    ],
    [
      '" -',
      {
        and: [
          { op: null, value: '"' },
          { op: null, value: '-' },
        ],
      },
    ],
  ] as [string, unknown][]).forEach(([query, ast]) => {
    it(`returns the ast if given "${query}"`, () => {
      expect(parse(query)).toEqual(ast);
    });
  });
});

describe('toRegExp', () => {
  const reg = toRegExp('foo -bar "baz qux"')!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

  it('returns the regexp given the query', () => {
    expect(reg).toBeInstanceOf(RegExp);
  });

  it('regexp matches some string', () => {
    expect(reg.test('foobaz qux')).toEqual(true);
    expect(reg.test('BAZ QUX FOO')).toEqual(true);
  });

  it('egexp does not matches some string', () => {
    expect(reg.test('')).toEqual(false);
    expect(reg.test('foobazqux')).toEqual(false);
    expect(reg.test('foobarbaz qux')).toEqual(false);
    expect(reg.test('baz foo qux')).toEqual(false);
  });

  it('returns null given the empty query', () => {
    expect(toRegExp(' ')).toEqual(null);
  });
});
