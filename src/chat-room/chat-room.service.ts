import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

  async create(userId: number) {
    // DTO is currently empty, but we pass it for future-proofing
    return this.chatRoomRepository.create(userId);
  }

  async findAll(userId: number) {
    return this.chatRoomRepository.findAllByUserId(userId);
  }
}
