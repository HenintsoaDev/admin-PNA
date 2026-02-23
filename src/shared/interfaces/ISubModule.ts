import { IAction } from "./IAction";

export interface ISubModule {
  state: number;
    actions: IAction[];
    ​hasOneAction: boolean
    code: string;
    icon: string;
    id: number;
    name: string;
    url: string;
    sous_modules: ISubModule[];
    title:string
}