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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_role_enum_1 = require("../user/enums/user-role.enum");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentRepository, productRepository) {
        this.appointmentRepository = appointmentRepository;
        this.productRepository = productRepository;
    }
    async create(user, dto, paymentImageData) {
        const { date, time, phoneNumber, productId } = dto;
        const hour = Number(time.split(':')[0]);
        if (hour < 9 || hour > 21) {
            throw new common_1.BadRequestException('La hora debe estar entre 9:00 y 21:00');
        }
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.BadRequestException('El producto no existe');
        }
        const appointmentsCount = await this.appointmentRepository.count({
            where: {
                date: new Date(date),
                time,
                status: 'active',
            },
        });
        if (appointmentsCount >= 5) {
            throw new common_1.BadRequestException('Este horario ya alcanzó el límite de turnos');
        }
        const appointmentData = {
            date: new Date(date),
            time,
            phoneNumber,
            paymentImageUrl: paymentImageData?.url || null,
            paymentPublicId: paymentImageData?.publicId || null,
            status: 'active',
            user,
            product,
        };
        const appointment = this.appointmentRepository.create(appointmentData);
        return await this.appointmentRepository.save(appointment);
    }
    async findByUser(userId) {
        return this.appointmentRepository.find({
            where: { user: { id: userId } },
            order: { date: 'ASC' },
        });
    }
    async cancelAppointment(appointmentId, user) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id: appointmentId },
            relations: ['user'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Cita no encontrada');
        }
        if (user.role !== user_role_enum_1.UserRole.ADMIN && appointment.user.id !== user.id) {
            throw new common_1.ForbiddenException('No puedes cancelar esta cita');
        }
        appointment.status = 'cancelled';
        return this.appointmentRepository.save(appointment);
    }
    async findAll() {
        return this.appointmentRepository.find({
            relations: ['user', 'product'],
            order: { date: 'ASC' },
        });
    }
    async remove(id) {
        const appointment = await this.appointmentRepository.findOneBy({ id });
        if (!appointment) {
            throw new common_1.NotFoundException(`El turno con ID ${id} no existe`);
        }
        return await this.appointmentRepository.remove(appointment);
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AppointmentsService);
//# sourceMappingURL=appointment.service.js.map