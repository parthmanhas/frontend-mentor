import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { EditInvoiceTable } from './edit-invoice-table.component';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';

const meta: Meta<EditInvoiceTable> = {
    title: 'Edit Invoice Table',
    component: EditInvoiceTable,
    tags: ['autodocs'],
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: { type: 'select' },
        },
    },
    decorators: [
        moduleMetadata({
            declarations: [ButtonComponent, InputComponent],
        })
    ]
};

export default meta;
type Story = StoryObj<EditInvoiceTable>;

export const Light: Story = {
    args: {
        theme: 'light',
    },
};

export const Dark: Story = {
    args: {
        theme: 'dark',
    },
};