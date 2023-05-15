import { Injectable } from '@angular/core';
import { from as observableFrom, of as observableOf } from 'rxjs';
import { PageTitlePositioning } from './models/page-title-positioning';
import { isObservable, isPromise } from './util';
import * as i0 from "@angular/core";
import * as i1 from "./meta.loader";
import * as i2 from "@angular/platform-browser";
class MetaService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.1", ngImport: i0, type: MetaService, deps: [{ token: i1.MetaLoader }, { token: i2.Title }, { token: i2.Meta }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.1", ngImport: i0, type: MetaService }); }
}
export { MetaService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.1", ngImport: i0, type: MetaService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MetaLoader }, { type: i2.Title }, { type: i2.Meta }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LW1ldGEvY29yZS9zcmMvbGliL21ldGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLElBQUksY0FBYyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFJOUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7QUFFakQsTUFDYSxXQUFXO0lBSXRCLFlBQXFCLE1BQWtCLEVBQW1CLEtBQVksRUFBbUIsSUFBVTtRQUE5RSxXQUFNLEdBQU4sTUFBTSxDQUFZO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQU87UUFBbUIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNqRyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFjLEVBQUUsUUFBUSxHQUFHLEtBQUs7UUFDdkMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFL0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFFbkIsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDUixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMs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LE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFFOUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdkM7SUFDSCxDQUFDOzhHQXpOVSxXQUFXO2tIQUFYLFdBQVc7O1NBQVgsV0FBVzsyRkFBWCxXQUFXO2tCQUR2QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWV0YSwgVGl0bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IGZyb20gYXMgb2JzZXJ2YWJsZUZyb20sIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWV0YUxvYWRlciB9IGZyb20gJy4vbWV0YS5sb2FkZXInO1xuaW1wb3J0IHsgTWV0YVJvdXRlU2V0dGluZ3MgfSBmcm9tICcuL21vZGVscy9tZXRhLXJvdXRlLXNldHRpbmdzJztcbmltcG9ydCB7IE1ldGFTZXR0aW5ncyB9IGZyb20gJy4vbW9kZWxzL21ldGEtc2V0dGluZ3MnO1xuaW1wb3J0IHsgUGFnZVRpdGxlUG9zaXRpb25pbmcgfSBmcm9tICcuL21vZGVscy9wYWdlLXRpdGxlLXBvc2l0aW9uaW5nJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSwgaXNQcm9taXNlIH0gZnJvbSAnLi91dGlsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1ldGFTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHNldHRpbmdzOiBNZXRhU2V0dGluZ3M7XG4gIHByaXZhdGUgcmVhZG9ubHkgaXNNZXRhVGFnU2V0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IocmVhZG9ubHkgbG9hZGVyOiBNZXRhTG9hZGVyLCBwcml2YXRlIHJlYWRvbmx5IHRpdGxlOiBUaXRsZSwgcHJpdmF0ZSByZWFkb25seSBtZXRhOiBNZXRhKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IGxvYWRlci5zZXR0aW5ncztcbiAgICB0aGlzLmlzTWV0YVRhZ1NldCA9IHt9O1xuICB9XG5cbiAgc2V0VGl0bGUodGl0bGU/OiBzdHJpbmcsIG92ZXJyaWRlID0gZmFsc2UpOiB2b2lkIHtcbiAgICBjb25zdCB0aXRsZSQgPSB0aXRsZSA/IHRoaXMuY2FsbGJhY2sodGl0bGUpIDogb2JzZXJ2YWJsZU9mKCcnKTtcblxuICAgIHRpdGxlJC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIGxldCBmdWxsVGl0bGUgPSAnJztcblxuICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdFRpdGxlJCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHM/LnRpdGxlID8gdGhpcy5jYWxsYmFjayh0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnRpdGxlKSA6IG9ic2VydmFibGVPZignJyk7XG5cbiAgICAgICAgZGVmYXVsdFRpdGxlJC5zdWJzY3JpYmUoZGVmYXVsdFRpdGxlID0+IHtcbiAgICAgICAgICBpZiAoIW92ZXJyaWRlICYmIHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlU2VwYXJhdG9yICYmIHRoaXMuc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMuc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lKS5zdWJzY3JpYmUoYXBwbGljYXRpb25OYW1lID0+IHtcbiAgICAgICAgICAgICAgZnVsbFRpdGxlID0gYXBwbGljYXRpb25OYW1lID8gdGhpcy5nZXRUaXRsZVdpdGhQb3NpdGlvbmluZyhkZWZhdWx0VGl0bGUsIGFwcGxpY2F0aW9uTmFtZSkgOiBkZWZhdWx0VGl0bGU7XG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlVGl0bGUoZnVsbFRpdGxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKGRlZmF1bHRUaXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoIW92ZXJyaWRlICYmIHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlU2VwYXJhdG9yICYmIHRoaXMuc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUpLnN1YnNjcmliZShhcHBsaWNhdGlvbk5hbWUgPT4ge1xuICAgICAgICAgIGZ1bGxUaXRsZSA9IGFwcGxpY2F0aW9uTmFtZSA/IHRoaXMuZ2V0VGl0bGVXaXRoUG9zaXRpb25pbmcocmVzLCBhcHBsaWNhdGlvbk5hbWUpIDogcmVzO1xuICAgICAgICAgIHRoaXMudXBkYXRlVGl0bGUoZnVsbFRpdGxlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUYWcoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoa2V5ID09PSAndGl0bGUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBBdHRlbXB0IHRvIHNldCAke2tleX0gdGhyb3VnaCBcInNldFRhZ1wiOiBcInRpdGxlXCIgaXMgYSByZXNlcnZlZCB0YWcgbmFtZS4gYCArICdQbGVhc2UgdXNlIGBNZXRhU2VydmljZS5zZXRUaXRsZWAgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXIgPSB2YWx1ZSB8fCB0aGlzLnNldHRpbmdzLmRlZmF1bHRzPy5ba2V5XSB8fCAnJztcblxuICAgIGNvbnN0IHZhbHVlJCA9IGtleSAhPT0gJ29nOmxvY2FsZScgJiYga2V5ICE9PSAnb2c6bG9jYWxlOmFsdGVybmF0ZScgPyB0aGlzLmNhbGxiYWNrKGN1cikgOiBvYnNlcnZhYmxlT2YoY3VyKTtcblxuICAgIHZhbHVlJC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIHRoaXMudXBkYXRlVGFnKGtleSwgcmVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZShjdXJyZW50VXJsOiBzdHJpbmcsIG1ldGFTZXR0aW5ncz86IE1ldGFSb3V0ZVNldHRpbmdzKTogdm9pZCB7XG4gICAgaWYgKCFtZXRhU2V0dGluZ3MpIHtcbiAgICAgIGNvbnN0IGZhbGxiYWNrVGl0bGUgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzPy50aXRsZSB8fCB0aGlzLnNldHRpbmdzLmFwcGxpY2F0aW9uTmFtZSB8fCAnJztcblxuICAgICAgdGhpcy5zZXRUaXRsZShmYWxsYmFja1RpdGxlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1ldGFTZXR0aW5ncy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnVwZGF0ZShjdXJyZW50VXJsKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0VGl0bGUobWV0YVNldHRpbmdzLnRpdGxlLCBtZXRhU2V0dGluZ3Mub3ZlcnJpZGUpO1xuXG4gICAgICBPYmplY3Qua2V5cyhtZXRhU2V0dGluZ3MpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gbWV0YVNldHRpbmdzW2tleV07XG5cbiAgICAgICAgaWYgKGtleSA9PT0gJ3RpdGxlJyB8fCBrZXkgPT09ICdvdmVycmlkZScpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnb2c6bG9jYWxlJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvLS9nLCAnXycpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ29nOmxvY2FsZTphbHRlcm5hdGUnKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudExvY2FsZSA9IG1ldGFTZXR0aW5nc1snb2c6bG9jYWxlJ107XG4gICAgICAgICAgdGhpcy51cGRhdGVMb2NhbGVzKGN1cnJlbnRMb2NhbGUsIG1ldGFTZXR0aW5nc1trZXldKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VGFnKGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoKG1ldGFTZXR0aW5ncyAmJiAoa2V5IGluIHRoaXMuaXNNZXRhVGFnU2V0IHx8IGtleSBpbiBtZXRhU2V0dGluZ3MpKSB8fCBrZXkgPT09ICd0aXRsZScgfHwga2V5ID09PSAnb3ZlcnJpZGUnIHx8ICF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdvZzpsb2NhbGUnKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8tL2csICdfJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnb2c6bG9jYWxlOmFsdGVybmF0ZScpIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50TG9jYWxlID0gbWV0YVNldHRpbmdzID8gbWV0YVNldHRpbmdzWydvZzpsb2NhbGUnXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsZXMoY3VycmVudExvY2FsZSwgdmFsdWUpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRUYWcoa2V5LCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlVXJsID0gdGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvblVybCB8fCAnLyc7XG4gICAgY29uc3QgdXJsID0gYCR7YmFzZVVybH0ke2N1cnJlbnRVcmx9YC5yZXBsYWNlKC8oaHR0cHM/OlxcL1xcLyl8KFxcLykrL2csICckMSQyJykucmVwbGFjZSgvXFwvJC9nLCAnJyk7XG5cbiAgICB0aGlzLnNldFRhZygnb2c6dXJsJywgdXJsIHx8ICcvJyk7XG4gIH1cblxuICByZW1vdmVUYWcoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1ldGEucmVtb3ZlVGFnKGtleSk7XG4gIH1cblxuICBwcml2YXRlIGNhbGxiYWNrKHZhbHVlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmNhbGxiYWNrKSB7XG4gICAgICBjb25zdCB2YWx1ZSQgPSB0aGlzLnNldHRpbmdzLmNhbGxiYWNrKHZhbHVlKTtcblxuICAgICAgaWYgKCFpc09ic2VydmFibGUodmFsdWUkKSkge1xuICAgICAgICByZXR1cm4gaXNQcm9taXNlKHZhbHVlJCkgPyBvYnNlcnZhYmxlRnJvbSh2YWx1ZSQpIDogb2JzZXJ2YWJsZU9mKHZhbHVlJCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZSQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGVPZih2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGdldFRpdGxlV2l0aFBvc2l0aW9uaW5nKHRpdGxlOiBzdHJpbmcsIGFwcGxpY2F0aW9uTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlUG9zaXRpb25pbmcpIHtcbiAgICAgIGNhc2UgUGFnZVRpdGxlUG9zaXRpb25pbmcuQXBwZW5kUGFnZVRpdGxlOlxuICAgICAgICByZXR1cm4gYXBwbGljYXRpb25OYW1lICsgU3RyaW5nKHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlU2VwYXJhdG9yKSArIHRpdGxlO1xuICAgICAgY2FzZSBQYWdlVGl0bGVQb3NpdGlvbmluZy5QcmVwZW5kUGFnZVRpdGxlOlxuICAgICAgICByZXR1cm4gdGl0bGUgKyBTdHJpbmcodGhpcy5zZXR0aW5ncy5wYWdlVGl0bGVTZXBhcmF0b3IpICsgYXBwbGljYXRpb25OYW1lO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVGl0bGUodGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMudGl0bGUuc2V0VGl0bGUodGl0bGUpO1xuICAgIHRoaXMubWV0YS51cGRhdGVUYWcoe1xuICAgICAgcHJvcGVydHk6ICdvZzp0aXRsZScsXG4gICAgICBjb250ZW50OiB0aXRsZSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTG9jYWxlcyhjdXJyZW50TG9jYWxlPzogc3RyaW5nLCBhdmFpbGFibGVMb2NhbGVzPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgY3VyID0gY3VycmVudExvY2FsZSB8fCB0aGlzLnNldHRpbmdzLmRlZmF1bHRzPy5bJ29nOmxvY2FsZSddIHx8ICcnO1xuXG4gICAgaWYgKGN1ciAmJiB0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmRlZmF1bHRzWydvZzpsb2NhbGUnXSA9IGN1ci5yZXBsYWNlKC9fL2csICctJyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogc2V0IEhUTUwgbGFuZyBhdHRyaWJ1dGUgLSBodHRwczovL2dpdGh1Yi5jb20vbmd4LW1ldGEvY29yZS9pc3N1ZXMvMzJcbiAgICAvLyBjb25zdCBodG1sID0gdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJyk7XG4gICAgLy8gaHRtbC5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBjdXIpO1xuXG4gICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLm1ldGEuZ2V0VGFncygncHJvcGVydHk9XCJvZzpsb2NhbGU6YWx0ZXJuYXRlXCInKTtcblxuICAgIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5tZXRhLnJlbW92ZVRhZ0VsZW1lbnQoZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICBpZiAoY3VyICYmIGF2YWlsYWJsZUxvY2FsZXMpIHtcbiAgICAgIGF2YWlsYWJsZUxvY2FsZXMuc3BsaXQoJywnKS5mb3JFYWNoKChsb2NhbGU6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoY3VyLnJlcGxhY2UoLy0vZywgJ18nKSAhPT0gbG9jYWxlLnJlcGxhY2UoLy0vZywgJ18nKSkge1xuICAgICAgICAgIHRoaXMubWV0YS5hZGRUYWcoe1xuICAgICAgICAgICAgcHJvcGVydHk6ICdvZzpsb2NhbGU6YWx0ZXJuYXRlJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGxvY2FsZS5yZXBsYWNlKC8tL2csICdfJyksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVGFnKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGtleS5sYXN0SW5kZXhPZignb2c6JywgMCkgPT09IDApIHtcbiAgICAgIHRoaXMubWV0YS51cGRhdGVUYWcoe1xuICAgICAgICBwcm9wZXJ0eToga2V5LFxuICAgICAgICBjb250ZW50OiBrZXkgPT09ICdvZzpsb2NhbGUnID8gdmFsdWUucmVwbGFjZSgvLS9nLCAnXycpIDogdmFsdWUsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXRhLnVwZGF0ZVRhZyh7XG4gICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgY29udGVudDogdmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmlzTWV0YVRhZ1NldFtrZXldID0gdHJ1ZTtcblxuICAgIGlmIChrZXkgPT09ICdkZXNjcmlwdGlvbicpIHtcbiAgICAgIHRoaXMubWV0YS51cGRhdGVUYWcoe1xuICAgICAgICBwcm9wZXJ0eTogJ29nOmRlc2NyaXB0aW9uJyxcbiAgICAgICAgY29udGVudDogdmFsdWUsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2F1dGhvcicpIHtcbiAgICAgIHRoaXMubWV0YS51cGRhdGVUYWcoe1xuICAgICAgICBwcm9wZXJ0eTogJ29nOmF1dGhvcicsXG4gICAgICAgIGNvbnRlbnQ6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdwdWJsaXNoZXInKSB7XG4gICAgICB0aGlzLm1ldGEudXBkYXRlVGFnKHtcbiAgICAgICAgcHJvcGVydHk6ICdvZzpwdWJsaXNoZXInLFxuICAgICAgICBjb250ZW50OiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnb2c6bG9jYWxlJykge1xuICAgICAgY29uc3QgYXZhaWxhYmxlTG9jYWxlcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHM/Llsnb2c6bG9jYWxlOmFsdGVybmF0ZSddID8/ICcnO1xuXG4gICAgICB0aGlzLnVwZGF0ZUxvY2FsZXModmFsdWUsIGF2YWlsYWJsZUxvY2FsZXMpO1xuICAgICAgdGhpcy5pc01ldGFUYWdTZXRbJ29nOmxvY2FsZTphbHRlcm5hdGUnXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdvZzpsb2NhbGU6YWx0ZXJuYXRlJykge1xuICAgICAgY29uc3QgY3VycmVudExvY2FsZSA9IHRoaXMubWV0YS5nZXRUYWcoJ3Byb3BlcnR5PVwib2c6bG9jYWxlXCInKT8uY29udGVudCA/PyAnJztcblxuICAgICAgdGhpcy51cGRhdGVMb2NhbGVzKGN1cnJlbnRMb2NhbGUsIHZhbHVlKTtcbiAgICAgIHRoaXMuaXNNZXRhVGFnU2V0WydvZzpsb2NhbGUnXSA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iXX0=