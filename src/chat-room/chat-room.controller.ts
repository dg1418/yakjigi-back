import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { AuthUser } from 'src/auth/user.decorator';

@Controller('chat-rooms')
@UseGuards(AuthGuard('access'))
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  create(@AuthUser() user: { sub: number }) {
    console.log(user);
    return this.chatRoomService.create(user.sub);
  }

  @Get()
  findAll(@AuthUser() user: { sub: number }) {
    return this.chatRoomService.findAll(user.sub);
  }
}
