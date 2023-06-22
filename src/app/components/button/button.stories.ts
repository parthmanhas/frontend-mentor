import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ButtonComponent } from './button.component';

// export default {
//     title: 'Button',
//     decorators: [
//         moduleMetadata({
//             declarations: [ButtonComponent],
//         }),
//     ],
// };

const meta: Meta<ButtonComponent> = {
    title: 'Button',
    component: ButtonComponent,
    tags: ['autodocs'],
    // render: (args: ButtonComponent) => ({
    //     props: {
    //         backgroundColor: null,
    //         ...args,
    //     },
    // }),
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: { type: 'select' },
        },
        style: {
            options: ['primary', 'secondary', 'tertiary', 'quaternary', 'danger'],
            control: { type: 'select' },
        },
        size: {
            options: ['small', 'medium', 'large'],
            control: { type: 'select' },
        },
        icon: {
            options: ['plus-circle', 'plus', 'none'],
            control: { type: 'select' },
        }
    },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
    args: {
        theme: 'light',
        style: 'primary',
        label: 'Button',
        size: 'medium'
    },
};

export const Secondary: Story = {
    args: {
        theme: 'light',
        style: 'secondary',
        label: 'Button',
        size: 'medium'
    },
};

export const Tertiary: Story = {
    args: {
        theme: 'light',
        style: 'tertiary',
        label: 'Button',
        size: 'medium'
    },
};

export const quaternary: Story = {
    args: {
        theme: 'light',
        style: 'quaternary',
        label: 'Button',
        size: 'medium'
    },
};

export const danger: Story = {
    args: {
        theme: 'light',
        style: 'danger',
        label: 'Button',
        size: 'medium'
    },
};


// export const Primary = () => ({
//     component: ButtonComponent,
//     props: {
//         theme: 'light',
//         style: 'primary',
//         icon: 'none',
//         onClickFn: action('Button clicked'),
//     },
//     template: `<app-button>Button</app-button>`
// });

// export const Secondary = () => ({
//     component: ButtonComponent,
//     props: {
//         theme: 'light',
//         style: 'secondary',
//         icon: 'plus',
//         onClickFn: action('Button clicked'),
//     },
//     template: `<app-button>Button</app-button>`
// });

// export const Tertiary = () => ({
//     component: ButtonComponent,
//     props: {
//         theme: 'dark',
//         style: 'tertiary',
//         icon: 'plus-circle',
//         onClickFn: action('Button clicked'),
//     },
//     template: `<app-button>Button</app-button>`
// });

// Add more stories for other styles and themes as needed
