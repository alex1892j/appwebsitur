"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
const appointment_service_1 = require("./appointment.service");
const cloudinary_service_1 = require("../config/cloudinary.service");
const jwt_auth_guard_1 = require("../jwtGuard/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
const common_3 = require("@nestjs/common");
const roles_guard_1 = require("../jwtGuard/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../user/enums/user-role.enum");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService, cloudinaryService) {
        this.appointmentsService = appointmentsService;
        this.cloudinaryService = cloudinaryService;
    }
    async create(user, dto, file) {
        let paymentImageData = { url: null, publicId: null };
        if (file && (dto.paymentMethod === 'yape' || dto.paymentMethod === 'plin')) {
            const uploadResult = await this.cloudinaryService.uploadPaymentCapture(file);
            paymentImageData.url = uploadResult.secure_url;
            paymentImageData.publicId = uploadResult.public_id;
        }
        return this.appointmentsService.create(user, dto, paymentImageData);
    }
    findMyAppointments(user) {
        return this.appointmentsService.findByUser(user.id);
    }
    findAllAppointments() {
        return this.appointmentsService.findAll();
    }
    cancel(id, user) {
        return this.appointmentsService.cancelAppointment(id, user);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_appointment_dto_1.CreateAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-appointments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findMyAppointments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAllAppointments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_3.Patch)(':id/cancel'),
    __param(0, (0, common_3.Param)('id', common_3.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "cancel", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentsService,
        cloudinary_service_1.CloudinaryService])
], AppointmentsController);
//# sourceMappingURL=appointment.controller.js.map