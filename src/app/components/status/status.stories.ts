import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { StatusComponent } from './status.component';

// export default {
//     title: 'Button',
//     decorators: [
//         moduleMetadata({
//             declarations: [ButtonComponent],
//         }),
//     ],
// };

const meta: Meta<StatusComponent> = {
    title: 'Status',
    component: StatusComponent,
    tags: ['autodocs'],
    // render: (args: ButtonComponent) => ({
    //     props: {
    //         backgroundColor: null,
    //         ...args,
    //     },
    // }),
    argTypes: {
        state: {
            options: ['paid', 'pending', 'draft'],
            control: { type: 'select' },
        }
    },
};

export default meta;
type Story = StoryObj<StatusComponent>;

export const Pending: Story = {
    args: {
        state: 'pending',
        size: 'medium'
    },
};

export const Paid: Story = {
    args: {
        state: 'paid',
        size: 'medium'
    },
};

export const Draft: Story = {
    args: {
        state: 'draft',
        size: 'medium'
    },
};