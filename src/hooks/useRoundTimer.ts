import { useEffect, useState } from "react";

export function useRoundTimer(startedAt: number | undefined) {
    const [state, setState] = useState<string>();
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (startedAt && startedAt > 0) {
                const timePassed = Date.now() / 1000 - startedAt;
                setState(timePassed > 60 ? "round time elapsed" : timePassed.toPrecision(3) + "");
            } else {
                setState('Waiting for first deposit in round...');
            }
        }, 6)
        return () => clearInterval(intervalId);
    }, [startedAt]);
    return state;
}