import { TID } from "@svar-ui/lib-state";
import type { IApi } from "../types";

export function handleAction(
	api: IApi & { _temp: { id: TID; cut: boolean }[] },
	action: string
) {
	const { selectedRows, data, focusCell } = api.getState();

	if (action !== "paste-row") api._temp = null;

	switch (action) {
		case "add-row": {
			if (selectedRows.length) {
				selectedRows.forEach(id =>
					api.exec("add-row", { row: {}, after: id })
				);
			} else api.exec("add-row", { row: {} });
			break;
		}
		case "add-row:before": {
			selectedRows.forEach(id =>
				api.exec("add-row", { row: {}, before: id })
			);
			break;
		}
		case "add-row:after": {
			selectedRows.forEach(id =>
				api.exec("add-row", { row: {}, after: id })
			);
			break;
		}
		case "open-editor": {
			if (focusCell && selectedRows.includes(focusCell.row)) {
				const column = api.getColumn(focusCell.column);
				api.exec("open-editor", {
					id: focusCell.row,
					column: column.editor ? focusCell.column : undefined,
				});
			} else {
				api.exec("open-editor", {
					id: selectedRows[0],
				});
			}
			break;
		}
		case "copy-row": {
			selectedRows.forEach(id => {
				if (!api._temp) api._temp = [];
				api._temp.push({ id, cut: false });
			});
			break;
		}
		case "cut-row": {
			selectedRows.forEach(id => {
				if (!api._temp) api._temp = [];
				api._temp.push({ id, cut: true });
			});
			break;
		}
		case "paste-row": {
			if (api._temp?.length) {
				const sortedTemp = [...api._temp].sort(
					(a, b) =>
						data.findIndex(d => d.id == b.id) -
						data.findIndex(d => d.id == a.id)
				);
				sortedTemp.forEach((temp: any, ti) => {
					selectedRows.forEach((id, ri) => {
						const ev = {
							id: temp.id,
							target: id,
							mode: "after" as const,
						};
						api.exec(temp.cut ? "move-item" : "copy-row", ev);

						if (!temp.cut) {
							api.exec("select-row", {
								id: ev.id,
								toggle: !!ti || !!ri,
							});
						}
					});
				});
			}
			break;
		}
		case "delete-row":
			selectedRows.forEach(r => api.exec("delete-row", { id: r }));
			break;
		case "move-item:up": {
			// sort rows according to their position in data
			const sortedRows = [...selectedRows].sort(
				(a, b) =>
					data.findIndex(d => d.id == a) -
					data.findIndex(d => d.id == b)
			);

			sortedRows.forEach(id => {
				api.exec("move-item", { id, mode: "up" });
			});
			break;
		}
		case "move-item:down": {
			// sort rows in reverse order according to their position in data
			const sortedRows = [...selectedRows].sort(
				(a, b) =>
					data.findIndex(d => d.id == b) -
					data.findIndex(d => d.id == a)
			);

			sortedRows.forEach(id => {
				api.exec("move-item", { id, mode: "down" });
			});
			break;
		}
		case "undo":
			api.exec("undo");
			break;
		case "redo":
			api.exec("redo");
			break;
	}
}
