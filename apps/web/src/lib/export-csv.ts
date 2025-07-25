import type { Item, Tag } from '@quanta/types';

export function exportItemsCsv(items: Item[], tags: Tag[]) {
  const header = ['name', ...tags.map((tag) => tag.name)];
  const rows = items.map((item) => {
    const row = [
      item.name,
      ...tags.map((tag) => item.tags?.[tag.name]?.value ?? ''),
    ];
    return row;
  });

  const data = [header, ...rows]
    .map((row) =>
      row
        .map((field) =>
          typeof field === 'string' && field.includes(',')
            ? `"${field.replace(/"/g, '""')}"`
            : field,
        )
        .join(','),
    )
    .join('\n');

  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', `export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
