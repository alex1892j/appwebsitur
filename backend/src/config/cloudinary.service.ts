import { Injectable, Inject } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  // MÉTODO 1: Para fotos de productos (Públicas)
  async uploadProduct(file: Express.Multer.File): Promise<any> {
    const options: UploadApiOptions = {
      folder: 'productos_barberia',
      resource_type: 'image',
      type: 'upload', // Público por defecto
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
    };
    return this.uploadToCloudinary(file, options);
  }

  // MÉTODO 2: Para comprobantes de Yape/Plin (Privados)
  async uploadPaymentCapture(file: Express.Multer.File): Promise<any> {
    const options: UploadApiOptions = {
      folder: 'capturas_pagos_seguros',
      resource_type: 'image',
      type: 'authenticated', // 🔒 NADIE puede verla sin firma
      access_mode: 'authenticated',
    };
    return this.uploadToCloudinary(file, options);
  }

  // Función genérica interna para procesar el buffer
  private uploadToCloudinary(file: Express.Multer.File, options: UploadApiOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async getSignedUrl(publicId: string): Promise<string> {
  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'authenticated',
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
  });
}
}