import { Types } from 'mongoose';
import { IReport, ReportModel } from './report.model';
import { BadRequestError, NotFoundError } from '../../common/errors/httpErrors';
import { CreateReportInput, ListReportsQuery, ResolveReportInput } from './report.validation';

export async function createReport(reporterId: string, input: CreateReportInput): Promise<IReport> {
  if (input.reported_user_id === reporterId) throw new BadRequestError('You cannot report yourself');

  return ReportModel.create({
    reporter_id: reporterId,
    reported_user_id: input.reported_user_id,
    related_ride_id: input.related_ride_id,
    reason: input.reason,
    description: input.description,
  });
}

export async function listReports(filters: ListReportsQuery): Promise<IReport[]> {
  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;

  return ReportModel.find(query)
    .populate('reporter_id', 'full_name email')
    .populate('reported_user_id', 'full_name email')
    .sort({ created_at: -1 });
}

export async function resolveReport(reportId: string, adminId: string, input: ResolveReportInput): Promise<IReport> {
  const report = await ReportModel.findById(reportId);
  if (!report) throw new NotFoundError('Report not found');

  report.status = input.status;
  report.resolved_by = new Types.ObjectId(adminId);
  report.resolved_at = new Date();
  await report.save();
  return report;
}
