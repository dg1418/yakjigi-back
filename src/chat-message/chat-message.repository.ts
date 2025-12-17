import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma_client/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ChatMessageUncheckedCreateInput) {
    return this.prisma.chatMessage.create({ data });
  }

  async findAllByChatRoomId(chatRoomId: number) {
    return this.prisma.chatMessage.findMany({
      where: { chatRoomId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
