export function findById(data: Record<string, any>[], id: string | number) {
	for (let i = 0; i < data.length; i++) {
		if (data[i].id === id) return data[i];
		if (data[i].data) {
			const res = findById(data[i].data, id);
			if (res) return res;
		}
	}
	return null;
}

export function extractPropsAndFlatten(
	obj: Record<string, any>,
	props: string[] = [],
	out: string[] | string[][] = []
) {
	if (props && props.length) {
		const propArr: string[] = [];
		props.forEach((p: string) => {
			if (typeof obj[p] !== "undefined") propArr.push(obj[p]);
		});
		if (propArr.length) (out as string[][]).push(propArr);
	} else if (typeof obj.name !== "undefined") out.push(obj.name);
	if (obj.data)
		obj.data.forEach((x: any) => extractPropsAndFlatten(x, props, out));
	return out;
}
