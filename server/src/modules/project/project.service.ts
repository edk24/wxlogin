import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  // 获取所有项目
  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  // 根据ID获取项目
  async findOne(id: number): Promise<Project> {
    return this.projectRepository.findOne({ where: { id } });
  }

  // 创建项目
  async create(projectData: Partial<Project>): Promise<Project> {
    const project = this.projectRepository.create(projectData);
    return this.projectRepository.save(project);
  }

  // 更新项目
  async update(id: number, projectData: Partial<Project>): Promise<Project> {
    await this.projectRepository.update(id, projectData);
    return this.findOne(id);
  }

  // 删除项目
  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
