import { FormGroup, FormControl, FormArray } from "@angular/forms"

export type TColumn = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>,
    parentBoardId: FormControl<string | null>,
    visible: FormControl<boolean | null>,
    delete: FormControl<boolean | null>
}>

export type TBoard = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>
}>

export type TForm = {
    board: TBoard,
    columns: FormArray<TColumn>
}