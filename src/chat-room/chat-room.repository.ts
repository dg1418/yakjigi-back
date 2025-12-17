import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatRoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number) {
    console.log(userId);
    return this.prisma.chatRoom.create({
      data: {
        userId,
      },
    });
  }

  async findAllByUserId(userId: number) {
    return this.prisma.chatRoom.findMany({
      where: { userId },
    });
  }
}
