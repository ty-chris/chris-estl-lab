import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import csv from 'csvtojson';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('csv'))
  async uploadFile(@UploadedFile() file) {
    console.log(file);
    try {
      const csvString = file.buffer.toString();
      const jsonArray = await csv().fromString(csvString);

      const success = await this.userService.processJsonArray(jsonArray);
      return success;
    } catch (e) {
      console.log('error: ', e);
      throw e;
    }
  }

  @Get()
  findAll(
    @Query('minSalary') minSalary: number,
    @Query('maxSalary') maxSalary: number,
    @Query('offset') offset: number,
    @Query('limit') limit = 30,
    @Query('sort') sort: string,
  ) {
    console.log('check inside');
    return this.userService.getUsersWithQueries(
      minSalary,
      maxSalary,
      offset,
      limit,
      sort,
    );
  }
}
