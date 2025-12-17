import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/user.decorator';

@Controller('users')
@UseGuards(AuthGuard('access'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('me')
  findMe(@AuthUser() user: { id: number }) {
    return this.userService.findOne(user.id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
}
