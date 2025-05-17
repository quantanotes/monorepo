import { db } from '@quanta/db/remote';
import { PinnedModel } from '@quanta/web/lib/pinned-model';

export class PinnedModelRemote extends PinnedModel {
  constructor(userId: string) {
    super(db, null, userId);
  }
}
