import { Meta, Title } from '@angular/platform-browser';
import { MetaLoader } from './meta.loader';
import { MetaRouteSettings } from './models/meta-route-settings';
import { MetaSettings } from './models/meta-settings';
import * as i0 from "@angular/core";
export declare class MetaService {
    readonly loader: MetaLoader;
    private readonly title;
    private readonly meta;
    protected readonly settings: MetaSettings;
    private readonly isMetaTagSet;
    constructor(loader: MetaLoader, title: Title, meta: Meta);
    setTitle(title?: string, override?: boolean): void;
    setTag(key: string, value: string): void;
    update(currentUrl: string, metaSettings?: MetaRouteSettings): void;
    removeTag(key: string): void;
    private callback;
    private getTitleWithPositioning;
    private updateTitle;
    private updateLocales;
    private updateTag;
    static ɵfac: i0.ɵɵFactoryDeclaration<MetaService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MetaService>;
}
