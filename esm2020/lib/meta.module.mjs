import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MetaGuard } from './meta.guard';
import { MetaLoader, MetaStaticLoader } from './meta.loader';
import { MetaService } from './meta.service';
import * as i0 from "@angular/core";
export const metaFactory = () => new MetaStaticLoader();
export class MetaModule {
    constructor(parentModule) {
        if (parentModule) {
            throw new Error('MetaModule already loaded; import in root module only.');
        }
    }
    static forRoot(configuredProvider = {
        provide: MetaLoader,
        useFactory: metaFactory,
    }) {
        return {
            ngModule: MetaModule,
            providers: [configuredProvider, MetaGuard, MetaService],
        };
    }
}
MetaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.3", ngImport: i0, type: MetaModule, deps: [{ token: MetaModule, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule });
MetaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.3", ngImport: i0, type: MetaModule });
MetaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.3", ngImport: i0, type: MetaModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.3", ngImport: i0, type: MetaModule, decorators: [{
            type: NgModule
        }], ctorParameters: function () { return [{ type: MetaModule, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtbWV0YS9jb3JlL3NyYy9saWIvbWV0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUU3QyxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBR3hELE1BQU0sT0FBTyxVQUFVO0lBYXJCLFlBQW9DLFlBQXlCO1FBQzNELElBQUksWUFBWSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztTQUMzRTtJQUNILENBQUM7SUFoQkQsTUFBTSxDQUFDLE9BQU8sQ0FDWixxQkFBMEI7UUFDeEIsT0FBTyxFQUFFLFVBQVU7UUFDbkIsVUFBVSxFQUFFLFdBQVc7S0FDeEI7UUFFRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQztTQUN4RCxDQUFDO0lBQ0osQ0FBQzs7dUdBWFUsVUFBVSxrQkFhOEIsVUFBVTt3R0FibEQsVUFBVTt3R0FBVixVQUFVOzJGQUFWLFVBQVU7a0JBRHRCLFFBQVE7MERBYzRDLFVBQVU7MEJBQWhELFFBQVE7OzBCQUFJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgT3B0aW9uYWwsIFNraXBTZWxmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNZXRhR3VhcmQgfSBmcm9tICcuL21ldGEuZ3VhcmQnO1xuaW1wb3J0IHsgTWV0YUxvYWRlciwgTWV0YVN0YXRpY0xvYWRlciB9IGZyb20gJy4vbWV0YS5sb2FkZXInO1xuaW1wb3J0IHsgTWV0YVNlcnZpY2UgfSBmcm9tICcuL21ldGEuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBtZXRhRmFjdG9yeSA9ICgpID0+IG5ldyBNZXRhU3RhdGljTG9hZGVyKCk7XG5cbkBOZ01vZHVsZSgpXG5leHBvcnQgY2xhc3MgTWV0YU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KFxuICAgIGNvbmZpZ3VyZWRQcm92aWRlcjogYW55ID0ge1xuICAgICAgcHJvdmlkZTogTWV0YUxvYWRlcixcbiAgICAgIHVzZUZhY3Rvcnk6IG1ldGFGYWN0b3J5LFxuICAgIH0sXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8TWV0YU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTWV0YU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW2NvbmZpZ3VyZWRQcm92aWRlciwgTWV0YUd1YXJkLCBNZXRhU2VydmljZV0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudE1vZHVsZT86IE1ldGFNb2R1bGUpIHtcbiAgICBpZiAocGFyZW50TW9kdWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGFNb2R1bGUgYWxyZWFkeSBsb2FkZWQ7IGltcG9ydCBpbiByb290IG1vZHVsZSBvbmx5LicpO1xuICAgIH1cbiAgfVxufVxuIl19