import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ArrayOrdinalComponent } from './components/array/array-ordinal.component';
import { ArrayComponent } from './components/array/array.component';
import { MaterialUsageComponent, MaterialUsageDialog } from './components/avc-special/material-usage.component';
import { SelectMeasureUnitComponent } from './components/avc-special/measure-unit-select.component';
import { BigexpandComponent } from './components/bigGroups/bigexpand.component';
import { BignotexpandComponent } from './components/bigGroups/bignotexpand.component';
import { BigoutsideComponent } from './components/bigGroups/bigoutside.component';
import { ButtonsComponent } from './components/bigGroups/buttons.component';
import { TableWithInputComponent } from './components/bigGroups/table-with-input.component';
// import { DetailsTableComponent } from './search-tables/details-table.component';
// import { DetailsTableGroupComponent } from './search-tables/details-table-group.component';
// import { NormalGroupTableComponent } from './normal-tables/normal-group-table.component';
// import { GroupTableSearchComponent } from './search-tables/group-table-search.component';
import { CalculateFewComponent } from './components/calculateFew/calculate-few.component';
import { DividerComponent } from './components/divider-text/divider.component';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { InputReadonlyComponent } from './components/inputs/input-readonly.component';
import { InputSelectComponent } from './components/inputs/input-select.component';
import { InputToPercentageComponent } from './components/inputs/input-to-percentage.component';
import { InputComponent } from './components/inputs/input.component';
import { PercentInputComponent } from './components/inputs/percent-input.component';
import { PopupformComponent, PopupformDialog } from './components/popupform/popupform.component';
import { CheckboxComponent } from './components/selects/checkbox.component';
import { DateComponent } from './components/selects/date.component';
import { RadiobuttonComponent } from './components/selects/radio-button.component';
import { SelectgroupComponent } from './components/selects/select-group.component';
import { SelectItemComponent } from './components/selects/select-item.component';
import { SelectMultipileComponent } from './components/selects/select-multipile.component';
import { SelectNormalMultipleComponent } from './components/selects/select-normal-multiple.component';
import { SelectNormalComponent } from './components/selects/select-normal.component';
import { SelectComponent } from './components/selects/select.component';
import { SelectLineComponent } from './components/selects/slecet-line.component';
import { UploadComponent } from './components/selects/upload.component';
import { JustShowComponent } from './components/tablesinput/justshow.component';
import { TableInfoComponent } from './components/tablesinput/tableinfo.component';
import { TableInfoGroupComponent } from './components/tablesinput/tableinfogroup.component';
import { TextarryComponent } from './components/textarry/textarry.component';
import { ForEachEditComponent } from './detailes/for-each-edit.component';
import { ShowDetailsTableGroupComponent } from './detailes/show-details-group-table.component';
import { ShowOrdinalComponent } from './detailes/show-details-ordinal.component';
import { ShowDetailsTableComponent } from './detailes/show-details-table.component';
// import { ExpandableTableComponent } from './search-tables/expandable-table.component';
// import { NormalTableComponent } from './normal-tables/normal-table.component';
import { ShowDetailsUpsideTableComponent } from './detailes/show-details-upside-table.component';
import { ShowDetailsComponent } from './detailes/show-details.component';
import { FormDirective } from './libraries/autofocus.directive';
import { MyDurationPickerDirective } from './libraries/duration.directive';
import { NumericDirective } from './libraries/numeric.directive';
import { PercentageDirective } from './libraries/percentage.directive';
import { PrintLazyLoadDirective } from './libraries/print-lazy-load.directive';
import { WeekPickerDirective } from './libraries/weekPicker.directive';
import { MaterialModule } from './material.module';
import { ConfirmationDialog } from './service/confirm-dialog.component';
import { TableCellPipe } from './service/table-cell.pipe';
import { DateRangeSelect } from './tables/date-range-select.component';
import { NormalDetailsComponent } from './tables/normal-details.component';
import { NormalGroupDetailsComponent } from './tables/normal-group-details.component';
import { SearchDetailsComponent } from './tables/search-details.component';
import { SearchExpandableComponent } from './tables/search-expanable.component';
import { SearchGroupDetailsComponent } from './tables/search-group-details.component';

@NgModule({
  declarations: [
    MaterialUsageComponent,
    MaterialUsageDialog,
    SelectMeasureUnitComponent,
    // ExpandableTableComponent,
    // NormalTableComponent,
    // DetailsTableGroupComponent,
    // NormalGroupTableComponent,
    // GroupTableSearchComponent,
    // DetailsTableComponent,

    NormalDetailsComponent,
    SearchDetailsComponent,
    SearchExpandableComponent,
    SearchGroupDetailsComponent,
    NormalGroupDetailsComponent,
    DateRangeSelect,
    

    FormDirective,
    NumericDirective,
    MyDurationPickerDirective,
    PercentageDirective,
    PrintLazyLoadDirective,
    WeekPickerDirective,
    
    ShowOrdinalComponent,
    ShowDetailsComponent,
    ShowDetailsTableComponent,
    ShowDetailsTableGroupComponent,
    ShowDetailsUpsideTableComponent,
    ForEachEditComponent,

    TableCellPipe,
    ConfirmationDialog,

    DynamicFieldDirective,
    DynamicFormComponent,

    InputComponent,
    InputReadonlyComponent,
    SelectComponent,
    SelectItemComponent,
    SelectMultipileComponent,
    SelectNormalComponent,
    SelectNormalMultipleComponent,
    SelectgroupComponent,
    SelectLineComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    TextarryComponent,
    DividerComponent,
    ArrayComponent,
    ArrayOrdinalComponent,
    UploadComponent,
    InputSelectComponent,
    InputToPercentageComponent,
    PercentInputComponent,

    TableWithInputComponent,
    BigexpandComponent,
    TableInfoComponent,
    TableInfoGroupComponent,
    JustShowComponent,
    ButtonsComponent,
    BignotexpandComponent,
    BigoutsideComponent,
    PopupformDialog, PopupformComponent,
    CalculateFewComponent,
  ],
  exports: [
    MaterialUsageComponent,
    MaterialUsageDialog,
    SelectMeasureUnitComponent,
    // ExpandableTableComponent,
    // NormalTableComponent,
    // DetailsTableComponent,
    // DetailsTableGroupComponent,
    // NormalGroupTableComponent,
    // GroupTableSearchComponent,

    NormalDetailsComponent,
    SearchDetailsComponent,
    SearchExpandableComponent,
    SearchGroupDetailsComponent,
    NormalGroupDetailsComponent,
    DateRangeSelect,
    

    FormDirective,
    NumericDirective,
    MyDurationPickerDirective,
    PercentageDirective,
    PrintLazyLoadDirective,
    WeekPickerDirective,
    
    ShowOrdinalComponent,
    ShowDetailsComponent,
    ShowDetailsTableComponent,
    ShowDetailsTableGroupComponent,
    ShowDetailsUpsideTableComponent,
    ForEachEditComponent,
    
    TableCellPipe,

    DynamicFieldDirective,
    DynamicFormComponent,

    InputComponent,
    InputReadonlyComponent,
    SelectComponent,
    SelectItemComponent,
    SelectMultipileComponent,
    SelectNormalComponent,
    SelectNormalMultipleComponent,
    SelectgroupComponent,
    SelectLineComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    TextarryComponent,
    DividerComponent,
    ArrayComponent,
    ArrayOrdinalComponent,
    UploadComponent,
    InputSelectComponent,
    InputToPercentageComponent,
    PercentInputComponent,

    TableWithInputComponent,
    BigexpandComponent,
    TableInfoComponent,
    TableInfoGroupComponent,
    JustShowComponent,
    ButtonsComponent,
    BignotexpandComponent,
    BigoutsideComponent,
    PopupformDialog, PopupformComponent,
    CalculateFewComponent,
    
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CommonModule,
    // MatTableExporterModule,
    // BrowserModule,
],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CommonModule,
    FlexLayoutModule,
    MatTableExporterModule.forRoot({xlsxLightWeight: true}),
    // BrowserModule,
  ],
  entryComponents: [
    MaterialUsageComponent,
    MaterialUsageDialog,
    SelectMeasureUnitComponent,

    
    InputComponent,
    InputReadonlyComponent,
    SelectComponent,
    SelectItemComponent,
    SelectMultipileComponent,
    SelectNormalComponent,
    SelectNormalMultipleComponent,
    SelectgroupComponent,
    SelectLineComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    TextarryComponent,
    DividerComponent,
    ArrayComponent,
    ArrayOrdinalComponent,
    UploadComponent,
    InputSelectComponent,
    InputToPercentageComponent,
    PercentInputComponent,

    TableWithInputComponent,
    BigexpandComponent,
    TableInfoComponent,
    TableInfoGroupComponent,
    JustShowComponent,
    ButtonsComponent,
    BignotexpandComponent,
    BigoutsideComponent,
    PopupformDialog, PopupformComponent,
    CalculateFewComponent,

    ConfirmationDialog,
  ],
  
})
export class SheardModule {}
