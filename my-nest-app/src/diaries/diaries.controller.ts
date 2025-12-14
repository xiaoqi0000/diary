import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Post()
  create(@Body() createDiaryDto: CreateDiaryDto) {
    return this.diariesService.create(createDiaryDto);
  }

  @Get()
  findAll() {
    return this.diariesService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.diariesService.search(query);
  }

  @Get('date-range')
  findByDateRange(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ) {
    return this.diariesService.findByDateRange(startDate, endDate);
  }

  @Get('mood/:mood')
  findByMood(@Param('mood') mood: string) {
    return this.diariesService.findByMood(mood);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diariesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaryDto: UpdateDiaryDto) {
    return this.diariesService.update(id, updateDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diariesService.remove(id);
  }
}
