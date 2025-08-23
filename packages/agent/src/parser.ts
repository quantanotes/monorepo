enum ParseState {
  TEXT = 'TEXT',
  HASH = 'HASH',
  MARKER = 'MARKER',
}

interface Transition {
  state: string;
  attributes: Record<string, any>;
}

interface AgentParserTextResult {
  type: 'text';
  text: string;
}

interface AgentParserTransitionResult extends Transition {
  type: 'transition';
}

type AgentParserResult = AgentParserTextResult | AgentParserTransitionResult;

class AgentParser {
  #state = ParseState.TEXT;
  #buffer = '';

  async *parse(
    stream: AsyncIterable<string>,
  ): AsyncGenerator<AgentParserResult> {
    for await (const chunk of stream) {
      for (const char of chunk) {
        yield* this.#step(char);
      }
    }

    if (this.#state === ParseState.HASH) {
      yield this.#yieldText('#');
    }

    if (this.#state === ParseState.MARKER) {
      yield this.#yieldText('#[' + this.#buffer);
    }
  }

  *#step(char: string): Generator<AgentParserResult> {
    switch (this.#state) {
      case ParseState.TEXT: {
        if (char === '#') {
          this.#state = ParseState.HASH;
        } else {
          yield this.#yieldText(char);
        }
        break;
      }
      case ParseState.HASH: {
        if (char === '[') {
          this.#state = ParseState.MARKER;
          this.#buffer = '';
        } else {
          yield this.#yieldText('#' + char);
          this.#state = ParseState.TEXT;
        }
        break;
      }
      case ParseState.MARKER: {
        if (char === ']') {
          const transition = this.#parseTransition(this.#buffer);
          yield this.#yieldTransition(transition);
          this.#state = ParseState.TEXT;
        } else {
          this.#buffer += char;
        }
        break;
      }
    }
  }

  #yieldText(text: string): AgentParserResult {
    return {
      type: 'text',
      text,
    };
  }

  #yieldTransition(transition: Transition): AgentParserResult {
    return {
      type: 'transition',
      ...transition,
    };
  }

  #parseTransition(input: string) {
    const [state, ...attrs] = input.split('|');
    const attributes: Record<string, any> = {};

    for (const pair of attrs) {
      const [key, raw] = pair.split('=');
      if (key && raw) {
        attributes[key.trim()] = this.#parseAttrValue(raw.trim());
      } else if (key) {
        attributes[key] = true;
      }
    }

    return { state, attributes };
  }

  #parseAttrValue(input: string): any {
    if (/^".*"$/.test(input)) {
      try {
        return JSON.parse(input);
      } catch {
        return input.slice(1, -1);
      }
    }

    if (!isNaN(Number(input))) {
      return Number(input);
    }

    if (input === 'true' || input === 'false') {
      return input === 'true';
    }

    return input;
  }
}

export async function* parseStream(stream: AsyncIterable<string>) {
  yield* new AgentParser().parse(stream);
}
