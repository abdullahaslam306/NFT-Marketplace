import 'reflect-metadata';
import { UserWallet } from '../models';
import { DynamoStore } from "@shiftcoders/dynamo-easy";
export declare class UserWalletRepo {
    readonly store: DynamoStore<UserWallet>;
    getUserWallet(userId: String): Promise<any>;
    upsert(userWallet: UserWallet): Promise<void>;
    delete(userId: String): Promise<void>;
}
//# sourceMappingURL=user-wallet.d.ts.map