const timers: Record<string, Date> = {};
export function timer(name: string) {
	timers[name] = new Date();
}

export function timerEnd(name: string) {
	return timers[name] ? new Date().valueOf() - timers[name].valueOf() : 0;
}
