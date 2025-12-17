import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsInt()
  @IsNotEmpty()
  chatRoomId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}