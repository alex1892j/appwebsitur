"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../../user/entities/user.entity");
const appointment_entity_1 = require("../../appointment/entities/appointment.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
dotenv.config({ path: './.env.development.local' });
const isDevelopment = process.env.NODE_ENV === 'development';
const config = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'dragon1',
    database: process.env.DB_NAME || 'spa_citas',
    synchronize: true,
    logging: isDevelopment,
    autoLoadEntities: true,
    entities: [user_entity_1.User, appointment_entity_1.Appointment, product_entity_1.Product, category_entity_1.Category],
    subscribers: [],
    extra: {},
};
exports.default = (0, config_1.registerAs)('typeorm', () => config);
exports.connectSource = new typeorm_1.DataSource(config);
//# sourceMappingURL=typeOrm.js.map