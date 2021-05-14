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
            var _a;
            let fullTitle = '';
            if (!res) {
                const defaultTitle$ = ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a.title) ? this.callback(this.settings.defaults.title) : observableOf('');
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
        var _a;
        if (key === 'title') {
            throw new Error(`Attempt to set ${key} through "setTag": "title" is a reserved tag name. ` + 'Please use `MetaService.setTitle` instead.');
        }
        const cur = value || ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a[key]) || '';
        const value$ = key !== 'og:locale' && key !== 'og:locale:alternate' ? this.callback(cur) : observableOf(cur);
        value$.subscribe(res => {
            this.updateTag(key, res);
        });
    }
    update(currentUrl, metaSettings) {
        var _a;
        if (!metaSettings) {
            const fallbackTitle = ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a.title) || this.settings.applicationName || '';
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
        var _a;
        const cur = currentLocale || ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a['og:locale']) || '';
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
        var _a, _b, _c, _d;
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
            const availableLocales = (_b = (_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a['og:locale:alternate']) !== null && _b !== void 0 ? _b : '';
            this.updateLocales(value, availableLocales);
            this.isMetaTagSet['og:locale:alternate'] = true;
        }
        else if (key === 'og:locale:alternate') {
            const currentLocale = (_d = (_c = this.meta.getTag('property="og:locale"')) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : '';
            this.updateLocales(currentLocale, value);
            this.isMetaTagSet['og:locale'] = true;
        }
    }
}
MetaService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaService, deps: [{ token: i1.MetaLoader }, { token: i2.Title }, { token: i2.Meta }], target: i0.ɵɵFactoryTarget.Injectable });
MetaService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MetaLoader }, { type: i2.Title }, { type: i2.Meta }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LW1ldGEvY29yZS9zcmMvbGliL21ldGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLElBQUksY0FBYyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHOUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7QUFHakQsTUFBTSxPQUFPLFdBQVc7SUFJdEIsWUFBcUIsTUFBa0IsRUFBbUIsS0FBWSxFQUFtQixJQUFVO1FBQTlFLFdBQU0sR0FBTixNQUFNLENBQVk7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUFtQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ2pHLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWEsRUFBRSxRQUFRLEdBQUcsS0FBSztRQUN0QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUvRCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFOztZQUNyQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFFbkIsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDUixNQUFNLGFBQWEsR0FBRyxDQUFBLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFR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QkFBcUIsRUFBRTtZQUN4QyxNQUFNLGFBQWEsR0FBRyxNQUFBLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsMENBQUUsT0FBTyxtQ0FBSSxFQUFFLENBQUM7WUFFOUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdkM7SUFDSCxDQUFDOzt3R0F6TlUsV0FBVzs0R0FBWCxXQUFXOzJGQUFYLFdBQVc7a0JBRHZCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNZXRhLCBUaXRsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgZnJvbSBhcyBvYnNlcnZhYmxlRnJvbSwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBNZXRhTG9hZGVyIH0gZnJvbSAnLi9tZXRhLmxvYWRlcic7XG5pbXBvcnQgeyBNZXRhU2V0dGluZ3MgfSBmcm9tICcuL21vZGVscy9tZXRhLXNldHRpbmdzJztcbmltcG9ydCB7IFBhZ2VUaXRsZVBvc2l0aW9uaW5nIH0gZnJvbSAnLi9tb2RlbHMvcGFnZS10aXRsZS1wb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBpc09ic2VydmFibGUsIGlzUHJvbWlzZSB9IGZyb20gJy4vdXRpbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZXRhU2VydmljZSB7XG4gIHByb3RlY3RlZCByZWFkb25seSBzZXR0aW5nczogTWV0YVNldHRpbmdzO1xuICBwcml2YXRlIHJlYWRvbmx5IGlzTWV0YVRhZ1NldDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGxvYWRlcjogTWV0YUxvYWRlciwgcHJpdmF0ZSByZWFkb25seSB0aXRsZTogVGl0bGUsIHByaXZhdGUgcmVhZG9ubHkgbWV0YTogTWV0YSkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBsb2FkZXIuc2V0dGluZ3M7XG4gICAgdGhpcy5pc01ldGFUYWdTZXQgPSB7fTtcbiAgfVxuXG4gIHNldFRpdGxlKHRpdGxlOiBzdHJpbmcsIG92ZXJyaWRlID0gZmFsc2UpOiB2b2lkIHtcbiAgICBjb25zdCB0aXRsZSQgPSB0aXRsZSA/IHRoaXMuY2FsbGJhY2sodGl0bGUpIDogb2JzZXJ2YWJsZU9mKCcnKTtcblxuICAgIHRpdGxlJC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIGxldCBmdWxsVGl0bGUgPSAnJztcblxuICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdFRpdGxlJCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHM/LnRpdGxlID8gdGhpcy5jYWxsYmFjayh0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnRpdGxlKSA6IG9ic2VydmFibGVPZignJyk7XG5cbiAgICAgICAgZGVmYXVsdFRpdGxlJC5zdWJzY3JpYmUoZGVmYXVsdFRpdGxlID0+IHtcbiAgICAgICAgICBpZiAoIW92ZXJyaWRlICYmIHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlU2VwYXJhdG9yICYmIHRoaXMuc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMuc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lKS5zdWJzY3JpYmUoYXBwbGljYXRpb25OYW1lID0+IHtcbiAgICAgICAgICAgICAgZnVsbFRpdGxlID0gYXBwbGljYXRpb25OYW1lID8gdGhpcy5nZXRUaXRsZVdpdGhQb3NpdGlvbmluZyhkZWZhdWx0VGl0bGUsIGFwcGxpY2F0aW9uTmFtZSkgOiBkZWZhdWx0VGl0bGU7XG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlVGl0bGUoZnVsbFRpdGxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKGRlZmF1bHRUaXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoIW92ZXJyaWRlICYmIHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlU2VwYXJhdG9yICYmIHRoaXMuc2V0dGluZ3MuYXBwbGljYXRpb25OYW1lKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUpLnN1YnNjcmliZShhcHBsaWNhdGlvbk5hbWUgPT4ge1xuICAgICAgICAgIGZ1bGxUaXRsZSA9IGFwcGxpY2F0aW9uTmFtZSA/IHRoaXMuZ2V0VGl0bGVXaXRoUG9zaXRpb25pbmcocmVzLCBhcHBsaWNhdGlvbk5hbWUpIDogcmVzO1xuICAgICAgICAgIHRoaXMudXBkYXRlVGl0bGUoZnVsbFRpdGxlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUYWcoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoa2V5ID09PSAndGl0bGUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBBdHRlbXB0IHRvIHNldCAke2tleX0gdGhyb3VnaCBcInNldFRhZ1wiOiBcInRpdGxlXCIgaXMgYSByZXNlcnZlZCB0YWcgbmFtZS4gYCArICdQbGVhc2UgdXNlIGBNZXRhU2VydmljZS5zZXRUaXRsZWAgaW5zdGVhZC4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXIgPSB2YWx1ZSB8fCB0aGlzLnNldHRpbmdzLmRlZmF1bHRzPy5ba2V5XSB8fCAnJztcblxuICAgIGNvbnN0IHZhbHVlJCA9IGtleSAhPT0gJ29nOmxvY2FsZScgJiYga2V5ICE9PSAnb2c6bG9jYWxlOmFsdGVybmF0ZScgPyB0aGlzLmNhbGxiYWNrKGN1cikgOiBvYnNlcnZhYmxlT2YoY3VyKTtcblxuICAgIHZhbHVlJC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIHRoaXMudXBkYXRlVGFnKGtleSwgcmVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZShjdXJyZW50VXJsOiBzdHJpbmcsIG1ldGFTZXR0aW5ncz86IGFueSk6IHZvaWQge1xuICAgIGlmICghbWV0YVNldHRpbmdzKSB7XG4gICAgICBjb25zdCBmYWxsYmFja1RpdGxlID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cz8udGl0bGUgfHwgdGhpcy5zZXR0aW5ncy5hcHBsaWNhdGlvbk5hbWUgfHwgJyc7XG5cbiAgICAgIHRoaXMuc2V0VGl0bGUoZmFsbGJhY2tUaXRsZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtZXRhU2V0dGluZ3MuZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoY3VycmVudFVybCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFRpdGxlKG1ldGFTZXR0aW5ncy50aXRsZSwgbWV0YVNldHRpbmdzLm92ZXJyaWRlKTtcblxuICAgICAgT2JqZWN0LmtleXMobWV0YVNldHRpbmdzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG1ldGFTZXR0aW5nc1trZXldO1xuXG4gICAgICAgIGlmIChrZXkgPT09ICd0aXRsZScgfHwga2V5ID09PSAnb3ZlcnJpZGUnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ29nOmxvY2FsZScpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLy0vZywgJ18nKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdvZzpsb2NhbGU6YWx0ZXJuYXRlJykge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRMb2NhbGUgPSBtZXRhU2V0dGluZ3NbJ29nOmxvY2FsZSddO1xuICAgICAgICAgIHRoaXMudXBkYXRlTG9jYWxlcyhjdXJyZW50TG9jYWxlLCBtZXRhU2V0dGluZ3Nba2V5XSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFRhZyhrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB7XG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLmRlZmF1bHRzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKChtZXRhU2V0dGluZ3MgJiYgKGtleSBpbiB0aGlzLmlzTWV0YVRhZ1NldCB8fCBrZXkgaW4gbWV0YVNldHRpbmdzKSkgfHwga2V5ID09PSAndGl0bGUnIHx8IGtleSA9PT0gJ292ZXJyaWRlJyB8fCAhdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnb2c6bG9jYWxlJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvLS9nLCAnXycpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ29nOmxvY2FsZTphbHRlcm5hdGUnKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudExvY2FsZSA9IG1ldGFTZXR0aW5ncyA/IG1ldGFTZXR0aW5nc1snb2c6bG9jYWxlJ10gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgdGhpcy51cGRhdGVMb2NhbGVzKGN1cnJlbnRMb2NhbGUsIHZhbHVlKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VGFnKGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgYmFzZVVybCA9IHRoaXMuc2V0dGluZ3MuYXBwbGljYXRpb25VcmwgfHwgJy8nO1xuICAgIGNvbnN0IHVybCA9IGAke2Jhc2VVcmx9JHtjdXJyZW50VXJsfWAucmVwbGFjZSgvKGh0dHBzPzpcXC9cXC8pfChcXC8pKy9nLCAnJDEkMicpLnJlcGxhY2UoL1xcLyQvZywgJycpO1xuXG4gICAgdGhpcy5zZXRUYWcoJ29nOnVybCcsIHVybCB8fCAnLycpO1xuICB9XG5cbiAgcmVtb3ZlVGFnKGtleTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5tZXRhLnJlbW92ZVRhZyhrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsYmFjayh2YWx1ZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jYWxsYmFjaykge1xuICAgICAgY29uc3QgdmFsdWUkID0gdGhpcy5zZXR0aW5ncy5jYWxsYmFjayh2YWx1ZSk7XG5cbiAgICAgIGlmICghaXNPYnNlcnZhYmxlKHZhbHVlJCkpIHtcbiAgICAgICAgcmV0dXJuIGlzUHJvbWlzZSh2YWx1ZSQpID8gb2JzZXJ2YWJsZUZyb20odmFsdWUkKSA6IG9ic2VydmFibGVPZih2YWx1ZSQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWUkO1xuICAgIH1cblxuICAgIHJldHVybiBvYnNlcnZhYmxlT2YodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUaXRsZVdpdGhQb3NpdGlvbmluZyh0aXRsZTogc3RyaW5nLCBhcHBsaWNhdGlvbk5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLnBhZ2VUaXRsZVBvc2l0aW9uaW5nKSB7XG4gICAgICBjYXNlIFBhZ2VUaXRsZVBvc2l0aW9uaW5nLkFwcGVuZFBhZ2VUaXRsZTpcbiAgICAgICAgcmV0dXJuIGFwcGxpY2F0aW9uTmFtZSArIFN0cmluZyh0aGlzLnNldHRpbmdzLnBhZ2VUaXRsZVNlcGFyYXRvcikgKyB0aXRsZTtcbiAgICAgIGNhc2UgUGFnZVRpdGxlUG9zaXRpb25pbmcuUHJlcGVuZFBhZ2VUaXRsZTpcbiAgICAgICAgcmV0dXJuIHRpdGxlICsgU3RyaW5nKHRoaXMuc2V0dGluZ3MucGFnZVRpdGxlU2VwYXJhdG9yKSArIGFwcGxpY2F0aW9uTmFtZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0aXRsZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVRpdGxlKHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnRpdGxlLnNldFRpdGxlKHRpdGxlKTtcbiAgICB0aGlzLm1ldGEudXBkYXRlVGFnKHtcbiAgICAgIHByb3BlcnR5OiAnb2c6dGl0bGUnLFxuICAgICAgY29udGVudDogdGl0bGUsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUxvY2FsZXMoY3VycmVudExvY2FsZTogc3RyaW5nLCBhdmFpbGFibGVMb2NhbGVzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjdXIgPSBjdXJyZW50TG9jYWxlIHx8IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHM/Llsnb2c6bG9jYWxlJ10gfHwgJyc7XG5cbiAgICBpZiAoY3VyICYmIHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuZGVmYXVsdHNbJ29nOmxvY2FsZSddID0gY3VyLnJlcGxhY2UoL18vZywgJy0nKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBzZXQgSFRNTCBsYW5nIGF0dHJpYnV0ZSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9uZ3gtbWV0YS9jb3JlL2lzc3Vlcy8zMlxuICAgIC8vIGNvbnN0IGh0bWwgPSB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcbiAgICAvLyBodG1sLnNldEF0dHJpYnV0ZSgnbGFuZycsIGN1cik7XG5cbiAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMubWV0YS5nZXRUYWdzKCdwcm9wZXJ0eT1cIm9nOmxvY2FsZTphbHRlcm5hdGVcIicpO1xuXG4gICAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudDogYW55KSA9PiB7XG4gICAgICB0aGlzLm1ldGEucmVtb3ZlVGFnRWxlbWVudChlbGVtZW50KTtcbiAgICB9KTtcblxuICAgIGlmIChjdXIgJiYgYXZhaWxhYmxlTG9jYWxlcykge1xuICAgICAgYXZhaWxhYmxlTG9jYWxlcy5zcGxpdCgnLCcpLmZvckVhY2goKGxvY2FsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChjdXIucmVwbGFjZSgvLS9nLCAnXycpICE9PSBsb2NhbGUucmVwbGFjZSgvLS9nLCAnXycpKSB7XG4gICAgICAgICAgdGhpcy5tZXRhLmFkZFRhZyh7XG4gICAgICAgICAgICBwcm9wZXJ0eTogJ29nOmxvY2FsZTphbHRlcm5hdGUnLFxuICAgICAgICAgICAgY29udGVudDogbG9jYWxlLnJlcGxhY2UoLy0vZywgJ18nKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVUYWcoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoa2V5Lmxhc3RJbmRleE9mKCdvZzonLCAwKSA9PT0gMCkge1xuICAgICAgdGhpcy5tZXRhLnVwZGF0ZVRhZyh7XG4gICAgICAgIHByb3BlcnR5OiBrZXksXG4gICAgICAgIGNvbnRlbnQ6IGtleSA9PT0gJ29nOmxvY2FsZScgPyB2YWx1ZS5yZXBsYWNlKC8tL2csICdfJykgOiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1ldGEudXBkYXRlVGFnKHtcbiAgICAgICAgbmFtZToga2V5LFxuICAgICAgICBjb250ZW50OiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuaXNNZXRhVGFnU2V0W2tleV0gPSB0cnVlO1xuXG4gICAgaWYgKGtleSA9PT0gJ2Rlc2NyaXB0aW9uJykge1xuICAgICAgdGhpcy5tZXRhLnVwZGF0ZVRhZyh7XG4gICAgICAgIHByb3BlcnR5OiAnb2c6ZGVzY3JpcHRpb24nLFxuICAgICAgICBjb250ZW50OiB2YWx1ZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnYXV0aG9yJykge1xuICAgICAgdGhpcy5tZXRhLnVwZGF0ZVRhZyh7XG4gICAgICAgIHByb3BlcnR5OiAnb2c6YXV0aG9yJyxcbiAgICAgICAgY29udGVudDogdmFsdWUsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3B1Ymxpc2hlcicpIHtcbiAgICAgIHRoaXMubWV0YS51cGRhdGVUYWcoe1xuICAgICAgICBwcm9wZXJ0eTogJ29nOnB1Ymxpc2hlcicsXG4gICAgICAgIGNvbnRlbnQ6IHZhbHVlLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdvZzpsb2NhbGUnKSB7XG4gICAgICBjb25zdCBhdmFpbGFibGVMb2NhbGVzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cz8uWydvZzpsb2NhbGU6YWx0ZXJuYXRlJ10gPz8gJyc7XG5cbiAgICAgIHRoaXMudXBkYXRlTG9jYWxlcyh2YWx1ZSwgYXZhaWxhYmxlTG9jYWxlcyk7XG4gICAgICB0aGlzLmlzTWV0YVRhZ1NldFsnb2c6bG9jYWxlOmFsdGVybmF0ZSddID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ29nOmxvY2FsZTphbHRlcm5hdGUnKSB7XG4gICAgICBjb25zdCBjdXJyZW50TG9jYWxlID0gdGhpcy5tZXRhLmdldFRhZygncHJvcGVydHk9XCJvZzpsb2NhbGVcIicpPy5jb250ZW50ID8/ICcnO1xuXG4gICAgICB0aGlzLnVwZGF0ZUxvY2FsZXMoY3VycmVudExvY2FsZSwgdmFsdWUpO1xuICAgICAgdGhpcy5pc01ldGFUYWdTZXRbJ29nOmxvY2FsZSddID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==