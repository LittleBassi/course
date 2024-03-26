import { Injectable } from '@nestjs/common';
import { CourseActivityRepositoryService } from './course-activity.repository.service';
import { CreateCourseActivityDto } from '../dto/create-course-activity.dto';
import { UpdateCourseActivityDto } from '../dto/update-course-activity.dto';
import { CourseActivity } from '../entities/course-activity.entity';
import { CourseRepositoryService } from '@/course/services/course.repository.service';
import { UserCourseRepositoryService } from '@/user-course/services/user-course.repository.service';
import { UserService } from '@/user/services/user.service';
import { MailerService } from '@/utils/mailer/mailer.service';
import { templateNewActivity } from '@/utils/utils.constants';

@Injectable()
export class CourseActivityService {
  constructor(
    private readonly courseActivityRepositoryService: CourseActivityRepositoryService,
    private readonly courseRepositoryService: CourseRepositoryService,
    private readonly userCourseRepositoryService: UserCourseRepositoryService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  async create(createCourseActivityDto: CreateCourseActivityDto): Promise<CourseActivity> {
    const courseActivityEntity = await this.courseActivityRepositoryService.create(
      createCourseActivityDto
    );
    await this.courseActivityRepositoryService.save(courseActivityEntity);
    if (!courseActivityEntity.id) {
      return null;
    }
    // TODO - ENVIAR PARA FILA NO RABBITMQ + NOTIFICAR POR EMAIL OS ALUNOS MATRICULADOS NO CURSO
    return await this.courseActivityRepositoryService.findOne({ id: courseActivityEntity.id });
  }

  async sendActivityEmail(activity: CourseActivity): Promise<void> {
    const course = await this.courseRepositoryService.findOne({ id: activity.course_id });
    if (!course) {
      return null;
    }
    const usersCourse = await this.userCourseRepositoryService.find({
      course_id: activity.course_id,
    });
    const recipients = [];
    for (const userCourse of usersCourse) {
      const user = await this.userService.findOneInfo(userCourse.user_id);
      if (user) {
        recipients.push({
          name: user.first_name,
          address: user.email,
        });
      }
    }
    const html = templateNewActivity(activity.name, course.name);
    await this.mailerService.sendEmail({
      recipients,
      subject: 'New Activity',
      html,
    });
  }

  async update(
    id: number,
    upateCourseActivityDto: UpdateCourseActivityDto
  ): Promise<CourseActivity> {
    const courseActivityEntity = await this.courseActivityRepositoryService.create(
      upateCourseActivityDto
    );
    await this.courseActivityRepositoryService.update(id, courseActivityEntity);
    return await this.courseActivityRepositoryService.findOne({ id });
  }
}
