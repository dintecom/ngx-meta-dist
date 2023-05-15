import { Observable } from 'rxjs';
export declare const isPromise: (obj: any) => obj is Promise<any>;
export declare const isObservable: (obj: any | Observable<any>) => obj is Observable<any>;
