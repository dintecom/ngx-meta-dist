import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { MetaService } from './meta.service';
import * as i0 from "@angular/core";
export declare class MetaGuard implements CanActivate, CanActivateChild {
    private readonly meta;
    constructor(meta: MetaService);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MetaGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MetaGuard>;
}
