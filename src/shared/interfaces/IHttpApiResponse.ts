export interface IHttpApiResponse {
    code: number;
    data: [] | {[param: string]: any} | string | any;
    error: boolean;
    msg: string;
}