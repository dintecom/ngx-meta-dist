import { EnvironmentProviders, Provider } from '@angular/core';
import { MetaStaticLoader } from './meta.loader';
export declare const metaFactory: () => MetaStaticLoader;
export declare function provideEnvironmentMeta(configuredProvider?: Provider): EnvironmentProviders;
