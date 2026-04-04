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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const streamifier = require("streamifier");
let CloudinaryService = class CloudinaryService {
    constructor(cloudinary) {
        this.cloudinary = cloudinary;
    }
    async uploadProduct(file) {
        const options = {
            folder: 'productos_barberia',
            resource_type: 'image',
            type: 'upload',
            transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
        };
        return this.uploadToCloudinary(file, options);
    }
    async uploadPaymentCapture(file) {
        const options = {
            folder: 'capturas_pagos_seguros',
            resource_type: 'image',
            type: 'authenticated',
            access_mode: 'authenticated',
        };
        return this.uploadToCloudinary(file, options);
    }
    uploadToCloudinary(file, options) {
        return new Promise((resolve, reject) => {
            const upload = this.cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(upload);
        });
    }
    async getSignedUrl(publicId) {
        return cloudinary_1.v2.url(publicId, {
            sign_url: true,
            type: 'authenticated',
            secure: true,
            expires_at: Math.floor(Date.now() / 1000) + 3600
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CLOUDINARY')),
    __metadata("design:paramtypes", [Object])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map