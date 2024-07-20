import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../module/prisma/prisma.module';
import { PrismaUserRepository } from '../repository/prisma-user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
