import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { MetaRouteSettings } from './models/meta-route-settings';
export declare function metaGuard(settings?: MetaRouteSettings): CanActivateFn | CanActivateChildFn;
