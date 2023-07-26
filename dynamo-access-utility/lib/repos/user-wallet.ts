import 'reflect-metadata';
import { UserWallet } from '../models'
import { DynamoStore } from "@shiftcoders/dynamo-easy";
export class UserWalletRepo {

  readonly store = new DynamoStore<UserWallet>(UserWallet);

  /**
   * Get user wallet information for given user identifier
   * @param userId 
   * @returns 
   */
  async getUserWallet(userId: String) {
    let parsedUserId = Number(userId);
    let response: any = await this.store.get(parsedUserId).exec();
    if (response) {
      response.private_data = Buffer.from(response.private_data, 'base64');
      response.data_key = Buffer.from(response.data_key, 'base64');
    }
    return response;
  }

  /**
   * Update or insert user wallet information
   * @param userWallet 
   * @returns 
   */
  upsert(userWallet: UserWallet): Promise<void> {
    return this.store.put(userWallet).exec();
  }

  /**
   * Delete wallet information for given user identifier
   * @param userId 
   */
  delete(userId: String) {
    let parsedUserId = Number(userId);
    return this.store.delete(parsedUserId).exec();
  }
}
