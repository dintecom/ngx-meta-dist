import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./meta.service";
export class MetaGuard {
    constructor(meta) {
        this.meta = meta;
    }
    canActivate(route, state) {
        const url = state.url;
        const metaSettings = route.hasOwnProperty('data') ? route.data.meta : undefined;
        this.meta.update(url, metaSettings);
        return true;
    }
    canActivateChild(route, state) {
        return this.canActivate(route, state);
    }
}
MetaGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaGuard, deps: [{ token: i1.MetaService }], target: i0.ɵɵFactoryTarget.Injectable });
MetaGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaGuard });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaGuard, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MetaService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1tZXRhL2NvcmUvc3JjL2xpYi9tZXRhLmd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQU0zQyxNQUFNLE9BQU8sU0FBUztJQUNwQixZQUE2QixJQUFpQjtRQUFqQixTQUFJLEdBQUosSUFBSSxDQUFhO0lBQUksQ0FBQztJQUVuRCxXQUFXLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUNuRSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBRXRCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFaEYsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRXBDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQTZCLEVBQUUsS0FBMEI7UUFDeEUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDOztzR0FmVSxTQUFTOzBHQUFULFNBQVM7MkZBQVQsU0FBUztrQkFEckIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlLCBDYW5BY3RpdmF0ZUNoaWxkLCBSb3V0ZXJTdGF0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgTWV0YVNlcnZpY2UgfSBmcm9tICcuL21ldGEuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZXRhR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWV0YTogTWV0YVNlcnZpY2UpIHsgfVxuXG4gIGNhbkFjdGl2YXRlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHVybCA9IHN0YXRlLnVybDtcblxuICAgIGNvbnN0IG1ldGFTZXR0aW5ncyA9IHJvdXRlLmhhc093blByb3BlcnR5KCdkYXRhJykgPyByb3V0ZS5kYXRhLm1ldGEgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLm1ldGEudXBkYXRlKHVybCwgbWV0YVNldHRpbmdzKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2FuQWN0aXZhdGVDaGlsZChyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jYW5BY3RpdmF0ZShyb3V0ZSwgc3RhdGUpO1xuICB9XG59XG4iXX0=