import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';

@Controller('admin/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async findAll() {
    const projects = await this.projectService.findAll();
    return { success: true, data: projects };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const project = await this.projectService.findOne(id);
    return { success: true, data: project };
  }

  @Post()
  async create(@Body() projectData: Partial<Project>) {
    const project = await this.projectService.create(projectData);
    return { success: true, data: project };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() projectData: Partial<Project>) {
    const project = await this.projectService.update(id, projectData);
    return { success: true, data: project };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.projectService.remove(id);
    return { success: true };
  }
}
