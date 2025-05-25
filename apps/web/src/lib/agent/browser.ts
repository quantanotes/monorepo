import html2md from 'html-to-md';
import { doc } from '@quanta/agent';
import {
  begin,
  end,
  list,
  get,
  goto,
  click,
  type,
  run,
  waitForNetworkIdle,
  waitForSelector,
  waitForEvent,
} from '@quanta/browser';

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

export const browser = {
  __doc__: `An API to manipulate the user's browser, create tabs and interact with forms/input.
Before interacting with a page make sure you observe the output of navigation so you know the indexes of the interactable elements.
Do not use click/type until you observe the value of goto otherwise you will hallucinate.
You should be using this API in sequential action-observation steps as it is important you read the output of goto before trying to interact with a page. How can you interact with what you can't see?
Use browser over search when trying to scrape for structured data/more specific data.
For modern web applications, it's crucial to wait for page hydration and dynamic content loading.
Navigate directly to the page you want to scrape, without attempting to follow internal links.
Examples:
// Scraping a linkedin profile
const tab = await browser.begin();
await browser.goto(tab, "https://www.linkedin.com/in/johndoe/");
await browser.wait_for_network_idle(tab);
const { content } = await browser.get(tab);
return content;

// Making a tweet
__doc__tab = 'Current working tab, on the twitter page.'
tab = await browser.begin();
await browser.goto(tab, "https://x.com/");
await browser.wait_for_network_idle(tab);
const { interactables } = await browser.get(tab);
// Observe the output from get, to ensure you're typing into the right element.
return interactables;
// Continuing from previous observation
await browser.type(tab, 4, "Hello World!");
await browser.click(tab, 1);
`,
  begin: doc(
    'browser.begin',
    begin,
    `(): Promise<number>
Creates and returns a new browser tab.
const tab = await browser.begin();`,
  ),

  end: doc(
    'browser.end',
    end,
    `(tab: number): Promise<void>
Ends an active browser tab.
await browser.end(tab);
    `,
  ),

  list: doc(
    'browser.list',
    list,
    `(): Promise<Array<{id: number, url: string, title: string }>>
Returns information about all open tabs in the browser.
Observe open tabs in case the user has a tab open that their instructions reference.
const tabs = await browser.list();`,
  ),

  get: doc(
    'browser.get',
    async function (tab: number) {
      const { html, interactables } = await get(tab);
      const content = html2md(html, { ignoreTags });
      return { content, interactables };
    },
    `(tab: number): Promise<{ content: string; interactables: any[] }>
Gets the markdown version of the page content and interactable elements of a tab.
Always use this before interacting with a page - you can't interact with what you can't see.
Observe the returned element indexes before using click/type.
const page = await browser.get(tab);`,
  ),

  goto: doc(
    'browser.goto',
    goto,
    `(tab: number, url: string)
Navigates to a URL.
await browser.goto(tab, "https://example.com");`,
  ),

  click: doc(
    'browser.click',
    click,
    `(tab: number, elementIndex: number): Promise<void>
Clicks an element by its index.
Make sure you observe the output from get, to ensure you're clicking the right element.
await browser.click(tab, 1);`,
  ),

  type: doc(
    'browser.type',
    type,
    `(tab: number, elementIndex: number, text: string): Promise<void>
Types text into an input field by its index.
Make sure you observe the output from get, to ensure you're typing into the right element.
await browser.type(tab, 0, "Hello World!");`,
  ),

  run: doc(
    'browser.run',
    run,
    `(tab: number, code: string): Promise<any>
Evaluates JavaScript code in the current page context.
await browser.run(tab, "document.title");`,
  ),

  wait_for_network_idle: doc(
    'browser.wait_for_network_idle',
    waitForNetworkIdle,
    `(tab: number, timeout?: number): Promise<boolean>
Waits until there are no network requests for the specified duration.
Use this after goto() to ensure all initial resources are loaded.
const isIdle = await browser.wait_for_network_idle(tab, 5000);`,
  ),

  wait_for_selector: doc(
    'browser.wait_for_selector',
    waitForSelector,
    `(tab: number, selector: string, timeout?: number): Promise<boolean>
Waits for a DOM element matching the selector to appear.
Use this to wait for specific content to be loaded or rendered.
const elementFound = await browser.wait_for_selector(tab, "#main-content", 5000);`,
  ),

  wait_for_event: doc(
    'browser.wait_for_event',
    waitForEvent,
    `(tab: number, eventName: string, timeout?: number): Promise<boolean>
Waits for a specific event to occur on the document.
Use this to wait for page load events or custom application events.
const eventFired = await browser.wait_for_event(tab, "load", 5000);`,
  ),
};
