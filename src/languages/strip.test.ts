import { describe, expect, it } from 'vitest';
import { stripCLike, stripJava, stripPython } from './strip.js';

const js = (src: string) =>
  stripCLike(src, { templateLiterals: true, textBlocks: false });
const java = (src: string) =>
  stripCLike(src, { templateLiterals: false, textBlocks: true });

describe('stripCLike', () => {
  it('removes line and block comments, keeping line breaks', () => {
    expect(js('a(); // it.skip(\nb(); /* x\ny */ c();')).toBe(
      `a();${' '.repeat(12)}\nb();${' '.repeat(5)}\n${' '.repeat(5)}c();`,
    );
  });

  it('blanks string contents but keeps quotes', () => {
    expect(js(`it('a // b', () => {});`)).toBe(`it('      ', () => {});`);
    expect(js(`x = "say \\"hi\\" // no";`)).toBe(`x = "                ";`);
  });

  it('blanks multi-line template literals but keeps expression code', () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: JS source under test
    expect(js('t = `expect(\n${x}`;')).toBe('t = `       \n  x `;');
  });

  it('follows templates nested in expressions', () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: JS source under test
    const src = 's = `${a ? `${"`"}` : {}}`;\nit.skip(x);\nu = `it(`;';
    const out = js(src).split('\n');
    expect(out[0]).toContain('a ? ');
    expect(out[0]).not.toContain('"`"');
    expect(out[1]).toBe('it.skip(x);');
    expect(out[2]).toBe('u = `   `;');
  });

  it('decodes Java unicode escapes, keeping lines', () => {
    const src = [
      'class A {',
      '  // \\u000a @Disabled',
      '  \\u0040Disabled void a() {}',
      '  String s = "\\\\u0040Test";',
      '}',
    ].join('\n');
    const out = stripJava(src).split('\n');
    expect(out).toHaveLength(5);
    expect(out[1]).toContain('@Disabled');
    expect(out[2]).toContain('@Disabled void a()');
    expect(out[3]).not.toContain('@');
    // The decoded quote closes the string.
    expect(stripJava('s = "\\u0022; @Test')).toContain('@Test');
    expect(java('s = "\\u0022; @Test')).not.toContain('@Test');
  });

  it('handles Java text blocks and char literals', () => {
    expect(java('s = """\n@Test\n""";')).toBe('s = """\n     \n""";');
    expect(java(`c = '"'; @Test`)).toBe(`c = ' '; @Test`);
  });

  it('keeps CRLF line breaks', () => {
    const src = 'a(); // x\r\n/* y\r\n*/ b();\r\n';
    const out = js(src);
    expect(out.length).toBe(src.length);
    expect(out.split('\r\n')).toHaveLength(src.split('\r\n').length);
  });
});

describe('stripPython', () => {
  it('removes # comments but not # inside strings', () => {
    expect(stripPython('x = "#"  # assert\nassert x')).toBe(
      'x = " "          \nassert x',
    );
  });

  it('blanks triple-quoted strings across lines', () => {
    expect(stripPython('"""doc\nassert 1\n"""\ndef test_a(): pass')).toBe(
      '"""   \n        \n"""\ndef test_a(): pass',
    );
    expect(stripPython("s = '''a'''")).toBe("s = ''' '''");
  });

  it('handles escaped quotes in single-line strings', () => {
    expect(stripPython(`r'a\\' b' + x`)).toBe(`r'     ' + x`);
  });
});
