import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MomentModule } from 'ngx-moment';
import { CopyFieldModule } from 'src/app/components/copy-field/copy-field.module';
import { FabModule } from 'src/app/components/fab/fab.module';
import { SettingsApiKeysComponent } from './settings-apikeys.component';
import { SettingsApiKeysRoutingModule } from './settings-apikeys.routing.module';

@NgModule({
  declarations: [SettingsApiKeysComponent],
  imports: [
    CommonModule,
    SettingsApiKeysRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatChipsModule,
    MomentModule,
    ClipboardModule,
    CopyFieldModule,
    FabModule,
  ],
})
export class SettingsApiKeysRouteModule {}