import { Observable } from "rxjs";
import { CloudSyncService } from "./cloud-sync.service";

export abstract class CloudSyncServiceProvider {
  abstract getByName(name: string): CloudSyncService;
  abstract get(): Observable<CloudSyncService>;
}