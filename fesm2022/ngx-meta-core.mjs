import * as i0 from '@angular/core';
import { Injectable, inject, makeEnvironmentProviders } from '@angular/core';
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
    get settings() {
        return this.providedSettings;
    }
    constructor(providedSettings = {
        pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
        defaults: {},
    }) {
        this.providedSettings = providedSettings;
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
            let fullTitle = '';
            if (!res) {
                const defaultTitle$ = this.settings.defaults?.title ? this.callback(this.settings.defaults.title) : of('');
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
        const value$ = key !== 'og:locale' && key !== 'og:locale:alternate' ? this.callback(cur) : of(cur);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.5", ngImport: i0, type: MetaService, deps: [{ token: MetaLoader }, { token: i2.Title }, { token: i2.Meta }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.5", ngImport: i0, type: MetaService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.5", ngImport: i0, type: MetaService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: MetaLoader }, { type: i2.Title }, { type: i2.Meta }] });

function metaGuard(settings) {
    return (route, state) => {
        const metaSettings = settings ?? (route.hasOwnProperty('data') ? route.data['meta'] : undefined);
        inject(MetaService).update(state.url, metaSettings);
        return true;
    };
}

const metaFactory = () => new MetaStaticLoader();
function provideEnvironmentMeta(configuredProvider = {
    provide: MetaLoader,
    useFactory: metaFactory,
}) {
    return makeEnvironmentProviders([configuredProvider, MetaService]);
}

/*
 * Public API Surface of core
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MetaLoader, MetaService, MetaStaticLoader, PageTitlePositioning, metaFactory, metaGuard, provideEnvironmentMeta };
//# sourceMappingURL=ngx-meta-core.mjs.map
