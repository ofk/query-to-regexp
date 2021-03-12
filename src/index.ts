function unescapeStringLiteral(str: string): string {
  return str.replace(/\\(.)/g, '$1');
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface QueryAST {
  and: {
    op: 'not' | null;
    value: string;
  }[];
}

const REG_TOKEN = /(-)?(?:"((?:\\.|[^\\"])*)"|'((?:\\.|[^\\'])*)'|(\S+))/g;

export function parse(query: string): QueryAST {
  const ast: QueryAST = { and: [] };
  let m: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((m = REG_TOKEN.exec(query))) {
    const value =
      // eslint-disable-next-line no-nested-ternary
      m[2] != null
        ? unescapeStringLiteral(m[2])
        : m[3] != null
        ? unescapeStringLiteral(m[3])
        : m[4] || '';

    ast.and.push({
      op: m[1] ? 'not' : null,
      value,
    });
  }
  return ast;
}

export function build(ast: QueryAST, flags = 'i'): RegExp | null {
  const conditions: string[] = [];
  ast.and.forEach(({ op, value }) => {
    if (value) {
      conditions.push(`(?${op === 'not' ? '!' : '='}[\\s\\S]*?${escapeRegExp(value)})`);
    }
  });
  return conditions.length ? new RegExp(`^${conditions.join('')}`, flags) : null;
}

export const toRegExp = (query: string, flags = 'i'): RegExp | null => {
  return build(parse(query), flags);
};
