export declare class CloudinaryService {
    private cloudinary;
    constructor(cloudinary: any);
    uploadProduct(file: Express.Multer.File): Promise<any>;
    uploadPaymentCapture(file: Express.Multer.File): Promise<any>;
    private uploadToCloudinary;
    getSignedUrl(publicId: string): Promise<string>;
}
