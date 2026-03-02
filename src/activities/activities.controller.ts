import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

interface RequestWithTeacher extends Request {
  user: { id: string };
}

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Request() req: RequestWithTeacher, @Body() dto: CreateActivityDto) {
    return this.activitiesService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: RequestWithTeacher) {
    return this.activitiesService.findAllByTeacher(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithTeacher, @Param('id') id: string) {
    return this.activitiesService.findById(id, req.user.id);
  }

  @Put(':id')
  update(
    @Request() req: RequestWithTeacher,
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  delete(@Request() req: RequestWithTeacher, @Param('id') id: string) {
    return this.activitiesService.delete(id, req.user.id);
  }

  @Get(':id/results')
  getResults(@Request() req: RequestWithTeacher, @Param('id') id: string) {
    return this.activitiesService.getResults(id, req.user.id);
  }
}
