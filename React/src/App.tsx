import type { ValidationCallbackData } from 'devextreme-react/common';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import DataGrid, {
  Column, CustomRule, Editing, RequiredRule,
} from 'devextreme-react/data-grid';
import type { DateBoxTypes } from 'devextreme-react/date-box';
import SelectBox, { type SelectBoxTypes } from 'devextreme-react/select-box';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import Validator from 'devextreme/ui/validator';
import { useCallback, useState } from 'react';
import './App.css';
import employees from './data';

const editingModes = [
  { text: 'Row', value: 'row' },
  { text: 'Form', value: 'form' },
  { text: 'Popup', value: 'popup' },
];

function App(): JSX.Element {
  const [editingMode, setEditingMode] = useState<'row' | 'form' | 'popup'>('row');

  const onEditorPreparing = useCallback((e: DataGridTypes.EditorPreparingEvent): void => {
    const mode = e.component.option('editing.mode') as string;
    const isGridCellMode = ['batch', 'cell', 'row'].includes(mode);

    if (e.dataField === 'BirthDate' && e.parentType === 'dataRow') {
      const defaultHandler = e.editorOptions.onValueChanged;

      e.editorOptions.onValueChanged = (args: DateBoxTypes.ValueChangedEvent): void => {
        defaultHandler(args);

        if (e.row?.rowIndex === undefined) return;

        const hireCell = e.component.getCellElement(e.row.rowIndex, 'HireDate');
        if (hireCell) {
          const validator = isGridCellMode
            ? (Validator.getInstance(hireCell) as Validator)
            : (Validator.getInstance(hireCell.querySelector('.dx-texteditor') as Element) as Validator);

          validator?.validate();
        }
      };
    }
  }, []);

  const hireDateValidationCallback = useCallback(
    (e: ValidationCallbackData): boolean => new Date(e.value) > new Date(e.data.BirthDate),
    [],
  );

  const handleModeChange = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    setEditingMode(e.value);
  }, []);

  return (
    <div className='demo-container'>
      <div className='options'>
        <div className='dx-fieldset'>
          <div className='dx-field'>
            <div className='dx-field-label'>Editing Mode</div>
            <div className='dx-field-value'>
              <SelectBox
                items={editingModes}
                displayExpr='text'
                valueExpr='value'
                value={editingMode}
                onValueChanged={handleModeChange}
              />
            </div>
          </div>
        </div>
      </div>

      <DataGrid dataSource={employees} keyExpr='ID' showBorders={true} onEditorPreparing={onEditorPreparing}>
        <Editing mode={editingMode} allowUpdating={true} allowAdding={true} allowDeleting={true} />

        <Column dataField='FirstName' />

        <Column dataField='BirthDate' dataType='date'>
          <RequiredRule />
        </Column>

        <Column dataField='HireDate' dataType='date'>
          <RequiredRule />
          <CustomRule
            message='Hire date cannot be earlier than birth date'
            reevaluate={true}
            validationCallback={hireDateValidationCallback}
          />
        </Column>
      </DataGrid>
    </div>
  );
}

export default App;
