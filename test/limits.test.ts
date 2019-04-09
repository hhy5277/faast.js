import test, { ExecutionContext } from "ava";
import { inspect } from "util";
import { CommonOptions, faast, Provider } from "../index";
import * as funcs from "./fixtures/functions";
import { title } from "./fixtures/util";

async function testTimeout(
    t: ExecutionContext,
    provider: Provider,
    options: CommonOptions
) {
    const lambda = await faast(provider, funcs, "./fixtures/functions", {
        ...options,
        timeout: 5,
        maxRetries: 0,
        gc: false
    });
    try {
        await t.throwsAsync(lambda.functions.spin(30 * 1000), /time/i);
    } finally {
        await lambda.cleanup();
    }
}

async function limitOk(t: ExecutionContext, provider: Provider, options: CommonOptions) {
    const lambda = await faast(provider, funcs, "./fixtures/functions", {
        ...options,
        timeout: 200,
        memorySize: 512,
        maxRetries: 0,
        gc: false
    });

    try {
        const bytes = 64 * 1024 * 1024;
        const rv = await lambda.functions.allocate(bytes);
        t.is(rv.elems, bytes / 8);
    } finally {
        await lambda.cleanup();
    }
}

async function limitFail(
    t: ExecutionContext,
    provider: Provider,
    options: CommonOptions
) {
    const lambda = await faast(provider, funcs, "./fixtures/functions", {
        ...options,
        timeout: 200,
        memorySize: 512,
        maxRetries: 0,
        gc: false
    });

    try {
        const bytes = 512 * 1024 * 1024;
        await t.throwsAsync(lambda.functions.allocate(bytes), /memory/i);
    } finally {
        lambda && (await lambda.cleanup());
    }
}

const configurations: [Provider, CommonOptions][] = [
    ["aws", { mode: "https" }],
    ["aws", { mode: "queue" }],
    ["local", { childProcess: true }],
    ["google", { mode: "https" }],
    ["google", { mode: "queue" }]
];

for (const [provider, config] of configurations) {
    const opts = inspect(config);
    test(title(provider, `memory under limit ${opts}`), limitOk, provider, config);
    if (provider === "google" && config.mode === "queue") {
        // Google in queue mode cannot detect OOM errors.
    } else {
        test(title(provider, `out of memory`, config), limitFail, provider, config);
    }
    test(title(provider, `timeout`, config), testTimeout, provider, config);
}
