declare const chrome: any;

type Send = (response: any) => void;

function ok(send: Send, data: any) {
  send({ ok: true, data });
}

function error(send: Send, error: string) {
  send({ ok: false, error });
}

function getInteractableElementsDOM() {
  return Array.from(
    document.querySelectorAll('button, input, a, select, textarea'),
  );
}

function getInteractableElements() {
  return getInteractableElementsDOM().map((el, index) => ({
    index,
    tag: (el as HTMLElement).tagName,
    text: (el as HTMLElement).innerText,
    value: (el as HTMLInputElement).value,
  }));
}

function executeAndSendInTab(tabId: number, func: () => any, send: Send) {
  return chrome.scripting.executeScript(
    {
      target: { tabId },
      func: func,
    },
    (results: { result: any }[]) => {
      if (chrome.runtime.lastError) {
        error(send, chrome.runtime.lastError);
        return;
      }
      ok(send, results[0]?.result);
    },
  );
}

async function list(send: Send) {
  const tabs = await chrome.tabs.query({});
  ok(send, tabs);
}

async function begin(send: Send) {
  const tab = await chrome.tabs.create({ active: false });
  ok(send, { tabId: tab.id });
}

function end(send: Send, data: { tabId: number }) {
  chrome.tabs.remove(data.tabId);
  ok(send, undefined);
}

async function goto(send: Send, data: { tabId: number; url: string }) {
  try {
    await chrome.tabs.update(data.tabId, { url: data.url });
    ok(send, {});
  } catch (error) {
    error(send, error.message);
  }
}

function get(send: Send, data: { tabId: number }) {
  function get() {
    function getInteractableElementsDOM() {
      return Array.from(
        document.querySelectorAll('button, input, a, select, textarea'),
      );
    }

    function getInteractableElements() {
      return getInteractableElementsDOM().map((el, index) => ({
        index,
        tag: (el as HTMLElement).tagName,
        text: (el as HTMLElement).innerText,
        value: (el as HTMLInputElement).value,
      }));
    }

    const html = document.documentElement.outerHTML;
    const interactables = getInteractableElements();
    return { html, interactables };
  }
  executeAndSendInTab(data.tabId, get, send);
}

function click(send: Send, data: { tabId: number; index: number }) {
  function click() {
    function getInteractableElementsDOM() {
      return Array.from(
        document.querySelectorAll('button, input, a, select, textarea'),
      );
    }

    const el = getInteractableElementsDOM()[data.index];
    (el as HTMLElement).click();
  }
  executeAndSendInTab(data.tabId, click, send);
}

function type(
  send: Send,
  data: { tabId: number; index: number; text: string },
) {
  function type() {
    function getInteractableElementsDOM() {
      return Array.from(
        document.querySelectorAll('button, input, a, select, textarea'),
      );
    }

    const el = getInteractableElementsDOM()[data.index];
    (el as HTMLInputElement).value = data.text;
  }
  executeAndSendInTab(data.tabId, type, send);
}

function run(send: Send, data: { tabId: number; code: string }) {
  function run() {
    eval(data.code);
  }
  executeAndSendInTab(data.tabId, run, send);
}

function waitForNetworkIdle(send: Send, data: { tabId: number }) {
  function watchNetworkIdle() {
    return new Promise<void>((resolve) => {
      const timeout = 500;
      let last = Date.now();
      const observer = new PerformanceObserver(() => {
        last = Date.now();
      });
      observer.observe({ entryTypes: ['resource'] });
      const checkInterval = setInterval(() => {
        const now = Date.now();
        if (now - last >= timeout) {
          clearInterval(checkInterval);
          observer.disconnect();
          resolve();
        }
      }, 100);
    });
  }

  executeAndSendInTab(data.tabId, watchNetworkIdle, send);
}

function waitForSelector(
  send: Send,
  data: { tabId: number; selector: string; timeout: number },
) {
  function watchSelector() {
    return new Promise((resolve) => {
      const start = Date.now();

      const checkSelector = () => {
        const element = document.querySelector(data.selector);
        if (element) {
          resolve(true);
          return;
        }

        if (Date.now() - start >= data.timeout) {
          resolve(false);
          return;
        }

        setTimeout(checkSelector, 100);
      };

      checkSelector();
    });
  }

  executeAndSendInTab(data.tabId, watchSelector, send);
}

function waitForEvent(
  send: Send,
  data: { tabId: number; event: string; timeout: number },
) {
  function watchEvent() {
    return new Promise((resolve) => {
      const start = Date.now();

      const eventHandler = () => {
        resolve(true);
        document.removeEventListener(data.event, eventHandler);
      };

      document.addEventListener(data.event, eventHandler);

      setTimeout(() => {
        if (Date.now() - start >= data.timeout) {
          resolve(false);
          document.removeEventListener(data.event, eventHandler);
        }
      }, data.timeout);
    });
  }
  executeAndSendInTab(data.tabId, watchEvent, send);
}

const handlers = {
  begin,
  end,
  list,
  goto,
  get,
  click,
  type,
  run,
  waitForNetworkIdle,
  waitForSelector,
  waitForEvent,
};

chrome.runtime.onMessageExternal.addListener((request, _, send) => {
  const { action, data } = request;
  const handler = handlers[action];
  if (!handler) {
    error(send, `Unknown action: ${action}`);
    return;
  }
  try {
    handler(send, data);
  } catch (err) {
    console.error(err);
    error(send, err.toString());
  }
});
