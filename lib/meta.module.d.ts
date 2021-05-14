import { ModuleWithProviders } from '@angular/core';
import { MetaStaticLoader } from './meta.loader';
import * as i0 from "@angular/core";
export declare const metaFactory: () => MetaStaticLoader;
export declare class MetaModule {
    static forRoot(configuredProvider?: any): ModuleWithProviders<MetaModule>;
    constructor(parentModule?: MetaModule);
    static ɵfac: i0.ɵɵFactoryDeclaration<MetaModule, [{ optional: true; skipSelf: true; }]>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MetaModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MetaModule>;
}
