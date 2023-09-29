export default interface Feature {
    apply(): Promise<void>;
    destroy(): Promise<any>;
    ready(): Promise<boolean>;
}