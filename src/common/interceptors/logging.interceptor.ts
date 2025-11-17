import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';


@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    private  readonly logger =  new Logger(LoggingInterceptor.name);
     
    //context -- contains request and response object 
    // control -- route handler executes

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        const request = context.switchToHttp().getRequest();
        const {method,url,body,query,params} =  request;
       
        const startTime =  Date.now();
        return next.handle().pipe(
            tap({
                next:(data)=>{
                    const endTime =  Date.now();
                    const duration = endTime - startTime;

                    this.logger.log(`
                        [${method} ${url}] - ${duration}ms`)
                },
                error: (error)=>{
                    const endTime = Date.now();
                     const duration = endTime - startTime;

                    this.logger.log(`
                        [${method} ${url}] - ${duration}ms - {error.message}`);
                }
            })
        )
        
    }
}