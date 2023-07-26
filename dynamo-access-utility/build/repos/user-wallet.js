"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletRepo = void 0;
var tslib_1 = require("tslib");
require("reflect-metadata");
var models_1 = require("../models");
var dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
var UserWalletRepo = (function () {
    function UserWalletRepo() {
        this.store = new dynamo_easy_1.DynamoStore(models_1.UserWallet);
    }
    UserWalletRepo.prototype.getUserWallet = function (userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var parsedUserId, response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedUserId = Number(userId);
                        return [4, this.store.get(parsedUserId).exec()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            response.private_data = Buffer.from(response.private_data, 'base64');
                            response.data_key = Buffer.from(response.data_key, 'base64');
                        }
                        return [2, response];
                }
            });
        });
    };
    UserWalletRepo.prototype.upsert = function (userWallet) {
        return this.store.put(userWallet).exec();
    };
    UserWalletRepo.prototype.delete = function (userId) {
        var parsedUserId = Number(userId);
        return this.store.delete(parsedUserId).exec();
    };
    return UserWalletRepo;
}());
exports.UserWalletRepo = UserWalletRepo;
//# sourceMappingURL=user-wallet.js.map