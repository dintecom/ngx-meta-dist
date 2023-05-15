export type MetaRouteSettings = {
    disabled?: boolean;
    title?: string;
    override?: boolean;
} & {
    [key: string]: string;
};
