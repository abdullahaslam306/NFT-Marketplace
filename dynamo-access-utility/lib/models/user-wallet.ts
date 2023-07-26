import { Model, PartitionKey } from "@shiftcoders/dynamo-easy";

@Model({ tableName: "user_wallets" })

export class UserWallet {
  @PartitionKey()
  user_id: number;
  root_key: string;
  data_key: string;
  private_data: string;

  constructor( userId: string, rootKey: string, dataKey: Buffer, privateData: Buffer ) {
    this.user_id = Number(userId);
    this.root_key = rootKey;
    this.data_key = dataKey.toString('base64');
    this.private_data = privateData.toString('base64');
  }
}
