import * as bcrypt from 'bcryptjs';

import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enums/user-role.enum';
import { connectSource } from 'src/config/typeOrm/typeOrm';

async function createAdmin() {
  await connectSource.initialize();

  const userRepo = connectSource.getRepository(User);

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
    if (admin.role === UserRole.ADMIN) {
      console.log('✅ El usuario ya es ADMIN');
    } else {
      admin.role = UserRole.ADMIN;
      await userRepo.save(admin);
      console.log('✅ Usuario promovido a ADMIN');
    }
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    admin = userRepo.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      age: 30,
      role: UserRole.ADMIN,
    });

    await userRepo.save(admin);
    console.log('✅ Admin creado correctamente');
  }

  await connectSource.destroy();
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