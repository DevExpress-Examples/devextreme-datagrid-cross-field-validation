import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent, type DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import Validator from 'devextreme/ui/validator';
import type { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import type { DxDateBoxTypes } from 'devextreme-angular/ui/date-box';
import type { ValidationCallbackData } from 'devextreme-angular/common';
import { EmployeeModel, Service } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('grid', { static: false }) grid!: DxDataGridComponent;

  service: Service;

  employees: EmployeeModel[];

  editingModes = [
    { text: 'Row', value: 'row' },
    { text: 'Form', value: 'form' },
    { text: 'Popup', value: 'popup' },
  ];

  editingMode = 'row';

  constructor(service: Service) {
    this.service = service;
    this.employees = service.getEmployees();
  }

  changeEditingMode(e: DxSelectBoxTypes.ValueChangedEvent): void {
    this.grid.instance.option('editing.mode', e.value);
  }

  onInitNewRow(e: DxDataGridTypes.InitNewRowEvent): void {
    e.data.BirthDate = null;
    e.data.HireDate = null;
  }

  onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent): void {
    const mode = e.component.option('editing.mode') as string;
    const isGridCellMode = ['batch', 'cell', 'row'].includes(mode);

    if (e.dataField === 'BirthDate' && e.parentType === 'dataRow') {
      const defaultHandler = e.editorOptions.onValueChanged;

      e.editorOptions.onValueChanged = (args: DxDateBoxTypes.ValueChangedEvent): void => {
        defaultHandler(args);

        if (e.row?.rowIndex !== undefined) {
          const hireCell = e.component.getCellElement(e.row.rowIndex, 'HireDate');

          if (hireCell) {
            const validator = isGridCellMode ? (Validator.getInstance(hireCell) as Validator) : (Validator.getInstance(hireCell.querySelector('.dx-texteditor') as Element) as Validator);

            validator?.validate();
          }
        }
      };
    }
  }

  hireDateValidationCallback = (params: ValidationCallbackData): boolean => new Date(params.value) > new Date(params.data.BirthDate);
}
