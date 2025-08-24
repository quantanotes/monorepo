import {
  getSelectionRanges,
  NodeRangeSelection,
} from '@tiptap/extension-node-range';
import type { Editor } from '@tiptap/core';
import type { SelectionRange } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type { Node } from '@tiptap/pm/model';

export function getComputedStyle(
  node: Element,
  property: keyof CSSStyleDeclaration,
): any {
  const style = window.getComputedStyle(node);

  return style[property];
}

function getCSSText(element: Element) {
  let value = '';
  const style = getComputedStyle(element);
  if (!style) {
    return value;
  }

  for (let i = 0; i < style.length; i += 1) {
    value += `${style[i]}:${style.getPropertyValue(style[i])};`;
  }

  return value;
}

export function cloneElement(node: HTMLElement) {
  const clonedNode = node.cloneNode(true) as HTMLElement;
  const sourceElements = [
    node,
    ...Array.from(node.getElementsByTagName('*')),
  ] as HTMLElement[];
  const targetElements = [
    clonedNode,
    ...Array.from(clonedNode.getElementsByTagName('*')),
  ] as HTMLElement[];

  sourceElements.forEach((sourceElement, index) => {
    targetElements[index].style.cssText = getCSSText(sourceElement);
  });

  return clonedNode;
}

function getDragHandleRanges(
  event: DragEvent,
  editor: Editor,
): SelectionRange[] {
  const { doc } = editor.view.state;

  const result = findElementNextToCoords({
    editor,
    x: event.clientX,
    y: event.clientY,
    direction: 'right',
  });

  if (!result.resultNode || result.pos === null) {
    return [];
  }

  const x = event.clientX;

  // @ts-ignore
  const coords = getInnerCoords(editor.view, x, event.clientY);
  const posAtCoords = editor.view.posAtCoords(coords);

  if (!posAtCoords) {
    return [];
  }

  const { pos } = posAtCoords;
  const nodeAt = doc.resolve(pos).parent;

  if (!nodeAt) {
    return [];
  }

  const $from = doc.resolve(result.pos);
  const $to = doc.resolve(result.pos + 1);

  return getSelectionRanges($from, $to, 0);
}

export function dragHandler(event: DragEvent, editor: Editor) {
  const { view } = editor;

  if (!event.dataTransfer) {
    return;
  }

  const { empty, $from, $to } = view.state.selection;

  const dragHandleRanges = getDragHandleRanges(event, editor);

  const selectionRanges = getSelectionRanges($from, $to, 0);
  const isDragHandleWithinSelection = selectionRanges.some((range) => {
    return dragHandleRanges.find((dragHandleRange) => {
      return (
        dragHandleRange.$from === range.$from &&
        dragHandleRange.$to === range.$to
      );
    });
  });

  const ranges =
    empty || !isDragHandleWithinSelection ? dragHandleRanges : selectionRanges;

  if (!ranges.length) {
    return;
  }

  const { tr } = view.state;
  const wrapper = document.createElement('div');
  const from = ranges[0].$from.pos;
  const to = ranges[ranges.length - 1].$to.pos;

  const selection = NodeRangeSelection.create(view.state.doc, from, to);
  const slice = selection.content();

  ranges.forEach((range) => {
    const element = view.nodeDOM(range.$from.pos) as HTMLElement;
    const clonedElement = cloneElement(element);

    wrapper.append(clonedElement);
  });

  wrapper.style.position = 'absolute';
  wrapper.style.top = '-10000px';
  document.body.append(wrapper);

  event.dataTransfer.clearData();
  event.dataTransfer.setDragImage(wrapper, 0, 0);

  // tell ProseMirror the dragged content
  view.dragging = { slice, move: true };

  tr.setSelection(selection);

  view.dispatch(tr);

  // clean up
  document.addEventListener('drop', () => removeNode(wrapper), { once: true });
}

export type FindElementNextToCoords = {
  x: number;
  y: number;
  direction?: 'left' | 'right';
  editor: Editor;
};

export const findElementNextToCoords = (options: FindElementNextToCoords) => {
  const { x, y, direction, editor } = options;
  let resultElement: HTMLElement | null = null;
  let resultNode: Node | null = null;
  let pos: number | null = null;

  let currentX = x;

  while (resultNode === null && currentX < window.innerWidth && currentX > 0) {
    const allElements = document.elementsFromPoint(currentX, y);
    const prosemirrorIndex = allElements.findIndex((element) =>
      element.classList.contains('ProseMirror'),
    );
    const filteredElements = allElements.slice(0, prosemirrorIndex);

    if (filteredElements.length > 0) {
      const target = filteredElements[0];

      resultElement = target as HTMLElement;
      pos = editor.view.posAtDOM(target, 0);

      if (pos >= 0) {
        resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));

        if (resultNode?.isText) {
          resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));
        }

        if (!resultNode) {
          resultNode = editor.state.doc.nodeAt(Math.max(pos, 0));
        }

        break;
      }
    }

    if (direction === 'left') {
      currentX -= 1;
    } else {
      currentX += 1;
    }
  }

  return { resultElement, resultNode, pos: pos ?? null };
};

export function getInnerCoords(
  view: EditorView,
  x: number,
  y: number,
): { left: number; top: number } {
  const paddingLeft = parseInt(getComputedStyle(view.dom, 'paddingLeft'), 10);
  const paddingRight = parseInt(getComputedStyle(view.dom, 'paddingRight'), 10);
  const borderLeft = parseInt(
    getComputedStyle(view.dom, 'borderLeftWidth'),
    10,
  );
  const borderRight = parseInt(
    getComputedStyle(view.dom, 'borderLeftWidth'),
    10,
  );
  const bounds = view.dom.getBoundingClientRect();
  const coords = {
    left: minMax(
      x,
      bounds.left + paddingLeft + borderLeft,
      bounds.right - paddingRight - borderRight,
    ),
    top: y,
  };

  return coords;
}

export const getOuterNodePos = (doc: Node, pos: number): number => {
  const resolvedPos = doc.resolve(pos);
  const { depth } = resolvedPos;

  if (depth === 0) {
    return pos;
  }

  const a = resolvedPos.pos - resolvedPos.parentOffset;

  return a - 1;
};

export const getOuterNode = (doc: Node, pos: number): Node | null => {
  const node = doc.nodeAt(pos);
  const resolvedPos = doc.resolve(pos);

  let { depth } = resolvedPos;
  let parent = node;

  while (depth > 0) {
    const currentNode = resolvedPos.node(depth);

    depth -= 1;

    if (depth === 0) {
      parent = currentNode;
    }
  }

  return parent;
};

export function minMax(value = 0, min = 0, max = 0): number {
  return Math.min(Math.max(value, min), max);
}

export function removeNode(node: HTMLElement) {
  node.parentNode?.removeChild(node);
}
