import { 
  Controller, 
  Get, 
  Body, 
  Patch,
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return instanceToPlain(this.userService.findOne(user.id));
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: User) {
    return this.userService.remove(user.id);
  }
}
