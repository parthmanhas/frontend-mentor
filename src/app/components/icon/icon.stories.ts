import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { IconComponent } from './icon.component';
import { HttpClientModule } from '@angular/common/http';

const meta: Meta<IconComponent> = {
    title: 'Icon',
    component: IconComponent,
    tags: ['autodocs'],
    argTypes: {
    },
    decorators: [
        moduleMetadata({
            imports: [HttpClientModule],
        }),
    ],
};

export default meta;
type Story = StoryObj<IconComponent>;

export const IconMedium: Story = {
    args: {
        path: '/icon-delete.svg',
        hoverColor: 'red'
    },
};