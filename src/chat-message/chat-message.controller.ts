import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { AuthUser } from 'src/auth/user.decorator';

@Controller('chat-messages')
@UseGuards(AuthGuard('access'))
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post()
  create(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @AuthUser() user: { sub: number },
  ) {
    return this.chatMessageService.create(createChatMessageDto, user.sub);
  }

  @Get()
  findAll(@Query('chatRoomId', ParseIntPipe) chatRoomId: number) {
    return this.chatMessageService.findAll(chatRoomId);
  }
}
