import { FormGroup, FormControl, FormArray } from "@angular/forms"

export type TDropdown = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>,
    active: FormControl<boolean | null>
}>

export type TSubtask = FormGroup<{
    id: FormControl<string | null>,
    title: FormControl<string | null>,
    isCompleted: FormControl<boolean | null>
    parentTaskId: FormControl<string | null>,
    parentColumnId: FormControl<string | null>,
    parentBoardId: FormControl<string | null>
}>

export type TForm = {
    title: FormControl<string | null>,
    description: FormControl<string | null>,
    subtasks: FormArray<TSubtask>,
    dropdown: FormArray<TDropdown>,
}