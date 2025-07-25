interface AgentParserState {
  state: string;
  attributes: Record<string, string | number | boolean>;
}

interface AgentParserResult extends AgentParserState {
  text: string;
  transition: boolean;
}

export async function* parseStream(
  stream: AsyncIterable<string>,
): AsyncGenerator<AgentParserResult> {
  let buffer = '';
  let currentState: AgentParserState = { state: 'default', attributes: {} };
  let markerBuffer = '';
  let inMarker = false;
  let partialMarkerStart = false;
  let transition = false;

  for await (const chunk of stream) {
    console.log('recieving chunk:', chunk);
    buffer += chunk;

    while (buffer.length > 0) {
      if (inMarker) {
        const endIndex = findMarkerEnd(buffer);

        if (endIndex === -1) {
          markerBuffer += buffer;
          buffer = '';
          break;
        }

        markerBuffer += buffer.substring(0, endIndex);
        const newState = parseStateMarker(markerBuffer);

        // Set transition flag if state has changed
        transition = newState.state !== currentState.state;
        currentState = newState;

        inMarker = false;
        markerBuffer = '';
        buffer = buffer.substring(endIndex + 1);
        continue;
      }

      if (partialMarkerStart) {
        partialMarkerStart = false;

        if (buffer.startsWith('[')) {
          inMarker = true;
          buffer = buffer.substring(1);
          continue;
        } else {
          yield* yieldText('#', currentState, transition);
          // Reset transition flag after yielding
          transition = false;
        }
      }

      const hashIndex = findMarkerStart(buffer);

      if (hashIndex === -1) {
        yield* yieldText(buffer, currentState, transition);
        // Reset transition flag after yielding
        transition = false;
        buffer = '';
        break;
      }

      if (hashIndex > 0) {
        const textBeforeMarker = extractTextBeforeMarker(buffer, hashIndex);
        yield* yieldText(textBeforeMarker, currentState, transition);
        // Reset transition flag after yielding
        transition = false;
        buffer = buffer.substring(hashIndex);
      }

      if (buffer.length === 1) {
        partialMarkerStart = true;
        buffer = '';
        break;
      }

      if (isCompleteMarkerStart(buffer)) {
        inMarker = true;
        buffer = buffer.substring(2);
        continue;
      } else {
        yield* yieldText('#', currentState, transition);
        // Reset transition flag after yielding
        transition = false;
        buffer = buffer.substring(1);
      }
    }
  }

  if (buffer) {
    yield* yieldText(buffer, currentState, transition);
    // Reset transition flag after yielding
    transition = false;
  }

  if (partialMarkerStart) {
    yield* yieldText('#', currentState, transition);
    // Reset transition flag after yielding
    transition = false;
  }
}

function parseAttributeValue(valueRaw: string): string | number | boolean {
  const value = valueRaw.trim();

  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.substring(1, value.length - 1);
    }
  }

  if (!isNaN(Number(value))) {
    return Number(value);
  }

  if (value === 'true' || value === 'false') {
    return value === 'true';
  }

  return value;
}

function parseStateMarker(markerContent: string): AgentParserState {
  const parts = markerContent.split('|');
  const type = parts[0];
  const attributes = parts
    .slice(1)
    .map((pair) => {
      const separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) return null;

      const key = pair.substring(0, separatorIndex).trim();
      const valueRaw = pair.substring(separatorIndex + 1);
      return { key, value: parseAttributeValue(valueRaw) };
    })
    .filter(
      (item): item is { key: string; value: string | number | boolean } =>
        item !== null,
    )
    .reduce(
      (acc, { key, value }) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string | number | boolean>,
    );

  return { state: type, attributes };
}

async function* yieldText(
  text: string,
  state: AgentParserState,
  stateTransition: boolean,
): AsyncGenerator<AgentParserResult> {
  if (text) {
    yield { ...state, text, transition: stateTransition };
  }
}

function isCompleteMarkerStart(buffer: string): boolean {
  return buffer.startsWith('#[');
}

function extractTextBeforeMarker(buffer: string, markerIndex: number): string {
  return buffer.substring(0, markerIndex);
}

function findMarkerEnd(buffer: string): number {
  return buffer.indexOf(']');
}

function findMarkerStart(buffer: string): number {
  return buffer.indexOf('#');
}
