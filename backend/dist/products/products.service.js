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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const categories_service_1 = require("../categories/categories.service");
let ProductService = class ProductService {
    constructor(productRepository, categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }
    async findAll(categoryId) {
        if (categoryId) {
            return this.productRepository.find({
                where: { category: { id: categoryId } },
            });
        }
        return this.productRepository.find();
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return product;
    }
    async create(dto) {
        const category = await this.categoryService.findById(dto.categoryId);
        if (!category) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        const product = this.productRepository.create({
            nombre: dto.nombre,
            precio: dto.precio,
            description: dto.description,
            imageUrl: dto.imageUrl,
            category,
        });
        return this.productRepository.save(product);
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        if (dto.categoryId) {
            const category = await this.categoryService.findById(dto.categoryId);
            if (!category) {
                throw new common_1.NotFoundException('Categoría no encontrada');
            }
            product.category = category;
        }
        Object.assign(product, dto);
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoryService])
], ProductService);
//# sourceMappingURL=products.service.js.map