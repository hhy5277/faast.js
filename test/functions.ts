export function test() {
    return "Successfully called test function.";
}

export function hello(name: string) {
    return `Hello ${name}!`;
}

export function fact(n: number): number {
    return n <= 1 ? 1 : n * fact(n - 1);
}

export function concat(a: string, b: string) {
    return a + b;
}

export function error(a: string) {
    throw new Error(`Expected this error. Argument: ${a}`);
}

export function noargs() {
    return "successfully called function with no args.";
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function delayReject(ms: number) {
    return new Promise((_, reject) => setTimeout(reject, ms));
}

export function echo(n: number) {
    return n;
}

export async function async() {
    await delay(200);
    return "returned successfully from async function";
}

export function path(): Promise<string> {
    return delay(200).then(() => process.env.PATH || "no PATH variable");
}

export function emptyReject() {
    return Promise.reject();
}

export function rejected(): Promise<string> {
    return Promise.reject("This promise is intentionally rejected.");
}

export interface Timing {
    start: number;
    end: number;
}

export async function timer(delayMs: number): Promise<Timing> {
    const start = Date.now();
    await delay(delayMs);
    const end = Date.now();
    return { start, end };
}

export async function spin(ms: number): Promise<Timing> {
    const start = Date.now();
    while (true) {
        if (Date.now() - start >= ms) {
            break;
        }
    }
    const end = Date.now();
    return { start, end };
}

export function promiseArg(promise: Promise<any>) {
    return promise;
}

export function optionalArg(arg?: string) {
    return arg ? arg : "No arg";
}

export function consoleLog(str: string) {
    console.log(str);
}

export function consoleWarn(str: string) {
    console.warn(str);
}

export function consoleError(str: string) {
    console.error(str);
}

export function consoleInfo(str: string) {
    console.info(str);
}

export function processExit() {
    process.exit();
}
