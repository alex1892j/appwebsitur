"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuthDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const login_user_dto_1 = require("./login.user.dto");
class UpdateAuthDto extends (0, mapped_types_1.PartialType)(login_user_dto_1.LoginUserDto) {
}
exports.UpdateAuthDto = UpdateAuthDto;
//# sourceMappingURL=update-auth.dto.js.map