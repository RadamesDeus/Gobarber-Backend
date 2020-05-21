import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import moment from 'moment';

import IAppointmentsRepository from '@modules/appointments/repositores/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositores/INotificationsRepository';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointments';

interface IParmsRequest {
  provider_UserId: string;
  user_id: string;
  parsedDate: Date;
}
@injectable()
class CreateAppointmentsServices {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    parsedDate,
    user_id,
    provider_UserId,
  }: IParmsRequest): Promise<Appointment> {
    const startOfHourAgendamento = startOfHour(parsedDate);

    const dateAgendamento = moment(startOfHourAgendamento);
    const dateCurrent = moment(moment.now());
    const availableStartTime = moment(dateAgendamento)
      .hour(8)
      .minute(0)
      .second(0);
    const availableEndTime = moment(dateAgendamento)
      .hour(17)
      .minute(0)
      .second(0);

    if (
      dateAgendamento < availableStartTime ||
      dateAgendamento > availableEndTime
    )
      throw new AppError(
        'Não é permetido agendar antes das 18 ou depois da 17horas',
        401,
      );

    if (user_id === provider_UserId)
      throw new AppError('Não é permetido agendar para você mesmo!', 401);

    if (dateAgendamento.isBefore(dateCurrent))
      throw new AppError('Não é permetido agendar no passado!', 401);

    const existAgendamento = await this.appointmentsRepository.findbyDate(
      startOfHourAgendamento,
    );

    if (existAgendamento) throw new AppError('A agenda esta bloqueada', 401);

    const appointment = await this.appointmentsRepository.create({
      date: startOfHourAgendamento,
      user_id,
      provider_UserId,
    });

    const dateFormat = dateAgendamento.format(
      'dddd, YY [de] MMMM [de] YYYY [às] HH:mm',
    );

    this.notificationsRepository.create({
      recipient_id: provider_UserId,
      content: `Novo agendamento para ${dateFormat}`,
    });
    return appointment;
  }
}

export default CreateAppointmentsServices;
