import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards';
import { UpdateAvatarDto, UpdateUserDto } from './dto/UpdateUser.dto';
import { GetUser } from '../auth/decorator/GetUser.decorator';
import { Users } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({
    status: 200,
    description: 'Current user retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @Get('current-user')
  getCurrentUser(@GetUser() user: Users) {
    return user;
  }

  @ApiOkResponse({
    status: 200,
    description: 'User details updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @Patch('update-details')
  async editUser(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.editUser(userId, updateUserDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Avatar updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @Patch('change-avatar')
  async updateAvatar(
    @GetUser() user: Users,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ) {
    return this.usersService.updateAvatar(user, updateAvatarDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT bearer access token',
    status: 401,
  })
  @UseGuards(JwtGuard)
  @Delete('delete')
  async deleteUser(@GetUser('id', ParseIntPipe) userId: number) {
    return this.usersService.deleteUser(userId);
  }
}
