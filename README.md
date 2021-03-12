# query-to-regexp

query-to-regexp converts the user-input string to regexp.

## Examples

```js
const { toRegExp } = require('query-to-regexp');

const reg = toRegExp('Dog "Brown fox" -Cat');
console.log(reg.test('The quick brown fox jumps over the lazy dog'));
// => true
```
