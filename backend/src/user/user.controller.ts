import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  Patch,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/jwtGuard/jwt-auth.guard';
import { JwtPayloadGuard } from 'src/jwtGuard/jwt-payload.guard';
import { UserRole } from './enums/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/jwtGuard/roles.guard';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() admin: User,
  ) {
    return this.usersService.updateRole(id, dto.role, admin.id);
  }

@Get('me')
@UseGuards(JwtAuthGuard)
async getMe(@Request() req) {
  
  if (!req.user) {
    throw new UnauthorizedException('Usuario no encontrado en la petición');
  }
  return req.user;
}


  @UseGuards(JwtPayloadGuard)
  @Get('validate-token')
  async validateToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }
}
