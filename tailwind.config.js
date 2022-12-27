const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{vue,ts,js}",
    ],
    theme: {
        extend: {
            fontSize: {
                '2xs': '0.6875rem',
                '3xs': '0.625rem',
                '4xs': '0.5625rem',
                '5xs': '0.5rem',
            },
            container: {
                center: true,
            },
            colors: {
                primary: {
                    lighten: 'rgba(var(--color-primary-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-primary), <alpha-value>)',
                    darken: 'rgba(var(--color-primary-darken), <alpha-value>)',
                },
                success: {
                    lighten: 'rgba(var(--color-success-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-success), <alpha-value>)',
                    darken: 'rgba(var(--color-success-darken), <alpha-value>)',
                },
                info: {
                    lighten: 'rgba(var(--color-info-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-info), <alpha-value>)',
                    darken: 'rgba(var(--color-info-darken), <alpha-value>)',
                },
                warning: {
                    lighten: 'rgba(var(--color-warning-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-warning), <alpha-value>)',
                    darken: 'rgba(var(--color-warning-darken), <alpha-value>)',
                },
                danger: {
                    lighten: 'rgba(var(--color-danger-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-danger), <alpha-value>)',
                    darken: 'rgba(var(--color-danger-darken), <alpha-value>)',
                },
                pending: {
                    lighten: 'rgba(var(--color-pending-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-pending), <alpha-value>)',
                    darken: 'rgba(var(--color-pending-darken), <alpha-value>)',
                },
                neutral: {
                    lighten: 'rgba(var(--color-neutral-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-neutral), <alpha-value>)',
                    darken: 'rgba(var(--color-neutral-darken), <alpha-value>)',
                },
                secondary: {
                    // lighten: 'rgba(var(--color-neutral-lighten), <alpha-value>)',
                    // DEFAULT: 'rgba(var(--color-neutral), <alpha-value>)',
                    // darken: 'rgba(var(--color-neutral-darken), <alpha-value>)',

                    lighten: colors.slate["300"],
                    DEFAULT: colors.slate["400"],
                    darken: colors.slate["500"],
                },
                muted: {
                    lighten: 'rgba(var(--color-muted-lighten), <alpha-value>)',
                    DEFAULT: 'rgba(var(--color-muted), <alpha-value>)',
                    darken: 'rgba(var(--color-muted-dark), <alpha-value>)',
                },
                dark: {
                    lighten: '#024064',
                    DEFAULT: '#082B45',
                    darken: '#051d2e',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'base',
        }),
    ],
}