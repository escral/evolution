export default interface SelectOption {
    title: string,
    subtitle?: string,
    value: any,
    image?: string | null,
    group?: string,
    sort?: number,
    classes?: string,
}
