import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { Checkbox } from '@quanta/ui/checkbox';
import type { ReactNodeViewProps } from '@tiptap/react';

export function TaskItemView(props: ReactNodeViewProps<HTMLLIElement>) {
  const { checked } = props.node.attrs;
  const { editor } = props;

  const handleCheckedChange = (newChecked: boolean) => {
    // If editor is not editable and no readonly handler, prevent change
    if (!editor.isEditable && !props.extension.options.onReadOnlyChecked) {
      return;
    }

    if (editor.isEditable) {
      props.updateAttributes({ checked: newChecked });
    } else if (props.extension.options.onReadOnlyChecked) {
      // Call the readonly handler and only update if it returns true
      if (props.extension.options.onReadOnlyChecked(props.node, newChecked)) {
        props.updateAttributes({ checked: newChecked });
      }
    }
  };

  const getAriaLabel = () => {
    if (props.extension.options.a11y?.checkboxLabel) {
      return props.extension.options.a11y.checkboxLabel(props.node, checked);
    }
    return `Task item checkbox for ${props.node.textContent || 'empty task item'}`;
  };

  return (
    <NodeViewWrapper
      as="li"
      className="not-prose my-[7px] flex items-center gap-2"
      data-checked={checked}
      data-type="taskItem"
    >
      <Checkbox
        className="mt-[0.25em]"
        checked={checked}
        onCheckedChange={handleCheckedChange}
        aria-label={getAriaLabel()}
        onMouseDown={(e) => e.preventDefault()}
      />

      <NodeViewContent className="prose m-0! h-fit max-w-none" />
    </NodeViewWrapper>
  );
}
