// TEAM: frontend_infra
// @flow

import commentSource from "../commentariat";

describe("commentSource", () => {
  describe("in JS code", () => {
    it("writes a single line comment", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "console.log('hello world');",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "// Test comment, please ignore",
        "console.log('hello world');",
        "",
      ].join("\n");

      expect(
        commentSource(input, [
          {comment: "Test comment, please ignore", line: 3, type: "line"},
        ])
      ).toBe(expected);
    });

    it("writes a multiple line comment", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "console.log('hello world');",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "// Test comment, please ignore",
        "// This is a second line",
        "console.log('hello world');",
        "",
      ].join("\n");

      expect(
        commentSource(input, [
          {
            comment: "Test comment, please ignore\nThis is a second line",
            line: 3,
            type: "line",
          },
        ])
      ).toBe(expected);
    });

    it("writes a block comment", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "console.log('hello world');",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "/* Test comment, please ignore */",
        "console.log('hello world');",
        "",
      ].join("\n");

      expect(
        commentSource(input, [
          {comment: "Test comment, please ignore", line: 3, type: "block"},
        ])
      ).toBe(expected);
    });

    it("writes a multiline block comment", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "console.log('hello world');",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "/* Test comment, please ignore",
        " * A second line",
        " */",
        "console.log('hello world');",
        "",
      ].join("\n");

      expect(
        commentSource(input, [
          {
            comment: "Test comment, please ignore\nA second line",
            line: 3,
            type: "block",
          },
        ])
      ).toBe(expected);
    });

    it("writes multiple comments in the order given", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "console.log('hello world');",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "// A comment on line 2",
        "",
        "// Test comment, please ignore",
        "/* A block comment for the same line */",
        "console.log('hello world');",
        "",
      ].join("\n");

      expect(
        commentSource(input, [
          {comment: "Test comment, please ignore", line: 3, type: "line"},
          {
            comment: "A block comment for the same line",
            line: 3,
            type: "block",
          },
          {comment: "A comment on line 2", line: 2, type: "line"},
        ])
      ).toBe(expected);
    });

    describe("indent levels", () => {
      it("maintains the indent level in a single line comment", () => {
        const input = [
          "if (someCondition) {",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");
        const expected = [
          "if (someCondition) {",
          "  // Indented once",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    // Indented twice",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");

        expect(
          commentSource(input, [
            {comment: "Indented once", line: 2, type: "line"},
            {comment: "Indented twice", line: 5, type: "line"},
          ])
        ).toBe(expected);
      });
      it("maintains the indent level in a single line comment with tabs", () => {
        const input = [
          "if (someCondition) {",
          "\tconsole.log('indented one time');",
          "",
          "\tif (anotherCondition) {",
          "\t\tconsole.log('indented twice')",
          "\t}",
          "}",
          "",
        ].join("\n");
        const expected = [
          "if (someCondition) {",
          "\t// Indented once",
          "\tconsole.log('indented one time');",
          "",
          "\tif (anotherCondition) {",
          "\t\t// Indented twice",
          "\t\tconsole.log('indented twice')",
          "\t}",
          "}",
          "",
        ].join("\n");

        expect(
          commentSource(input, [
            {comment: "Indented once", line: 2, type: "line"},
            {comment: "Indented twice", line: 5, type: "line"},
          ])
        ).toBe(expected);
      });
      it("maintains the indent level in a multiple line comment", () => {
        const input = [
          "if (someCondition) {",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");
        const expected = [
          "if (someCondition) {",
          "  // Indented once",
          "  // Second line",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    // Indented twice",
          "    // Why not",
          "    // Three lines?",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");

        expect(
          commentSource(input, [
            {comment: "Indented once\nSecond line", line: 2, type: "line"},
            {
              comment: "Indented twice\nWhy not\nThree lines?",
              line: 5,
              type: "line",
            },
          ])
        ).toBe(expected);
      });
      it("maintains the indent level in a block comment", () => {
        const input = [
          "if (someCondition) {",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");
        const expected = [
          "if (someCondition) {",
          "  /* Indented once */",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    /* Indented twice */",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");

        expect(
          commentSource(input, [
            {comment: "Indented once", line: 2, type: "block"},
            {comment: "Indented twice", line: 5, type: "block"},
          ])
        ).toBe(expected);
      });
      it("maintains the indent level in a multiline block comment", () => {
        const input = [
          "if (someCondition) {",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");
        const expected = [
          "if (someCondition) {",
          "  /* Indented once",
          "   * Second line",
          "   */",
          "  console.log('indented one time');",
          "",
          "  if (anotherCondition) {",
          "    /* Indented twice",
          "     * Why not",
          "     * Three lines?",
          "     */",
          "    console.log('indented twice')",
          "  }",
          "}",
          "",
        ].join("\n");

        expect(
          commentSource(input, [
            {comment: "Indented once\nSecond line", line: 2, type: "block"},
            {
              comment: "Indented twice\nWhy not\nThree lines?",
              line: 5,
              type: "block",
            },
          ])
        ).toBe(expected);
      });
    });
  });

  describe("in JSX code", () => {
    it("writes a single line comment in a JSX block", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  {/* Test comment, please ignore */}",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");

      expect(
        commentSource(
          input,
          [{comment: "Test comment, please ignore", line: 4, type: "line"}],
          {jsx: true}
        )
      ).toBe(expected);
    });

    it("writes a multiple line comment in a JSX block", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  {/* Test comment, please ignore */}",
        "  {/* This is a second line */}",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");

      expect(
        commentSource(
          input,
          [
            {
              comment: "Test comment, please ignore\nThis is a second line",
              line: 4,
              type: "line",
            },
          ],
          {jsx: true}
        )
      ).toBe(expected);
    });

    it("writes a block comment in a JSX block", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  {/* Test comment, please ignore */}",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");

      expect(
        commentSource(
          input,
          [{comment: "Test comment, please ignore", line: 4, type: "block"}],
          {jsx: true}
        )
      ).toBe(expected);
    });

    it("writes a multiline block comment in a JSX block", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  {/* Test comment, please ignore",
        "    * This is a second line",
        "    */}",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");

      expect(
        commentSource(
          input,
          [
            {
              comment: "Test comment, please ignore\nThis is a second line",
              line: 4,
              type: "block",
            },
          ],
          {jsx: true}
        )
      ).toBe(expected);
    });

    it("writes a JS comment in a JSX attribute", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  <span className={",
        '    "pullRight"',
        "  }>Hello world</span>",
        "</div>",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  <span className={",
        "    // Test comment, please ignore",
        '    "pullRight"',
        "  }>Hello world</span>",
        "</div>",
        "",
      ].join("\n");

      expect(
        commentSource(
          input,
          [{comment: "Test comment, please ignore", line: 5, type: "line"}],
          {jsx: true}
        )
      ).toBe(expected);
    });

    it("writes a JS comment in a JSX expression container", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  {",
        "    1 + 1",
        "  }",
        "</div>",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  {",
        "    // Test comment, please ignore",
        "    1 + 1",
        "  }",
        "</div>",
        "",
      ].join("\n");

      expect(
        commentSource(
          input,
          [{comment: "Test comment, please ignore", line: 5, type: "line"}],
          {jsx: true}
        )
      ).toBe(expected);
    });

    it("writes a JS comment at the start of a JSX block", () => {
      const input = [
        "// TEAM: frontend_infra",
        "",
        "<div>",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");
      const expected = [
        "// TEAM: frontend_infra",
        "",
        "// Test comment, please ignore",
        "<div>",
        "  <span>Hello world</span>",
        "</div>",
        "",
      ].join("\n");

      expect(
        commentSource(
          input,
          [
            {
              comment: "Test comment, please ignore",
              line: 3,
              type: "line",
            },
          ],
          {jsx: true}
        )
      ).toBe(expected);
    });
  });
});
