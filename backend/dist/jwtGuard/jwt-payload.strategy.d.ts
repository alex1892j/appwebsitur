import { ConfigService } from '@nestjs/config';
declare const JwtPayloadStrategy_base: new (...args: any) => any;
export declare class JwtPayloadStrategy extends JwtPayloadStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: any;
        username: any;
        role: any;
    }>;
}
export {};
