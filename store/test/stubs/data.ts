type TDataType = "default" | "empty" | "tree" | "tree_short" | "filters";

export const defaultSizes = {
	rowHeight: 37,
	columnWidth: 160,
	headerHeight: 36,
	footerHeight: 36,
};

export const getData = (type?: TDataType) => {
	if (!type) type = "default";
	return { ...structuredClone(data[type]), sizes: defaultSizes };
};

export const shuffle = (arr: any[]) => {
	const array = [...arr];
	let currentIndex = array.length;

	while (currentIndex != 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
};

export const cols = [
	{
		id: "id",
		header: "",
	},
	{
		id: "name",
		header: "Name",
	},
	{
		id: "type",
		header: "Type",
	},
];

const data = {
	default: {
		columns: cols,
		data: [
			{
				id: 1,
				name: "Item 1",
				type: "Type 1",
			},
			{
				id: 2,
				name: "Item 2",
				type: "Type 1",
			},
			{
				id: 3,
				name: "Item 3",
				type: "Type 1",
			},
			{
				id: 4,
				name: "Item 4",
				type: "Type 2",
			},
			{
				id: 5,
				name: "Item 5",
				type: "Type 2",
			},
			{
				id: 6,
				name: "Item 6",
				type: "Type 2",
			},
		],
	},
	empty: {
		columns: cols,
		data: [
			{
				id: 1,
				name: "Item 1",
				type: "Type 1",
			},
			{
				id: 2,
				name: "",
				type: "Type 1",
			},
			{
				id: 3,
				type: "Type 1",
			},
			{
				id: 4,
				name: "Item 3",
				type: "Type 2",
			},
			{
				id: 5,
				name: "Item 2",
				type: "Type 2",
			},
			{
				id: 6,
				name: undefined,
				type: "Type 2",
			},
			{
				id: 7,
				name: null,
				type: "Type 3",
			},
			{
				id: 8,
				name: "Item 4",
				type: "Type 3",
			},
		],
	},
	tree: {
		tree: true,
		columns: cols,
		data: [
			{
				id: 1,
				name: "Parent 1",
				type: "Type 1",
				open: true,
				data: [
					{
						id: 2,
						name: "Kid 1",
						type: "Type 1",
					},
					{
						id: 3,
						name: "Kid 2",
						type: "Type 2",
					},
				],
			},
			{
				id: 4,
				name: "Parent 2",
				type: "Type 1",
				open: true,
				data: [
					{
						id: 5,
						name: "Kid 3",
						type: "Type 2",
						open: true,
						data: [
							{
								id: 6,
								name: "Grandkid 1",
								type: "Type 2",
							},
							{
								id: 7,
								name: "Grandkid 2",
								type: "Type 3",
								open: true,
								data: [
									{
										id: 8,
										name: "Great-grandkid 1",
										type: "Type 3",
										open: true,
										data: [
											{
												id: 9,
												name: "Great-great-grandkid 1",
												type: "Type 1",
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				id: 10,
				name: "Parent 3",
				type: "Type 2",
				open: true,
				data: [
					{
						id: 11,
						name: "Kid 4",
						type: "Type 1",
					},
					{
						id: 12,
						name: "Kid 5",
						type: "Type 2",
						open: true,
						data: [
							{
								id: 13,
								name: "Grandkid 3",
								type: "Type 1",
							},
							{
								id: 14,
								name: "Grandkid 4",
								type: "Type 3",
								open: true,
								data: [
									{
										id: 15,
										name: "Great-grandkid 2",
										type: "Type 2",
									},
									{
										id: 16,
										name: "Great-grandkid 3",
										type: "Type 1",
										open: true,
										data: [
											{
												id: 17,
												name: "Great-great-grandkid 2",
												type: "Type 2",
												open: true,
												data: [
													{
														id: 18,
														name: "Great-great-great-grandkid 1",
														type: "Type 3",
													},
													{
														id: 19,
														name: "Great-great-great-grandkid 2",
														type: "Type 1",
													},
												],
											},
										],
									},
								],
							},
							{
								id: 20,
								name: "Grandkid 5",
								type: "Type 2",
							},
							{
								id: 21,
								name: "Grandkid 6",
								type: "Type 2",
							},
						],
					},
					{
						id: 22,
						name: "Kid 6",
						type: "Type 2",
					},
					{
						id: 23,
						name: "Kid 7",
						type: "Type 1",
					},
					{
						id: 24,
						name: "Kid 8",
						type: "Type 3",
					},
					{
						id: 25,
						name: "Kid 9",
						type: "Type 3",
					},
				],
			},
		],
	},
	tree_short: {
		tree: true,
		columns: cols,
		data: [
			{
				id: 1,
				name: "Parent 1",
				type: "Type 2",
				open: true,
				data: [
					{
						id: 2,
						name: "Kid 1",
						type: "Type 3",
					},
					{
						id: 3,
						name: "Kid 2",
						type: "Type 2",
					},
					{
						id: 4,
						name: "Kid 3",
						type: "Type 2",
						data: [
							{
								id: 5,
								name: "Grandkid 1",
								type: "Type 1",
							},
							{
								id: 6,
								name: "Grandkid 2",
								type: "Type 2",
							},
							{
								id: 7,
								name: "Grandkid 3",
								type: "Type 2",
							},
						],
					},
					{
						id: 8,
						name: "Kid 4",
						type: "Type 1",
					},
				],
			},
			{
				id: 9,
				name: "Parent 2",
				type: "Type 1",
				open: true,
				data: [
					{
						id: 10,
						name: "Kid 5",
						type: "Type 3",
					},
					{
						id: 11,
						name: "Kid 6",
						type: "Type 1",
					},
					{
						id: 12,
						name: "Kid 7",
						type: "Type 2",
					},
				],
			},
			{
				id: 12,
				name: "Parent 3",
				type: "Type 2",
			},
		],
	},
	filters: {
		columns: [
			{
				id: "id",
				header: "",
			},
			{
				id: "name",
				header: { filter: "text" },
			},
			{
				id: "type",
				header: { filter: "text" },
			},
			{
				id: "season",
				header: {
					filter: "richselect",
					options: [
						{ id: 1, label: "spring" },
						{ id: 2, label: "spring" },
						{ id: 3, label: "spring" },
						{ id: 4, label: "spring" },
					],
				},
			},
		],
		data: [
			{
				id: 1,
				name: "Alex",
				type: "Type 1",
				season: 1,
			},
			{
				id: 2,
				name: "John",
				type: "Type 1",
				season: 2,
			},
			{
				id: 3,
				name: "Bob",
				type: "Type 1",
				season: 3,
			},
			{
				id: 4,
				name: "Mary",
				type: "Type 2",
				season: 4,
			},
			{
				id: 5,
				name: "Kate",
				type: "Type 2",
				season: 2,
			},
			{
				id: 6,
				name: "",
				type: "Type 2",
				season: 3,
			},
		],
	},
};
