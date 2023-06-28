import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
    title: 'Input',
    component: InputComponent,
    tags: ['autodocs'],
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: { type: 'select' },
        },
        size: {
            options: ['small', 'medium', 'large'],
            control: { type: 'select' },
        },
        weight: {
            options: ['normal', 'bold'],
            control: { type: 'select' },
        },
    }
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Light: Story = {
    args: {
        theme: 'light',
        size: 'medium',
        weight: 'normal',
        label: 'Label'
    },
};

export const Dark: Story = {
    args: {
        theme: 'dark',
        size: 'medium',
        weight: 'normal',
        label: 'Label'
    },
};