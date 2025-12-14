import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { DatabaseService, DiaryEntry } from '../database/database.service';

@Injectable()
export class DiariesService {
  constructor(private databaseService: DatabaseService) {}

  async create(createDiaryDto: CreateDiaryDto): Promise<DiaryEntry> {
    return await this.databaseService.create({
      title: createDiaryDto.title,
      content: createDiaryDto.content,
      date: createDiaryDto.date || new Date().toISOString().split('T')[0],
      mood: createDiaryDto.mood || 'neutral',
      tags: createDiaryDto.tags || [],
      isPrivate: createDiaryDto.isPrivate || false,
    });
  }

  async findAll(): Promise<DiaryEntry[]> {
    return await this.databaseService.findAll();
  }

  async findOne(id: string): Promise<DiaryEntry> {
    const diary = await this.databaseService.findById(id);
    if (!diary) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }
    return diary;
  }

  async update(id: string, updateDiaryDto: UpdateDiaryDto): Promise<DiaryEntry> {
    const diary = await this.databaseService.update(id, updateDiaryDto);
    if (!diary) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }
    return diary;
  }

  async remove(id: string): Promise<void> {
    const success = await this.databaseService.delete(id);
    if (!success) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }
  }

  async search(query: string): Promise<DiaryEntry[]> {
    return await this.databaseService.search(query);
  }

  async findByDateRange(startDate: string, endDate: string): Promise<DiaryEntry[]> {
    return await this.databaseService.findByDateRange(startDate, endDate);
  }

  async findByMood(mood: string): Promise<DiaryEntry[]> {
    return await this.databaseService.findByMood(mood);
  }
}
