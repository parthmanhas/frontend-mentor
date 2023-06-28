import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { InvoiceComponent } from './invoice.component';
import { StatusComponent } from './../status/status.component';

const meta: Meta<InvoiceComponent> = {
    title: 'Invoice',
    component: InvoiceComponent,
    // subcomponents: { StatusComponent },
    tags: ['autodocs'],
    argTypes: {
        state: {
            options: ['paid', 'pending', 'draft'],
            control: { type: 'select' },
        }
    },
    decorators: [
        moduleMetadata({
            declarations: [StatusComponent]
        })
    ]
};

export default meta;
type Story = StoryObj<InvoiceComponent>;

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