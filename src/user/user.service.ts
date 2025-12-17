import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { Prisma } from 'src/generated/prisma_client/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findOne(id: number) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException('해당 id의 유저가 없습니다.');
    }

    return user;
  }

  create(createUserDto: CreateUserDto) {
    const data = this.DtoToModel(createUserDto) as Prisma.UserCreateInput;
    return this.userRepository.create(data);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const data = this.DtoToModel(updateUserDto) as Prisma.UserUpdateInput;
    return this.userRepository.update(id, data);
  }

  DtoToModel(
    dto: CreateUserDto | UpdateUserDto,
  ): Prisma.UserCreateInput | Prisma.UserUpdateInput {
    const model: Prisma.UserCreateInput | Prisma.UserUpdateInput = {};

    if (dto.providerId) {
      model.providerId = dto.providerId;
    }
    if (dto.providerIdEmail) {
      model.providerIdEmail = dto.providerIdEmail;
    }
    if (dto.name) {
      model.name = dto.name;
    }
    if (dto.profileImageUrl) {
      model.profileImageUrl = dto.profileImageUrl;
    }

    return model;
  }
}
