import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CategoryService } from './categories.service';


@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.categoryService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.categoryService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(+id);
  }
}
