import { FormGroup, FormControl, FormArray } from "@angular/forms"

export type TSubtask = FormGroup<{
    id: FormControl<string | null>,
    title: FormControl<string | null>,
    isCompleted: FormControl<boolean | null>,
    parentTaskId: FormControl<string | null>
    parentColumnId: FormControl<string | null>
    parentBoardId: FormControl<string | null>,
}>

export type TColumn = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>
}>

export type TSelectedOption = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>
}>

export type TTask = FormGroup<{
    id: FormControl<string | null>,
    title: FormControl<string | null>,
    description: FormControl<string | null>,
    subtasks: FormArray<TSubtask>
}>

export type TForm = {
    task: TTask,
    selectedOption: TSelectedOption,
    columns: FormArray<TColumn>,
}