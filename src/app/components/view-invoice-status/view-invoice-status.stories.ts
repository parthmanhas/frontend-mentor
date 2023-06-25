import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ViewInvoiceStatusComponent } from './view-invoice-status.component';
import { StatusComponent } from '../status/status.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<ViewInvoiceStatusComponent> = {
    title: 'View Invoice Status',
    component: ViewInvoiceStatusComponent,
    tags: ['autodocs'],
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: { type: 'select' },
        },
        state: {
            options: ['paid', 'pending', 'draft'],
            control: { type: 'select' },
        }
    },
    decorators: [
        moduleMetadata({
            declarations: [StatusComponent, ButtonComponent]
        })
    ]
};

export default meta;
type Story = StoryObj<ViewInvoiceStatusComponent>;

export const Light: Story = {
    args: {
        state: 'paid',
        theme: 'light',
    },
};

export const Dark: Story = {
    args: {
        state: 'paid',
        theme: 'dark',
    },
};