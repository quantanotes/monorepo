import { docs } from './doc';

interface AgentOutputStep {
  type: string;
  content: string;
  title?: string;
  observe?: boolean;
}

interface AgentActionStep extends AgentOutputStep {
  type: 'action';
  status?: 'pending' | 'completed' | 'failed';
}

const AsyncFunction = (async () => {}).constructor;

export function runAgentClient(
  environment: any,
  messages: any[],
  onchunk: (chunk: AgentOutputStep | AgentActionStep) => void,
  onfinish: () => void,
) {
  const ws = new WebSocket(process.env.PUBLIC_APP_URL + '/api/ai/agent');

  ws.onopen = () => {
    const req = {
      environment: docs(environment),
      messages,
    };
    ws.send(JSON.stringify(req));
  };

  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data) as AgentOutputStep;

    if (data.type === 'action') {
      const action: AgentActionStep = {
        ...data,
        type: 'action',
        status: 'pending',
      };
      onchunk(action);

      let result = '';
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('executing', action.content);
        }
        const body = `with (this) {${action.content}}`;
        const evalResult = await AsyncFunction(body).call(environment);
        result = JSON.stringify(evalResult);

        action.status = 'completed';
        onchunk(action);

        if (action.observe) {
          ws.send(result);
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : String(err);
        result = error;

        action.status = 'failed';
        onchunk(action);

        if (action.observe) {
          ws.send(error);
        }
      }
    } else {
      onchunk(data);
    }
  };

  ws.onclose = () => {
    onfinish();
  };

  return () => ws.close();
}
