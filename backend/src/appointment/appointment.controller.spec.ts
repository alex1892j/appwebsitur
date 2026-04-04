import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';


describe('AppointmentController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [AppointmentsService],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
