export interface IService {
  getStatus(): Promise<string>;
  getWipeInfo(): Promise<string>;
}
