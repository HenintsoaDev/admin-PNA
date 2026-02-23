import { ISubModule } from './ISubModule';

export interface IModule {
    code: string;
    hasOneSubModuleAction: boolean;
    icon: string;
    id: any;
    name: string;
    url: string;
    sous_modules?: ISubModule[];
    state: number;
}