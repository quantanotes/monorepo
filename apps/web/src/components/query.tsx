import { Item } from '@quanta/types';
import { Grid } from '@quanta/web/components/grid';
import { Table } from '@quanta/web/components/table';

interface QueryProps {
  items: Item[];
  tags: string[];
  view: string;
}

export function Query({ items, tags = [], view }: QueryProps) {
  switch (view) {
    case 'grid':
      return <Grid items={items} />;
    case 'table':
      return <Table items={items} tags={tags} />;
  }
}
