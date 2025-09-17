import { Rest } from "@svar-ui/lib-data-provider";
import type { ActionMap } from "@svar-ui/lib-data-provider";
import type { TMethodsConfig } from "@svar-ui/grid-store";

export default class RestDataProvider<T> extends Rest<TMethodsConfig> {
	private _normalize: any;
	constructor(url: string, normalize?: any) {
		super(url);
		this._normalize = normalize;
	}
	getHandlers(): ActionMap<TMethodsConfig> {
		return {
			"add-row": {
				ignoreID: true,
				handler: (ev: TMethodsConfig["add-row"]) => {
					const d = this.send("", "POST", ev);
					if (!this._normalize) return d;
					return d.then(obj => {
						this._normalize(obj);
						return obj;
					});
				},
			},
			"delete-row": {
				handler: (ev: TMethodsConfig["delete-row"]) => {
					return this.send(`/${ev.id}`, "DELETE");
				},
			},
			"update-row": {
				handler: (ev: TMethodsConfig["update-row"]) => {
					return this.send(`/${ev.id}`, "PUT", ev);
				},
			},
			"update-cell": {
				handler: (ev: TMethodsConfig["update-cell"]) => {
					return this.send(`/${ev.id}`, "PATCH", {
						key: ev.column,
						value: ev.value.toString(),
					});
				},
			},
		};
	}

	getData(): Promise<T[]> {
		const d = this.send<T[]>("", "GET");
		if (!this._normalize) return d;

		return d.then(obj => {
			if (this._normalize) obj.forEach(this._normalize);
			return obj;
		});
	}
}
