//import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker'
// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
// import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  imports: [
    NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule,
    DragDropModule, MatGridListModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    //MatMomentDateModule,
    SatDatepickerModule, SatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatBadgeModule, MatTabsModule,
    MatRadioModule, MatToolbarModule, MatSortModule, MatTableModule, MatPaginatorModule,
    MatDialogModule,
    MatMenuModule, MatChipsModule, MatAutocompleteModule,
    MatSnackBarModule, MatDividerModule, MatProgressSpinnerModule, MatListModule,
    MatButtonToggleModule
    // MatSliderModule, MatExpansionModule, MatSidenavModule
  ],
  exports: [
    NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule,
    DragDropModule, MatGridListModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    //MatMomentDateModule,
    SatDatepickerModule, SatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatBadgeModule, MatTabsModule,
    MatRadioModule, MatToolbarModule, MatSortModule, MatTableModule, MatPaginatorModule,
    MatDialogModule,
    MatMenuModule, MatChipsModule, MatAutocompleteModule,
    MatSnackBarModule, MatDividerModule, MatProgressSpinnerModule, MatListModule,
    MatButtonToggleModule
    // MatSliderModule, MatExpansionModule, MatSidenavModule,
  ],
  providers: [
  ],
})
export class MaterialModule {}
