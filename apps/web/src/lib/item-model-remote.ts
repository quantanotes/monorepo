import { db } from '@quanta/db/remote';
import { ItemModelShared } from '@quanta/web/lib/item-model';

export class ItemModelRemote extends ItemModelShared {
  constructor(userId: string) {
    super(db, null, userId);
  }
}
