export interface TestField {
    // name: string;
    type: string;
    value?: string;
    multiValue?: string[];
    placeholder?: string;
    text?: string;
    collections?: TestField[];
}