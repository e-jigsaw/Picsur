import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  MultipleSysPreferencesResponse,
  SysPreferenceResponse,
  UpdateSysPreferenceRequest
} from 'picsur-shared/dist/dto/api/pref.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import {
  SysPreferences,
  SysPrefValueType
} from 'picsur-shared/dist/dto/syspreferences.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class SysprefService {
  private hasPermission = false;

  public get snapshot() {
    return this.sysprefObservable.getValue();
  }

  public get live() {
    return this.sysprefObservable;
  }

  private sysprefObservable = new BehaviorSubject<SysPreferenceResponse[]>([]);

  constructor(
    private api: ApiService,
    private permissionsService: PermissionService
  ) {
    this.onPermissions();
  }

  public async getPreferences(): AsyncFailable<SysPreferenceResponse[]> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.get(
      MultipleSysPreferencesResponse,
      '/api/pref/sys'
    );
    if (HasFailed(response)) {
      this.sync();
      return response;
    }

    this.sysprefObservable.next(response.preferences);
    return response.preferences;
  }

  public async getPreference(
    key: SysPreferences
  ): AsyncFailable<SysPreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.get(
      SysPreferenceResponse,
      `/api/pref/sys/${key}`
    );
    if (HasFailed(response)) {
      this.sync();
      return response;
    }

    this.updatePrefArray(response);
    return response;
  }

  public async setPreference(
    key: SysPreferences,
    value: SysPrefValueType
  ): AsyncFailable<SysPreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.post(
      UpdateSysPreferenceRequest,
      SysPreferenceResponse,
      `/api/pref/sys/${key}`,
      { value }
    );
    if (HasFailed(response)) {
      this.sync();
      return response;
    }

    this.updatePrefArray(response);
    return response;
  }

  private updatePrefArray(pref: SysPreferenceResponse) {
    const prefArray = this.snapshot;
    // Replace the old pref with the new one
    const index = prefArray.findIndex((i) => pref.key === i.key);
    if (index === -1) {
      const newArray = [...prefArray, pref];
      this.sysprefObservable.next(newArray);
    } else {
      const newArray = [...prefArray];
      newArray[index] = pref;
      this.sysprefObservable.next(newArray);
    }
  }

  private sync() {
    this.sysprefObservable.next(
      ([] as SysPreferenceResponse[]).concat(this.snapshot)
    );
  }

  private flush() {
    this.sysprefObservable.next([]);
  }

  @AutoUnsubscribe()
  private onPermissions() {
    return this.permissionsService.live.subscribe((permissions) => {
      this.hasPermission = permissions.includes(Permission.SysPrefManage);
      if (!this.hasPermission) {
        this.flush();
      }
    });
  }
}