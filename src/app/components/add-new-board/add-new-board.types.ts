import { FormGroup, FormControl, FormArray } from "@angular/forms"

export type TColumn = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>,
    parentBoardId: FormControl<string | null>
}>

export type TForm = {
    id: FormControl<string | null>,
    name: FormControl<string | null>
    columns: FormArray<TColumn>
}