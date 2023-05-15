import { MetaSettings } from './models/meta-settings';
export declare abstract class MetaLoader {
    abstract get settings(): MetaSettings;
}
export declare class MetaStaticLoader implements MetaLoader {
    private readonly providedSettings;
    get settings(): MetaSettings;
    constructor(providedSettings?: MetaSettings);
}
