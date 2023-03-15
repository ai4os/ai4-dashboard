import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
  ]
})
export class MaterialModule {}