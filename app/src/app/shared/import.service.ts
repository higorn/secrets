import { Secret } from '../secrets/shared/secret';
import { Observable } from "rxjs";

export abstract class ImportService {
  abstract isAvailable(): boolean;
  abstract getDataToImport(): Observable<Secret[]>
  abstract openBrowser(): Observable<any>
}