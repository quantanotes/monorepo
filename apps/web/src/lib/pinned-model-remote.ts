import { db } from '@quanta/db/remote';
import { PinnedModelShared } from '@quanta/web/lib/pinned-model';

export class PinnedModelRemote extends PinnedModelShared {
  constructor(userId: string) {
    super(db, null, userId);
  }
}
