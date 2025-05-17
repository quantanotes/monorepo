import {
  createStartHandler,
  defaultStreamHandler,
  defineEventHandler,
  toWebRequest,
} from '@tanstack/react-start/server';
import aiAgentHandler from './routes/api.ai.agent';
import { createRouter } from './router';

// const startHandler =

export default createStartHandler({
  createRouter,
})(defaultStreamHandler);

// defineEventHandler(async (event) => {
//   const req = toWebRequest(event);
//   const nodeReq = event.node?.req;
//   const nodeRes = event.node?.res;

//   if (nodeReq?.url === '/api/ai/agent') {
//     return;
//   } else {
//     return startHandler(event);
//   }
// });
