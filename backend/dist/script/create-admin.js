"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../user/entities/user.entity");
const user_role_enum_1 = require("../user/enums/user-role.enum");
const typeOrm_1 = require("../config/typeOrm/typeOrm");
async function createAdmin() {
    await typeOrm_1.connectSource.initialize();
    const userRepo = typeOrm_1.connectSource.getRepository(user_entity_1.User);
    const ADMIN_USERNAME = 'admin';
    const ADMIN_EMAIL = 'admin@admin.com';
    const ADMIN_PASSWORD = 'Admin123*';
    let admin = await userRepo.findOne({
        where: [
            { username: ADMIN_USERNAME },
            { email: ADMIN_EMAIL },
        ],
    });
    if (admin) {
        if (admin.role === user_role_enum_1.UserRole.ADMIN) {
            console.log('✅ El usuario ya es ADMIN');
        }
        else {
            admin.role = user_role_enum_1.UserRole.ADMIN;
            await userRepo.save(admin);
            console.log('✅ Usuario promovido a ADMIN');
        }
    }
    else {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        admin = userRepo.create({
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            age: 30,
            role: user_role_enum_1.UserRole.ADMIN,
        });
        await userRepo.save(admin);
        console.log('✅ Admin creado correctamente');
    }
    await typeOrm_1.connectSource.destroy();
}
createAdmin()
    .then(() => {
    console.log('🎉 Script finalizado');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Error creando admin:', error);
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map