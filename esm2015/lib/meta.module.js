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
        useFactory: metaFactory
    }) {
        return {
            ngModule: MetaModule,
            providers: [configuredProvider, MetaGuard, MetaService]
        };
    }
}
MetaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaModule, deps: [{ token: MetaModule, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule });
MetaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaModule });
MetaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaModule, decorators: [{
            type: NgModule
        }], ctorParameters: function () { return [{ type: MetaModule, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtbWV0YS9jb3JlL3NyYy9saWIvbWV0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVsRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUU3QyxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBR3hELE1BQU0sT0FBTyxVQUFVO0lBYXJCLFlBQW9DLFlBQXlCO1FBQzNELElBQUksWUFBWSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztTQUMzRTtJQUNILENBQUM7SUFoQkQsTUFBTSxDQUFDLE9BQU8sQ0FDWixxQkFBMEI7UUFDeEIsT0FBTyxFQUFFLFVBQVU7UUFDbkIsVUFBVSxFQUFFLFdBQVc7S0FDeEI7UUFFRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQztTQUN4RCxDQUFDO0lBQ0osQ0FBQzs7dUdBWFUsVUFBVSxrQkFhOEIsVUFBVTt3R0FibEQsVUFBVTt3R0FBVixVQUFVOzJGQUFWLFVBQVU7a0JBRHRCLFFBQVE7MERBYzRDLFVBQVU7MEJBQWhELFFBQVE7OzBCQUFJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgT3B0aW9uYWwsIFNraXBTZWxmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE1ldGFHdWFyZCB9IGZyb20gJy4vbWV0YS5ndWFyZCc7XG5pbXBvcnQgeyBNZXRhTG9hZGVyLCBNZXRhU3RhdGljTG9hZGVyIH0gZnJvbSAnLi9tZXRhLmxvYWRlcic7XG5pbXBvcnQgeyBNZXRhU2VydmljZSB9IGZyb20gJy4vbWV0YS5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IG1ldGFGYWN0b3J5ID0gKCkgPT4gbmV3IE1ldGFTdGF0aWNMb2FkZXIoKTtcblxuQE5nTW9kdWxlKClcbmV4cG9ydCBjbGFzcyBNZXRhTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoXG4gICAgY29uZmlndXJlZFByb3ZpZGVyOiBhbnkgPSB7XG4gICAgICBwcm92aWRlOiBNZXRhTG9hZGVyLFxuICAgICAgdXNlRmFjdG9yeTogbWV0YUZhY3RvcnlcbiAgICB9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8TWV0YU1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTWV0YU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW2NvbmZpZ3VyZWRQcm92aWRlciwgTWV0YUd1YXJkLCBNZXRhU2VydmljZV1cbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcGFyZW50TW9kdWxlPzogTWV0YU1vZHVsZSkge1xuICAgIGlmIChwYXJlbnRNb2R1bGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWV0YU1vZHVsZSBhbHJlYWR5IGxvYWRlZDsgaW1wb3J0IGluIHJvb3QgbW9kdWxlIG9ubHkuJyk7XG4gICAgfVxuICB9XG59XG4iXX0=