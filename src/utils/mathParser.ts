class ParseError extends Error {}

class Parser {
  private index = 0;

  constructor(private readonly input: string) {}

  parse(): number {
    const value = this.parseExpression();
    this.skipWhitespace();
    if (this.index < this.input.length) {
      throw new ParseError(`Unexpected token at position ${this.index + 1}`);
    }
    if (!Number.isFinite(value)) {
      throw new ParseError('Invalid mathematical result');
    }
    return value;
  }

  private parseExpression(): number {
    let value = this.parseTerm();

    while (true) {
      this.skipWhitespace();
      if (this.match('+')) {
        value += this.parseTerm();
      } else if (this.match('-')) {
        value -= this.parseTerm();
      } else {
        break;
      }
    }

    return value;
  }

  private parseTerm(): number {
    let value = this.parseUnary();

    while (true) {
      this.skipWhitespace();
      if (this.match('*')) {
        value *= this.parseUnary();
      } else if (this.match('/')) {
        const divisor = this.parseUnary();
        if (divisor === 0) {
          throw new ParseError('Division by zero');
        }
        value /= divisor;
      } else if (this.match('%')) {
        const divisor = this.parseUnary();
        if (divisor === 0) {
          throw new ParseError('Modulo by zero');
        }
        value %= divisor;
      } else {
        break;
      }
    }

    return value;
  }

  private parseUnary(): number {
    this.skipWhitespace();
    if (this.match('-')) {
      return -this.parseUnary();
    }
    if (this.match('+')) {
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    this.skipWhitespace();

    if (this.match('(')) {
      const value = this.parseExpression();
      this.expect(')');
      return value;
    }

    if (this.peekIsAlpha()) {
      return this.parseFunctionOrConstant();
    }

    return this.parseNumber();
  }

  private parseFunctionOrConstant(): number {
    const name = this.readIdentifier().toLowerCase();

    if (name === 'pi') {
      return Math.PI;
    }

    if (name === 'e') {
      return Math.E;
    }

    this.expect('(');

    const args: number[] = [];
    if (!this.check(')')) {
      args.push(this.parseExpression());
      while (this.match(',')) {
        args.push(this.parseExpression());
      }
    }

    this.expect(')');

    switch (name) {
      case 'sqrt':
        this.assertArgs(name, args, 1);
        if (args[0] < 0) {
          throw new ParseError('sqrt() does not accept negative numbers');
        }
        return Math.sqrt(args[0]);
      case 'pow':
        this.assertArgs(name, args, 2);
        return Math.pow(args[0], args[1]);
      case 'abs':
        this.assertArgs(name, args, 1);
        return Math.abs(args[0]);
      case 'floor':
        this.assertArgs(name, args, 1);
        return Math.floor(args[0]);
      case 'ceil':
        this.assertArgs(name, args, 1);
        return Math.ceil(args[0]);
      case 'round':
        this.assertArgs(name, args, 1);
        return Math.round(args[0]);
      default:
        throw new ParseError(`Unsupported function: ${name}`);
    }
  }

  private parseNumber(): number {
    this.skipWhitespace();
    const start = this.index;

    while (this.index < this.input.length && /[0-9.]/.test(this.input[this.index])) {
      this.index += 1;
    }

    if (start === this.index) {
      throw new ParseError(`Expected number at position ${this.index + 1}`);
    }

    const literal = this.input.slice(start, this.index);
    const value = Number(literal);
    if (Number.isNaN(value)) {
      throw new ParseError(`Invalid number: ${literal}`);
    }

    return value;
  }

  private readIdentifier(): string {
    const start = this.index;
    while (this.index < this.input.length && /[a-zA-Z]/.test(this.input[this.index])) {
      this.index += 1;
    }

    return this.input.slice(start, this.index);
  }

  private expect(char: string): void {
    this.skipWhitespace();
    if (!this.match(char)) {
      throw new ParseError(`Expected '${char}' at position ${this.index + 1}`);
    }
  }

  private check(char: string): boolean {
    this.skipWhitespace();
    return this.input[this.index] === char;
  }

  private match(char: string): boolean {
    this.skipWhitespace();
    if (this.input[this.index] === char) {
      this.index += 1;
      return true;
    }
    return false;
  }

  private skipWhitespace(): void {
    while (this.index < this.input.length && /\s/.test(this.input[this.index])) {
      this.index += 1;
    }
  }

  private peekIsAlpha(): boolean {
    this.skipWhitespace();
    return /[a-zA-Z]/.test(this.input[this.index] ?? '');
  }

  private assertArgs(name: string, args: number[], expected: number): void {
    if (args.length !== expected) {
      throw new ParseError(`${name}() expects ${expected} argument(s)`);
    }
  }
}

export const evaluateExpression = (expression: string): number => {
  if (!expression.trim()) {
    throw new Error('Expression is empty');
  }

  const parser = new Parser(expression);
  return parser.parse();
};

export const formatMathResult = (value: number): string => {
  if (!Number.isFinite(value)) {
    return 'Invalid';
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number(value.toFixed(10)).toString();
};
