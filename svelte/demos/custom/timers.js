const timers = {};
export function timer(name) {
	timers[name] = new Date();
}

export function timerEnd(name) {
	return timers[name] ? new Date() - timers[name] : 0;
}
