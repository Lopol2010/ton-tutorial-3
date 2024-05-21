import { useEffect, useState } from "react";


export function useAsyncInitialize<T, S>(func: () => Promise<T>, deps: S[] = []) {
    const [state, setState] = useState<T | undefined>();
    useEffect(() => {
        (async () => {
            setState(await func())
        })()
    }, deps)
    return state;
}