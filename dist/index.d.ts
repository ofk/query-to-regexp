interface QueryAST {
    and: {
        op: 'not' | null;
        value: string;
    }[];
}
export declare function parse(query: string): QueryAST;
export declare function build(ast: QueryAST, flags?: string): RegExp | null;
export declare const toRegExp: (query: string, flags?: string) => RegExp | null;
export {};
