import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ViewInvoiceDetailsComponent } from './view-invoice-details.component';
import { ViewInvoiceDetailsTableComponent } from '../view-invoice-details-table/view-invoice-details-table.component';

const meta: Meta<ViewInvoiceDetailsComponent> = {
    title: 'View Invoice Details',
    component: ViewInvoiceDetailsComponent,
    tags: ['autodocs'],
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: { type: 'select' },
        },
    },
    decorators: [
        moduleMetadata({
            declarations: [ViewInvoiceDetailsTableComponent],
        })
    ]
};

export default meta;
type Story = StoryObj<ViewInvoiceDetailsComponent>;

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