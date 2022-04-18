import { Injectable } from '@angular/core';
import { from as observableFrom, of as observableOf } from 'rxjs';
import { PageTitlePositioning } from './models/page-title-positioning';
import { isObservable, isPromise } from './util';
import * as i0 from "@angular/core";
import * as i1 from "./meta.loader";
import * as i2 from "@angular/platform-browser";
export class MetaService {
    constructor(loader, title, meta) {
        this.loader = loader;
        this.title = title;
        this.meta = meta;
        this.settings = loader.settings;
        this.isMetaTagSet = {};
    }
    setTitle(title, override = false) {
        const title$ = title ? this.callback(title) : observableOf('');
        title$.subscribe(res => {
            let fullTitle = '';
            if (!res) {
                const defaultTitle$ = this.settings.defaults?.title ? this.callback(this.settings.defaults.title) : observableOf('');
                defaultTitle$.subscribe(defaultTitle => {
                    if (!override && this.settings.pageTitleSeparator && this.settings.applicationName) {
                        this.callback(this.settings.applicationName).subscribe(applicationName => {
                            fullTitle = applicationName ? this.getTitleWithPositioning(defaultTitle, applicationName) : defaultTitle;
                            this.updateTitle(fullTitle);
                        });
                    }
                    else {
                        this.updateTitle(defaultTitle);
                    }
                });
            }
            else if (!override && this.settings.pageTitleSeparator && this.settings.applicationName) {
                this.callback(this.settings.applicationName).subscribe(applicationName => {
                    fullTitle = applicationName ? this.getTitleWithPositioning(res, applicationName) : res;
                    this.updateTitle(fullTitle);
                });
            }
            else {
                this.updateTitle(res);
            }
        });
    }
    setTag(key, value) {
        if (key === 'title') {
            throw new Error(`Attempt to set ${key} through "setTag": "title" is a reserved tag name. ` + 'Please use `MetaService.setTitle` instead.');
        }
        const cur = value || this.settings.defaults?.[key] || '';
        const value$ = key !== 'og:locale' && key !== 'og:locale:alternate' ? this.callback(cur) : observableOf(cur);
        value$.subscribe(res => {
            this.updateTag(key, res);
        });
    }
    update(currentUrl, metaSettings) {
        if (!metaSettings) {
            const fallbackTitle = this.settings.defaults?.title || this.settings.applicationName || '';
            this.setTitle(fallbackTitle, true);
        }
        else {
            if (metaSettings.disabled) {
                this.update(currentUrl);
                return;
            }
            this.setTitle(metaSettings.title, metaSettings.override);
            Object.keys(metaSettings).forEach(key => {
                let value = metaSettings[key];
                if (key === 'title' || key === 'override') {
                    return;
                }
                else if (key === 'og:locale') {
                    value = value.replace(/-/g, '_');
                }
                else if (key === 'og:locale:alternate') {
                    const currentLocale = metaSettings['og:locale'];
                    this.updateLocales(currentLocale, metaSettings[key]);
                    return;
                }
                this.setTag(key, value);
            });
        }
        if (this.settings.defaults) {
            Object.entries(this.settings.defaults).forEach(([key, value]) => {
                if ((metaSettings && (key in this.isMetaTagSet || key in metaSettings)) || key === 'title' || key === 'override' || !value) {
                    return;
                }
                else if (key === 'og:locale') {
                    value = value.replace(/-/g, '_');
                }
                else if (key === 'og:locale:alternate') {
                    const currentLocale = metaSettings ? metaSettings['og:locale'] : undefined;
                    this.updateLocales(currentLocale, value);
                    return;
                }
                this.setTag(key, value);
            });
        }
        const baseUrl = this.settings.applicationUrl || '/';
        const url = `${baseUrl}${currentUrl}`.replace(/(https?:\/\/)|(\/)+/g, '$1$2').replace(/\/$/g, '');
        this.setTag('og:url', url || '/');
    }
    removeTag(key) {
        this.meta.removeTag(key);
    }
    callback(value) {
        if (this.settings.callback) {
            const value$ = this.settings.callback(value);
            if (!isObservable(value$)) {
                return isPromise(value$) ? observableFrom(value$) : observableOf(value$);
            }
            return value$;
        }
        return observableOf(value);
    }
    getTitleWithPositioning(title, applicationName) {
        switch (this.settings.pageTitlePositioning) {
            case PageTitlePositioning.AppendPageTitle:
                return applicationName + String(this.settings.pageTitleSeparator) + title;
            case PageTitlePositioning.PrependPageTitle:
                return title + String(this.settings.pageTitleSeparator) + applicationName;
            default:
                return title;
        }
    }
    updateTitle(title) {
        this.title.setTitle(title);
        this.meta.updateTag({
            property: 'og:title',
            content: title,
        });
    }
    updateLocales(currentLocale, availableLocales) {
        const cur = currentLocale || this.settings.defaults?.['og:locale'] || '';
        if (cur && this.settings.defaults) {
            this.settings.defaults['og:locale'] = cur.replace(/_/g, '-');
        }
        // TODO: set HTML lang attribute - https://github.com/ngx-meta/core/issues/32
        // const html = this.document.querySelector('html');
        // html.setAttribute('lang', cur);
        const elements = this.meta.getTags('property="og:locale:alternate"');
        elements.forEach((element) => {
            this.meta.removeTagElement(element);
        });
        if (cur && availableLocales) {
            availableLocales.split(',').forEach((locale) => {
                if (cur.replace(/-/g, '_') !== locale.replace(/-/g, '_')) {
                    this.meta.addTag({
                        property: 'og:locale:alternate',
                        content: locale.replace(/-/g, '_'),
                    });
                }
            });
        }
    }
    updateTag(key, value) {
        if (key.lastIndexOf('og:', 0) === 0) {
            this.meta.updateTag({
                property: key,
                content: key === 'og:locale' ? value.replace(/-/g, '_') : value,
            });
        }
        else {
            this.meta.updateTag({
                name: key,
                content: value,
            });
        }
        this.isMetaTagSet[key] = true;
        if (key === 'description') {
            this.meta.updateTag({
                property: 'og:description',
                content: value,
            });
        }
        else if (key === 'author') {
            this.meta.updateTag({
                property: 'og:author',
                content: value,
            });
        }
        else if (key === 'publisher') {
            this.meta.updateTag({
                property: 'og:publisher',
                content: value,
            });
        }
        else if (key === 'og:locale') {
            const availableLocales = this.settings.defaults?.['og:locale:alternate'] ?? '';
            this.updateLocales(value, availableLocales);
            this.isMetaTagSet['og:locale:alternate'] = true;
        }
        else if (key === 'og:locale:alternate') {
            const currentLocale = this.meta.getTag('property="og:locale"')?.content ?? '';
            this.updateLocales(currentLocale, value);
            this.isMetaTagSet['og:locale'] = true;
        }
    }
}
MetaService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.3", ngImport: i0, type: MetaService, deps: [{ token: i1.MetaLoader }, { token: i2.Title }, { token: i2.Meta }], target: i0.ɵɵFactoryTarget.Injectable });
MetaService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.3", ngImport: i0, type: MetaService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.3", ngImport: i0, type: MetaService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MetaLoader }, { type: i2.Title }, { type: i2.Meta }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LW1ldGEvY29yZS9zcmMvbGliL21ldGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLElBQUksY0FBYyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHOUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7QUFHakQsTUFBTSxPQUFPLFdBQVc7SUFJdEIsWUFBcUIsTUFBa0IsRUFBbUIsS0FBWSxFQUFtQixJQUFVO1FBQTlFLFdBQU0sR0FBTixNQUFNLENBQVk7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUFtQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ2pHLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWEsRUFBRSxRQUFRLEdBQUcsS0FBSztRQUN0QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUvRCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUVuQixJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNSLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUss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LENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUU5RSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUN2QztJQUNILENBQUM7O3dHQXpOVSxXQUFXOzRHQUFYLFdBQVc7MkZBQVgsV0FBVztrQkFEdkIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1ldGEsIFRpdGxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBmcm9tIGFzIG9ic2VydmFibGVGcm9tLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE1ldGFMb2FkZXIgfSBmcm9tICcuL21ldGEubG9hZGVyJztcbmltcG9ydCB7IE1ldGFTZXR0aW5ncyB9IGZyb20gJy4vbW9kZWxzL21ldGEtc2V0dGluZ3MnO1xuaW1wb3J0IHsgUGFnZVRpdGxlUG9zaXRpb25pbmcgfSBmcm9tICcuL21vZGVscy9wYWdlLXRpdGxlLXBvc2l0aW9uaW5nJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSwgaXNQcm9taXNlIH0gZnJvbSAnLi91dGlsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1ldGFTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHNldHRpbmdzOiBNZXRhU2V0dGluZ3M7XG4gIHByaXZhdGUgcmVhZG9ubHkgaXNNZXRhVGFnU2V0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgbG9hZGVyOiBNZXRhTG9hZGVyLCBwcml2YXRlIHJlYWRvbmx5IHRpdGxlOiBUaXRsZSwgcHJpdmF0ZSByZWFkb25seSBtZXRhOiBNZXRhKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IGxvYWRlci5zZXR0aW5ncztcbiAgICB0aGlzLmlzTWV0YVRhZ1NldCA9IHt9O1xuICB9XG5cbiAgc2V0VGl0bGUodGl0bGU6IHN0cmluZywgb3ZlcnJpZGUgPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IHRpdGxlJCA9IHRpdGxlID8gdGhpcy5jYWxsYmFjayh0aXRsZSkgOiBvYnNlcnZhYmxlT2YoJycpO1xuXG4gICAgdGl0bGUkLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgbGV0IGZ1bGxUaXRsZSA9ICcnO1xuXG4gICAgICBpZiAoIXJlcykge1xuICAgICAgICBjb25zdCBkZWZhdWx0VGl0bGUkID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cz8udGl0bGUgPyB0aGlzLmNhbGxiYWNrKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMudGl0bGUpIDogb2JzZXJ2YWJsZU9mKCcnKTtcblxuICAgICAgICBkZWZhdWx0VGl0bGUkLnN1YnNjcmliZShkZWZhdWx0VGl0bGUgPT4ge1xuICAgICAgICAgIGlmICghb3ZlcnJpZGUgJiYgdGhpcy5zZXR0aW5ncy5wYWdlVGl0bGVTZXBhcmF0b3IgJiYgdGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUpLnN1YnNjcmliZShhcHBsaWNhdGlvbk5hbWUgPT4ge1xuICAgICAgICAgICAgICBmdWxsVGl0bGUgPSBhcHBsaWNhdGlvbk5hbWUgPyB0aGlzLmdldFRpdGxlV2l0aFBvc2l0aW9uaW5nKGRlZmF1bHRUaXRsZSwgYXBwbGljYXRpb25OYW1lKSA6IGRlZmF1bHRUaXRsZTtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVUaXRsZShmdWxsVGl0bGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGl0bGUoZGVmYXVsdFRpdGxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICghb3ZlcnJpZGUgJiYgdGhpcy5zZXR0aW5ncy5wYWdlVGl0bGVTZXBhcmF0b3IgJiYgdGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUpIHtcbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLnNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSkuc3Vic2NyaWJlKGFwcGxpY2F0aW9uTmFtZSA9PiB7XG4gICAgICAgICAgZnVsbFRpdGxlID0gYXBwbGljYXRpb25OYW1lID8gdGhpcy5nZXRUaXRsZVdpdGhQb3NpdGlvbmluZyhyZXMsIGFwcGxpY2F0aW9uTmFtZSkgOiByZXM7XG4gICAgICAgICAgdGhpcy51cGRhdGVUaXRsZShmdWxsVGl0bGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlVGl0bGUocmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldFRhZyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChrZXkgPT09ICd0aXRsZScpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEF0dGVtcHQgdG8gc2V0ICR7a2V5fSB0aHJvdWdoIFwic2V0VGFnXCI6IFwidGl0bGVcIiBpcyBhIHJlc2VydmVkIHRhZyBuYW1lLiBgICsgJ1BsZWFzZSB1c2UgYE1ldGFTZXJ2aWNlLnNldFRpdGxlYCBpbnN0ZWFkLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGN1ciA9IHZhbHVlIHx8IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHM/LltrZXldIHx8ICcnO1xuXG4gICAgY29uc3QgdmFsdWUkID0ga2V5ICE9PSAnb2c6bG9jYWxlJyAmJiBrZXkgIT09ICdvZzpsb2NhbGU6YWx0ZXJuYXRlJyA/IHRoaXMuY2FsbGJhY2soY3VyKSA6IG9ic2VydmFibGVPZihjdXIpO1xuXG4gICAgdmFsdWUkLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgdGhpcy51cGRhdGVUYWcoa2V5LCByZXMpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKGN1cnJlbnRVcmw6IHN0cmluZywgbWV0YVNldHRpbmdzPzogYW55KTogdm9pZCB7XG4gICAgaWYgKCFtZXRhU2V0dGluZ3MpIHtcbiAgICAgIGNvbnN0IGZhbGxiYWNrVGl0bGUgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzPy50aXRsZSB8fCB0aGlzLnNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSB8fCAnJztcblxuICAgICAgdGhpcy5zZXRUaXRsZShmYWxsYmFja1RpdGxlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1ldGFTZXR0aW5ncy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnVwZGF0ZShjdXJyZW50VXJsKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0VGl0bGUobWV0YVNldHRpbmdzLnRpdGxlLCBtZXRhU2V0dGluZ3Mub3ZlcnJpZGUpO1xuXG4gICAgICBPYmplY3Qua2V5cyhtZXRhU2V0dGluZ3MpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gbWV0YVNldHRpbmdzW2tleV07XG5cbiAgICAgICAgaWYgKGtleSA9PT0gJ3RpdGxlJyB8fCBrZXkgPT09ICdvdmVycmlkZScpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnb2c6bG9jYWxlJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvLS9nLCAnXycpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ29nOmxvY2FsZTphbHRlcm5hdGUnKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudExvY2FsZSA9IG1ldGFTZXR0aW5nc1snb2c6bG9jYWxlJ107XG4gICAgICAgICAgdGhpcy51cGRhdGVMb2NhbGVzKGN1cnJlbnRMb2NhbGUsIG1ldGFTZXR0aW5nc1trZXldKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VGFnKGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoKG1ldGFTZXR0aW5ncyAmJiAoa2V5IGluIHRoaXMuaXNNZXRhVGFnU2V0IHx8IGtleSBpbiBtZXRhU2V0dGluZ3MpKSB8fCBrZXkgPT09ICd0aXRsZScgfHwga2V5ID09PSAnb3ZlcnJpZGUnIHx8ICF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdvZzpsb2NhbGUnKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8tL2csICdfJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnb2c6bG9jYWxlOmFsdGVybmF0ZScpIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50TG9jYWxlID0gbWV0YVNldHRpbmdzID8gbWV0YVNldHRpbmdzWydvZzpsb2NhbGUnXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsZXMoY3VycmVudExvY2FsZSwgdmFsdWUpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRUYWcoa2V5LCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlVXJsID0gdGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvblVybCB8fCAnLyc7XG4gICAgY29uc3QgdXJsID0gYCR7YmFzZVVybH0ke2N1cnJlbnRVcmx9YC5yZXBsYWNlKC8oaHR0cHM/OlxcL1xcLyl8KFxcLykrL2csICckMSQyJykucmVwbGFjZSgvXFwvJC9nLCAnJyk7XG5cbiAgICB0aGlzLnNldFRhZygnb2c6dXJsJywgdXJsIHx8ICcvJyk7XG4gIH1cblxuICByZW1vdmVUYWcoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1ldGEucmVtb3ZlVGFnKGtleSk7XG4gIH1cblxuICBwcml2YXRlIGNhbGxiYWNrKHZhbHVlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhbGxiYWNrKSB7XG4gICAgICBjb25zdCB2YWx1ZSQgPSB0aGlzLnNldHRpbmdzLmNhbGxiYWNrKHZhbHVlKTtcblxuICAgICAgaWYgKCFpc09ic2VydmFibGUodmFsdWUkKSkge1xuICAgICAgICByZXR1cm4gaXNQcm9taXNlKHZhbHVlJCkgPyBvYnNlcnZhYmxlRnJvbSh2YWx1ZSQpIDogb2JzZXJ2YWJsZU9mKHZhbHVlJCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZSQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGVPZih2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGdldFRpdGxlV2l0aFBvc2l0aW9uaW5nKHRpdGxlOiBzdHJpbmcsIGFwcGxpY2F0aW9uTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlUG9zaXRpb25pbmcpIHtcbiAgICAgIGNhc2UgUGFnZVRpdGxlUG9zaXRpb25pbmcuQXBwZW5kUGFnZVRpdGxlOlxuICAgICAgICByZXR1cm4gYXBwbGljYXRpb25OYW1lICsgU3RyaW5nKHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlU2VwYXJhdG9yKSArIHRpdGxlO1xuICAgICAgY2FzZSBQYWdlVGl0bGVQb3NpdGlvbmluZy5QcmVwZW5kUGFnZVRpdGxlOlxuICAgICAgICByZXR1cm4gdGl0bGUgKyBTdHJpbmcodGhpcy5zZXR0aW5ncy5wYWdlVGl0bGVTZXBhcmF0b3IpICsgYXBwbGljYXRpb25OYW1lO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVGl0bGUodGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMudGl0bGUuc2V0VGl0bGUodGl0bGUpO1xuICAgIHRoaXMubWV0YS51cGRhdGVUYWcoe1xuICAgICAgcHJvcGVydHk6ICdvZzp0aXRsZScsXG4gICAgICBjb250ZW50OiB0aXRsZSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTG9jYWxlcyhjdXJyZW50TG9jYWxlOiBzdHJpbmcsIGF2YWlsYWJsZUxvY2FsZXM6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGN1ciA9IGN1cnJlbnRMb2NhbGUgfHwgdGhpcy5zZXR0aW5ncy5kZWZhdWx0cz8uWydvZzpsb2NhbGUnXSB8fCAnJztcblxuICAgIGlmIChjdXIgJiYgdGhpcy5zZXR0aW5ncy5kZWZhdWx0cykge1xuICAgICAgdGhpcy5zZXR0aW5ncy5kZWZhdWx0c1snb2c6bG9jYWxlJ10gPSBjdXIucmVwbGFjZSgvXy9nLCAnLScpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHNldCBIVE1MIGxhbmcgYXR0cmlidXRlIC0gaHR0cHM6Ly9naXRodWIuY29tL25neC1tZXRhL2NvcmUvaXNzdWVzLzMyXG4gICAgLy8gY29uc3QgaHRtbCA9IHRoaXMuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuICAgIC8vIGh0bWwuc2V0QXR0cmlidXRlKCdsYW5nJywgY3VyKTtcblxuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5tZXRhLmdldFRhZ3MoJ3Byb3BlcnR5PVwib2c6bG9jYWxlOmFsdGVybmF0ZVwiJyk7XG5cbiAgICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50OiBhbnkpID0+IHtcbiAgICAgIHRoaXMubWV0YS5yZW1vdmVUYWdFbGVtZW50KGVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgaWYgKGN1ciAmJiBhdmFpbGFibGVMb2NhbGVzKSB7XG4gICAgICBhdmFpbGFibGVMb2NhbGVzLnNwbGl0KCcsJykuZm9yRWFjaCgobG9jYWxlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGN1ci5yZXBsYWNlKC8tL2csICdfJykgIT09IGxvY2FsZS5yZXBsYWNlKC8tL2csICdfJykpIHtcbiAgICAgICAgICB0aGlzLm1ldGEuYWRkVGFnKHtcbiAgICAgICAgICAgIHByb3BlcnR5OiAnb2c6bG9jYWxlOmFsdGVybmF0ZScsXG4gICAgICAgICAgICBjb250ZW50OiBsb2NhbGUucmVwbGFjZSgvLS9nLCAnXycpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVRhZyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChrZXkubGFzdEluZGV4T2YoJ29nOicsIDApID09PSAwKSB7XG4gICAgICB0aGlzLm1ldGEudXBkYXRlVGFnKHtcbiAgICAgICAgcHJvcGVydHk6IGtleSxcbiAgICAgICAgY29udGVudDoga2V5ID09PSAnb2c6bG9jYWxlJyA/IHZhbHVlLnJlcGxhY2UoLy0vZywgJ18nKSA6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWV0YS51cGRhdGVUYWcoe1xuICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgIGNvbnRlbnQ6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5pc01ldGFUYWdTZXRba2V5XSA9IHRydWU7XG5cbiAgICBpZiAoa2V5ID09PSAnZGVzY3JpcHRpb24nKSB7XG4gICAgICB0aGlzLm1ldGEudXBkYXRlVGFnKHtcbiAgICAgICAgcHJvcGVydHk6ICdvZzpkZXNjcmlwdGlvbicsXG4gICAgICAgIGNvbnRlbnQ6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdhdXRob3InKSB7XG4gICAgICB0aGlzLm1ldGEudXBkYXRlVGFnKHtcbiAgICAgICAgcHJvcGVydHk6ICdvZzphdXRob3InLFxuICAgICAgICBjb250ZW50OiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAncHVibGlzaGVyJykge1xuICAgICAgdGhpcy5tZXRhLnVwZGF0ZVRhZyh7XG4gICAgICAgIHByb3BlcnR5OiAnb2c6cHVibGlzaGVyJyxcbiAgICAgICAgY29udGVudDogdmFsdWUsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ29nOmxvY2FsZScpIHtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZUxvY2FsZXMgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzPy5bJ29nOmxvY2FsZTphbHRlcm5hdGUnXSA/PyAnJztcblxuICAgICAgdGhpcy51cGRhdGVMb2NhbGVzKHZhbHVlLCBhdmFpbGFibGVMb2NhbGVzKTtcbiAgICAgIHRoaXMuaXNNZXRhVGFnU2V0WydvZzpsb2NhbGU6YWx0ZXJuYXRlJ10gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnb2c6bG9jYWxlOmFsdGVybmF0ZScpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRMb2NhbGUgPSB0aGlzLm1ldGEuZ2V0VGFnKCdwcm9wZXJ0eT1cIm9nOmxvY2FsZVwiJyk/LmNvbnRlbnQgPz8gJyc7XG5cbiAgICAgIHRoaXMudXBkYXRlTG9jYWxlcyhjdXJyZW50TG9jYWxlLCB2YWx1ZSk7XG4gICAgICB0aGlzLmlzTWV0YVRhZ1NldFsnb2c6bG9jYWxlJ10gPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19