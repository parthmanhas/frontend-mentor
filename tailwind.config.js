/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    screens: {
      'xxs': '320px',
      'xs': '475px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'cornflower-blue': {
          '50': '#f4f3ff',
          '100': '#ebe8ff',
          '200': '#d7d5ff',
          '300': '#bbb3ff',
          '400': '#9988fd',
          '500': '#7c5dfa',
          '600': '#6736f1',
          '700': '#5824dd',
          '800': '#491dba',
          '900': '#3d1a98',
          '950': '#230e67',
        },
        'shamrock': {
          '50': '#ecfdf5',
          '100': '#d0fbe6',
          '200': '#a6f4d2',
          '300': '#6ce9ba',
          '400': '#33d69f',
          '500': '#0dbc87',
          '600': '#03986e',
          '700': '#027a5b',
          '800': '#056049',
          '900': '#054f3e',
          '950': '#012d23',
        },
        'pizazz': {
          '50': '#fffbec',
          '100': '#fff7d3',
          '200': '#ffeba5',
          '300': '#ffda6d',
          '400': '#ffbe32',
          '500': '#ffa70a',
          '600': '#ff8f00',
          '700': '#cc6902',
          '800': '#a1510b',
          '900': '#82440c',
          '950': '#462004',
        },
        'wild-blue-yonder': {
          '50': '#f4f6f9',
          '100': '#ebeff4',
          '200': '#dae1eb',
          '300': '#c3cdde',
          '400': '#abb5ce',
          '500': '#959ebf',
          '600': '#858bb2',
          '700': '#6b7097',
          '800': '#585d7b',
          '900': '#4b4f64',
          '950': '#2c2e3a',
        },

        'fiord': {
          '50': '#f6f6f9',
          '100': '#ecedf2',
          '200': '#d5d7e2',
          '300': '#afb3ca',
          '400': '#848bac',
          '500': '#656c92',
          '600': '#494e6e',
          '700': '#424662',
          '800': '#393c53',
          '900': '#333647',
          '950': '#22232f',
        },

        'oxford-blue': {
          '50': '#f6f6f9',
          '100': '#ecedf2',
          '200': '#d4d6e3',
          '300': '#aeb3cb',
          '400': '#828aae',
          '500': '#636c94',
          '600': '#4e557b',
          '700': '#404564',
          '800': '#373b53',
          '900': '#323548',
          '950': '#212230',
        },

        'heliotrope': {
          '50': '#f4f2ff',
          '100': '#ebe8ff',
          '200': '#dad4ff',
          '300': '#beb2ff',
          '400': '#9277ff',
          '500': '#7f55fd',
          '600': '#7032f5',
          '700': '#6120e1',
          '800': '#511abd',
          '900': '#44189a',
          '950': '#280c69',
        },
        'mirage': {
          '50': '#f3f5fb',
          '100': '#e3e9f6',
          '200': '#cdd9f0',
          '300': '#abbfe5',
          '400': '#839fd7',
          '500': '#6680cb',
          '600': '#5267be',
          '700': '#4856ad',
          '800': '#3f498e',
          '900': '#373f71',
          '950': '#1e2139',
        },
        'ebony-clay': {
          '50': '#f3f5fb',
          '100': '#e3e9f6',
          '200': '#cedaef',
          '300': '#acc0e4',
          '400': '#84a0d6',
          '500': '#6783ca',
          '600': '#5469bc',
          '700': '#4959ac',
          '800': '#404a8d',
          '900': '#374071',
          '950': '#252945',
        },
        'selago': {
          '50': '#f0f2fd',
          '100': '#dfe3fa',
          '200': '#ced3f7',
          '300': '#b1b7f0',
          '400': '#9192e8',
          '500': '#7c76de',
          '600': '#6b5bd0',
          '700': '#5c4cb6',
          '800': '#4b4093',
          '900': '#403976',
          '950': '#272145',
        },
        'bali-hai': {
          '50': '#f4f6f9',
          '100': '#ebeff4',
          '200': '#dbe1ea',
          '300': '#c5cedc',
          '400': '#adb5cc',
          '500': '#97a0bd',
          '600': '#888eb0',
          '700': '#6d7295',
          '800': '#5a5e79',
          '900': '#4c5063',
          '950': '#2d2f39',
        },
        'ship-cove': {
          '50': '#f4f6fa',
          '100': '#e5e7f4',
          '200': '#d2d7eb',
          '300': '#b3bddd',
          '400': '#8e9bcc',
          '500': '#7e88c3',
          '600': '#6066b0',
          '700': '#5557a0',
          '800': '#494984',
          '900': '#3e406a',
          '950': '#292942',
        },
        'vulcan': {
          '50': '#f4f6f9',
          '100': '#dbe2ec',
          '200': '#b7c4d8',
          '300': '#8c9bbc',
          '400': '#63759e',
          '500': '#495a83',
          '600': '#394568',
          '700': '#313954',
          '800': '#2a3145',
          '900': '#262c3b',
          '950': '#0c0e16',
        },
        'burnt-sienna': {
          '50': '#fef2f2',
          '100': '#fde3e3',
          '200': '#fdcbcb',
          '300': '#faa7a7',
          '400': '#f47575',
          '500': '#ec5757',
          '600': '#d72b2b',
          '700': '#b52020',
          '800': '#961e1e',
          '900': '#7c2020',
          '950': '#430c0c',
        },
        'whisper': {
          '50': '#f8f8fb',
          '100': '#ebebf3',
          '200': '#d2d3e5',
          '300': '#abaece',
          '400': '#7e83b2',
          '500': '#5e6499',
          '600': '#4a4d7f',
          '700': '#3c3e68',
          '800': '#353757',
          '900': '#30314a',
          '950': '#202031',
        },
      }
    },
  },
  plugins: [],
}

