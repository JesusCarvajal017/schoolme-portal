import { HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthMainService } from "./auth-main.service";

export const authInterceptor : HttpInterceptorFn = (req: HttpRequest<any>, next : HttpHandlerFn) => {
    const serviceSecurity = inject(AuthMainService);
    const token = serviceSecurity.obtenerToken();

    if(token){
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }

  return next(req);

}