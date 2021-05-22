import { Secret } from './secret';
import { Observable } from "rxjs";

export abstract class ImportService {
  abstract getDataToImport(): Observable<Secret[]>
}