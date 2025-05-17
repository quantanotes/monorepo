declare const chrome: any;

const extensionId = 'gncimofjkfilkjgbjgjkenbomecdegkg';

async function sendMessage(action: string, data?: any): Promise<any> {
  const response = await chrome.runtime.sendMessage(extensionId, {
    action,
    data,
  });
  if (!response?.ok) {
    throw new Error(response?.error || 'Unknown error');
  }
  return response.data;
}

export async function begin() {
  const result = await sendMessage('begin');
  return result.tabId;
}

export function end(tabId: number) {
  return sendMessage('end', { tabId });
}

export function list() {
  return sendMessage('list');
}

export function goto(tabId: number, url: string) {
  return sendMessage('goto', { tabId, url });
}

export function get(tabId: number) {
  return sendMessage('get', { tabId });
}

export function click(tabId: number, index: number) {
  return sendMessage('click', { tabId, index });
}

export function type(tabId: number, index: number, text: string) {
  return sendMessage('type', { tabId, index, text });
}

export function run(tabId: number, code: string) {
  return sendMessage('run', { tabId, code });
}

export function waitForNetworkIdle(tabId: number, timeout: number = 50000) {
  return sendMessage('waitForNetworkIdle', { tabId, timeout });
}

export function waitForSelector(
  tabId: number,
  selector: string,
  timeout: number = 50000,
) {
  return sendMessage('waitForSelector', { tabId, selector, timeout });
}

export function waitForEvent(
  tabId: number,
  event: string,
  timeout: number = 50000,
) {
  return sendMessage('waitForEvent', { tabId, event, timeout });
}
