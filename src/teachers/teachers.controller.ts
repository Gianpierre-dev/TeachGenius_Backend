import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeachersService } from './teachers.service';

interface RequestWithTeacher extends Request {
  user: { id: string };
}

@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get('me')
  getMe(@Request() req: RequestWithTeacher) {
    return this.teachersService.findById(req.user.id);
  }
}
