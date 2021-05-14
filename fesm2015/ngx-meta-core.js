import * as i0 from '@angular/core';
import { Injectable, NgModule, Optional, SkipSelf } from '@angular/core';
import { of, from } from 'rxjs';
import * as i2 from '@angular/platform-browser';

var PageTitlePositioning;
(function (PageTitlePositioning) {
    /**
     * append page title after application name
     */
    PageTitlePositioning[PageTitlePositioning["AppendPageTitle"] = 0] = "AppendPageTitle";
    /**
     * prepend page title before application name
     */
    PageTitlePositioning[PageTitlePositioning["PrependPageTitle"] = 10] = "PrependPageTitle";
})(PageTitlePositioning || (PageTitlePositioning = {}));

const isPromise = (obj) => !!obj && typeof obj.then === 'function';
const isObservable = (obj) => !!obj && typeof obj.subscribe === 'function';

class MetaLoader {
}
class MetaStaticLoader {
    constructor(providedSettings = {
        pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
        defaults: {}
    }) {
        this.providedSettings = providedSettings;
    }
    get settings() {
        return this.providedSettings;
    }
}

class MetaService {
    constructor(loader, title, meta) {
        this.loader = loader;
        this.title = title;
        this.meta = meta;
        this.settings = loader.settings;
        this.isMetaTagSet = {};
    }
    setTitle(title, override = false) {
        const title$ = title ? this.callback(title) : of('');
        title$.subscribe(res => {
            var _a;
            let fullTitle = '';
            if (!res) {
                const defaultTitle$ = ((_a = this.settings.defaults) === null || _a === void 0 ? void 0 : _a.title) ? this.callback(this.settings.defaults.title) : of('');
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
        const value$ = key !== 'og:locale' && key !== 'og:locale:alternate' ? this.callback(cur) : of(cur);
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
                return isPromise(value$) ? from(value$) : of(value$);
            }
            return value$;
        }
        return of(value);
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
MetaService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaService, deps: [{ token: MetaLoader }, { token: i2.Title }, { token: i2.Meta }], target: i0.ɵɵFactoryTarget.Injectable });
MetaService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: MetaLoader }, { type: i2.Title }, { type: i2.Meta }]; } });

class MetaGuard {
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
MetaGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaGuard, deps: [{ token: MetaService }], target: i0.ɵɵFactoryTarget.Injectable });
MetaGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaGuard });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.0", ngImport: i0, type: MetaGuard, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: MetaService }]; } });

const metaFactory = () => new MetaStaticLoader();
class MetaModule {
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

/*
 * Public API Surface of core
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MetaGuard, MetaLoader, MetaModule, MetaService, MetaStaticLoader, PageTitlePositioning, metaFactory };
//# sourceMappingURL=ngx-meta-core.js.map
