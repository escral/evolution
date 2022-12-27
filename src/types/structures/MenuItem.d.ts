export default interface MenuItem {
    text: string,
    onClick: (event: PointerEvent) => void,
    class?: string,
}