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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("../products/entities/product.entity");
let CategoryService = class CategoryService {
    constructor(categoryRepo, productRepo) {
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }
    async findAll() {
        return this.categoryRepo.find({
            where: { isActive: true },
            relations: ['products'],
            order: { name: 'ASC' },
        });
    }
    async findById(id) {
        const category = await this.categoryRepo.findOne({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        return category;
    }
    async create(data) {
        if (!data.name) {
            throw new common_1.BadRequestException('El nombre de la categoría es obligatorio');
        }
        const existing = await this.categoryRepo.findOne({ where: { name: data.name } });
        if (existing) {
            throw new common_1.ConflictException('Ya existe una categoría con ese nombre');
        }
        const category = this.categoryRepo.create(data);
        return this.categoryRepo.save(category);
    }
    async update(id, data) {
        const category = await this.findById(id);
        Object.assign(category, data);
        return this.categoryRepo.save(category);
    }
    async remove(id) {
        const category = await this.categoryRepo.findOne({
            where: { id },
            relations: ['products'],
        });
        if (!category) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        if (category.products.length > 0) {
            throw new common_1.BadRequestException('No se puede eliminar la categoría porque tiene productos asociados');
        }
        await this.categoryRepo.remove(category);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoryService);
//# sourceMappingURL=categories.service.js.map