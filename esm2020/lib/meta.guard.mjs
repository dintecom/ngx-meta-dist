import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./meta.service";
export class MetaGuard {
    constructor(meta) {
        this.meta = meta;
    }
    canActivate(route, state) {
        const url = state.url;
        const metaSettings = route.hasOwnProperty('data') ? route.data['meta'] : undefined;
        this.meta.update(url, metaSettings);
        return true;
    }
    canActivateChild(route, state) {
        return this.canActivate(route, state);
    }
}
MetaGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MetaGuard, deps: [{ token: i1.MetaService }], target: i0.ɵɵFactoryTarget.Injectable });
MetaGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MetaGuard });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.5", ngImport: i0, type: MetaGuard, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MetaService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1tZXRhL2NvcmUvc3JjL2xpYi9tZXRhLmd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUszQyxNQUFNLE9BQU8sU0FBUztJQUNwQixZQUE2QixJQUFpQjtRQUFqQixTQUFJLEdBQUosSUFBSSxDQUFhO0lBQUcsQ0FBQztJQUVsRCxXQUFXLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUNuRSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBRXRCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUVuRixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFcEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUN4RSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7O3NHQWZVLFNBQVM7MEdBQVQsU0FBUzsyRkFBVCxTQUFTO2tCQURyQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGUsIENhbkFjdGl2YXRlQ2hpbGQsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTWV0YVNlcnZpY2UgfSBmcm9tICcuL21ldGEuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZXRhR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWV0YTogTWV0YVNlcnZpY2UpIHt9XG5cbiAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG4gICAgY29uc3QgdXJsID0gc3RhdGUudXJsO1xuXG4gICAgY29uc3QgbWV0YVNldHRpbmdzID0gcm91dGUuaGFzT3duUHJvcGVydHkoJ2RhdGEnKSA/IHJvdXRlLmRhdGFbJ21ldGEnXSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMubWV0YS51cGRhdGUodXJsLCBtZXRhU2V0dGluZ3MpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjYW5BY3RpdmF0ZUNoaWxkKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNhbkFjdGl2YXRlKHJvdXRlLCBzdGF0ZSk7XG4gIH1cbn1cbiJdfQ==