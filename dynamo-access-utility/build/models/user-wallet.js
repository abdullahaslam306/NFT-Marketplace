"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWallet = void 0;
var tslib_1 = require("tslib");
var dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
var UserWallet = (function () {
    function UserWallet(userId, rootKey, dataKey, privateData) {
        this.user_id = Number(userId);
        this.root_key = rootKey;
        this.data_key = dataKey.toString('base64');
        this.private_data = privateData.toString('base64');
    }
    tslib_1.__decorate([
        dynamo_easy_1.PartitionKey(),
        tslib_1.__metadata("design:type", Number)
    ], UserWallet.prototype, "user_id", void 0);
    UserWallet = tslib_1.__decorate([
        dynamo_easy_1.Model({ tableName: "user_wallets" }),
        tslib_1.__metadata("design:paramtypes", [String, String, Buffer, Buffer])
    ], UserWallet);
    return UserWallet;
}());
exports.UserWallet = UserWallet;
//# sourceMappingURL=user-wallet.js.map