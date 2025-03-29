import html2md from 'html-to-md';
import { doc } from '@quanta/agent';

const ignoreTags = [
  '',
  'script',
  'iframe',
  'style',
  'meta',
  'img',
  'a',
  'noscript',
  'svg',
  'audio',
  'video',
  'canvas',
  'map',
  'source',
  'dialog',
  'menu',
  'menuitem',
  'track',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'select',
  'textarea',
  'label',
  'option',
  'optgroup',
  'aside',
  'footer',
  'header',
  'nav',
  'head',
  'code',
];

function sendMessageToExtension(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      'djpelnepfeeoghemachhkeaefejioloe',
      message,
      (response: { ok: any; error: any; data: any }) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else if (!response?.ok) {
          reject(response?.error || 'Unknown error');
        } else {
          resolve(response.data);
        }
      },
    );
  });
}

async function begin() {
  const session = await sendMessageToExtension({ action: 'quanta-begin' });
  return session.sessionId;
}

function end(sessionId: number) {
  return sendMessageToExtension({ action: 'quanta-end', sessionId });
}

async function goto(sessionId: number, url: string) {
  const result = await sendMessageToExtension({
    action: 'quanta-goto',
    sessionId,
    url,
  });
  result.html = html2md(result.html, { ignoreTags });
  return result;
}

function click(sessionId: number, elementIndex: number) {
  return sendMessageToExtension({
    action: 'quanta-click',
    sessionId,
    elementIndex,
  });
}

function type(sessionId: number, elementIndex: number, text: string) {
  return sendMessageToExtension({
    action: 'quanta-type',
    sessionId,
    elementIndex,
    text,
  });
}

function run(sessionId: number, code: string) {
  return sendMessageToExtension({ action: 'quanta-run', sessionId, code });
}

async function getAllTabs() {
  return sendMessageToExtension({ action: 'quanta-get-all-tabs' });
}

async function useTab(tabId: number) {
  const session = await sendMessageToExtension({
    action: 'quanta-use-tab',
    tabId,
  });
  return session.sessionId;
}

export const browser = {
  __doc__: `
    An API to manipulate the user's browser, create tabs and interact with forms/input.
    Before interacting with a page make sure you observe the output of navigation so you know the indexes of the interactable elements.
    Do not use click/type until you observe the value of goto otherwise you will hallucinate.
    You should be using this API in sequential action-observation steps as it is important you read the output of goto before trying to interact with a page. How can you interact with what you can't see?
    Use browser over search when trying to scrape for structured data/more specific data.
    You can now work with all browser tabs, not just ones created by this extension.
  `,

  begin: doc(
    'browser.begin',
    begin,
    `(): Promise<BrowserSession>
Creates and returns a new browser session ID with a new tab.
const session = await browser.begin();`,
  ),

  end: doc(
    'browser.end',
    end,
    `(session: BrowserSession): Promise<void>
Ends an active browser session.
await browser.end(session);
    `,
  ),

  getAllTabs: doc(
    'browser.getAllTabs',
    getAllTabs,
    `(): Promise<Array<{id: number, url: string, title: string }>>
Returns information about all open tabs in the browser.
Observe open tabs in case the user has a tab open that their instructions reference.
const tabs = await browser.getAllTabs();`,
  ),

  useTab: doc(
    'browser.useTab',
    useTab,
    `(tabId: number): Promise<BrowserSession>
Creates a session using an existing tab instead of creating a new one.
const session = await browser.useTab(tabId);`,
  ),

  goto: doc(
    'browser.goto',
    goto,
    `(session: BrowserSession, url: string): Promise<{ html: string; interactableElements: any[] }>
Navigates to a URL and returns the page content with interactable elements.
Important: Observe the returned element indexes before using click/type.
const page = await browser.goto(session, "https://example.com");`,
  ),

  click: doc(
    'browser.click',
    click,
    `(session: BrowserSession, elementIndex: number): Promise<void>
Clicks an element by its index (from goto's response).
await browser.click(session, 1);`,
  ),

  type: doc(
    'browser.type',
    type,
    `(session: BrowserSession, elementIndex: number, text: string): Promise<void>
Types text into an input field by its index (from goto's response).
await browser.type(session, 0, "Hello World!");`,
  ),

  run: doc(
    'browser.run',
    run,
    `(session: BrowserSession, code: string): Promise<any>
Executes JavaScript code in the current page context.
await browser.run(session, "document.title");`,
  ),
};
