# commentariat

A little library for inserting comments into JS and JSX files.

## Usage

**commentariat** only exposes a default export: `commentSource(source, comments, options)`.

It takes three arguments:

- `source: string` The source to be commented
- `comments: Array of objects with`
  - `comment: string` The comment contents
  - `line: number` Line number (1-indexed, like they are in editors)
  - `type: "line" | "block"` Whether to write a line or block comment (JSX comments are always block comments`)
- `options: object with`
  - `jsx: boolean (default: false)` Whether to write JSX comments where required (requires `@babel/parser` and `@babel/traverse` optional dependencies to be installed).
  - `parserPlugins: Array of strings` Parser plugins to be used by Babel, if it is being used

And returns the newly commented source string.

Newlines in the comment string are respected, and will work the way you want. If multiple comments are specified for the same line, they will each be inserted, and will be ordered as they are ordered in the _comments_ argument.

## Example

### Simple JS comments

```js
import commentSource from "commentariat";

const code = [
  "function square(x) {",
  "  return x * x;",
  "}"
].join("\n");

const commentedCode = commentSource(code, [
  {
    comment: "Hello commentariat\nA second line",
    line: 2,
    type: "line",
  },
]);

console.log(commentedCode);
```

prints

```js
function square() {
  // Hello commentariat
  // A second line
  return x * x;
}
```

### JSX comments

```jsx
import commentSource from "commentariat";

const code = [
  "function MyComponent({name}) {",
  "  return <div>",
  "    Hello {name}!",
  "  </div>;",
  "}",
].join("\n");

const commentedCode = commentSource(
  code,
  [
    {
      comment: "Comments in JSX are placed in an expression",
      line: 3,
      type: "line",
    },
    {
      comment: "Comments not in JSX are placed as before",
      line: 2,
      type: "line",
    },
  ],
  {jsx: true}
);

console.log(commentedCode);
```

prints

```jsx
function MyComponent({name}) {
  // Comments not in JSX are placed as before
  return <div>
    {/* Comments in JSX are placed in an expression */}
    Hello {name}!
  </div>;
}
```
