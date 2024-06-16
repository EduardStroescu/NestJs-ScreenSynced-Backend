import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAvatarDto, UpdateUserDto } from './dto/UpdateUser.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async editUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.users.update({
        where: { id: userId },
        data: updateUserDto,
      });
      if (!user) throw new NotFoundException('User not found');
      delete user.password;

      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updateAvatar(user: Users, updateAvatarDto: UpdateAvatarDto) {
    try {
      if (!user) throw new NotFoundException('User not found');

      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0]; // Extract public_id from URL
        await this.cloudinaryService.removeFile(publicId);
      }

      const newAvatar = await this.cloudinaryService.uploadFile(
        updateAvatarDto.avatar,
        user.userName,
      );
      const avatarUrl: string = newAvatar.url;

      const updatedUser = await this.prisma.users.update({
        where: { id: user.id },
        data: {
          avatar: avatarUrl,
        },
      });
      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async deleteUser(userId: number) {
    try {
      const deletedUser = await this.prisma.users.delete({
        where: {
          id: userId,
        },
      });

      if (!deletedUser) throw new NotFoundException('User not found');

      return deletedUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
