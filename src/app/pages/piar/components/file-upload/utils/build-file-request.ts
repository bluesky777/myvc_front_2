import { HttpRequest } from "@angular/common/http";

export const buildFileRequest = (
  file: File,
  alumnoId: number,
  documentField: string,
  uploadApiUrl: string,
  yearId?: number,
) => {
  const form = new FormData();
  form.append('file', file);
  form.append('alumno_id', alumnoId.toString());
  form.append('documentField', documentField);
  if (yearId) {
    form.append('year_id', yearId.toString());
  }

  const req = new HttpRequest('POST', uploadApiUrl, form, {
    reportProgress: true,
  });
  return req;
}