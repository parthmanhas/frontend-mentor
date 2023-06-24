import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ViewInvoiceDetailsTableComponent } from './view-invoice-details-table.component';

const meta: Meta<ViewInvoiceDetailsTableComponent> = {
    title: 'View Invoice Details Table',
    component: ViewInvoiceDetailsTableComponent,
    tags: ['autodocs'],
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: { type: 'select' },
        },
    },
};

export default meta;
type Story = StoryObj<ViewInvoiceDetailsTableComponent>;

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