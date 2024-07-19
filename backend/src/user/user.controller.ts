import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // BadRequestException,
  Query,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from './zod-validation.pipe';
import { createUserSchema, updateUserSchema } from './validation.schema';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AdminAuth } from '../auth/admin-auth.decorator';
import { AdminGuard } from '../auth/admin.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
@UseGuards(ThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Post()
  @AdminAuth()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, no valid token.' })
  @ApiResponse({ status: 403, description: 'Forbidden, not admin.' })
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 401, description: 'Unauthorized, no valid token.' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('filter') filter: string = '',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.userService.findAll(pageNumber, limitNumber, filter);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @AdminAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, no valid token.' })
  @ApiResponse({ status: 403, description: 'Forbidden, not admin.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @AdminAuth()
  @ApiOperation({ summary: 'Remove user' })
  @ApiResponse({ status: 200, description: 'User removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized, no valid token.' })
  @ApiResponse({ status: 403, description: 'Forbidden, not admin.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
