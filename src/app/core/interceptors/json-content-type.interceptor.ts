import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const jsonContentTypeInterceptor: HttpInterceptorFn = (req, next) => {
  let clonedRequest: HttpRequest<any>;

  if (req.body instanceof FormData) {
    clonedRequest = req.clone();
  } else {
    clonedRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }
  return next(clonedRequest);
};
