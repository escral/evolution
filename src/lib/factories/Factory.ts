export default abstract class Factory {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static create(...args: any[]) {
        throw new Error('Not implemented')
    }
}