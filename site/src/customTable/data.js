export function getData() {
	const data = [
		{
			id: 1,
			taskName: "Design wireframes for a new feature in the mobile app",
			status: 1,
			assign: [1, 2],
			due: new Date(2024, 0, 14),
			tags: [1, 2, 3],
			open: true,
			data: [
				{
					id: 2,
					taskName: "Fix bugs related to user authentication",
					status: 2,
					assign: [1],
					due: new Date(2023, 11, 29),
					tags: [1, 3],
				},
				{
					id: 3,
					taskName:
						"Verify data accuracy in the user profile settings",
					status: 2,
					assign: [2],
					due: new Date(2023, 11, 30),
					tags: [2, 3],
				},
			],
		},

		{
			id: 4,
			taskName: "Research study",
			status: 3,
			assign: [3, 4],
			due: new Date(2024, 2, 14),
			tags: [4, 8, 5],
			open: true,
			data: [
				{
					id: 5,
					taskName: "Conduct user interviews to gather feedback",
					status: 3,
					assign: [3],
					due: new Date(2024, 11, 29),
					tags: [4, 5],
				},
				{
					id: 6,
					taskName:
						"Design wireframes for a new feature in the mobile app",
					status: 3,
					assign: [4],
					due: new Date(2024, 1, 8),
					tags: [4, 8],
				},
			],
		},
		{
			id: 7,
			taskName: "Product launch",
			status: 1,
			assign: [5, 6],
			due: new Date(2024, 0, 14),
			tags: [1, 6, 7],
			open: true,
			data: [
				{
					id: 8,
					taskName:
						"Optimize database queries and ensure database scalability",
					status: 1,
					assign: [5],
					due: new Date(2024, 0, 2),
					tags: [1, 7],
				},
				{
					id: 9,
					taskName:
						"Integrate third-party services and APIs for additional functionality and features",
					status: 1,
					assign: [6],
					due: new Date(2024, 0, 2),
					tags: [1, 6],
				},
			],
		},
	];

	const statuses = [
		{
			id: 1,
			name: "In progress",
			type: "primary",
		},
		{
			id: 2,
			name: "Done",
			type: "success",
		},
		{
			id: 3,
			name: "Not started",
			type: "disabled",
		},
	];

	const tags = [
		{
			id: 1,
			name: "Development",
			background: "#2667ff33",
			color: "#2667FF",
		},
		{
			id: 2,
			name: "QA",
			background: "#c026d333",
			color: "#C026D3",
		},
		{
			id: 3,
			name: "Website",
			background: "#5e4ddc33",
			color: "#5E4DDC",
		},
		{
			id: 4,
			name: "Design",
			background: "#22c55e33",
			color: "#22C55E",
		},
		{
			id: 5,
			name: "Research",
			background: "#ca8a0433",
			color: "#CA8A04",
		},
		{
			id: 6,
			name: "Frontend",
			background: "#75b71833",
			color: "#75B718",
		},
		{
			id: 7,
			name: "Backend",
			background: "#06b6d433",
			color: "#06B6D4",
		},
		{
			id: 8,
			name: "Mobile",
			background: "#ec489933",
			color: "#EC4899",
		},
	];

	const employees = [
		{
			id: 1,
			name: "Alice Smith",
			avatar: "./assets/avatars/Alice_Smith.png",
		},
		{
			id: 2,
			name: "John Doe",
			avatar: "./assets/avatars/John_Doe.png",
		},
		{
			id: 3,
			name: "Mary Johnson",
			avatar: "./assets/avatars/Mary_Johnson.png",
		},
		{
			id: 4,
			name: "Robert Williams",
			avatar: "./assets/avatars/Robert_Williams.png",
		},
		{
			id: 5,
			name: "Laura Turner",
			avatar: "./assets/avatars/Laura_Turner.png",
		},
		{
			id: 6,
			name: "Daniel Clark",
			avatar: "./assets/avatars/Daniel_Clark.png",
		},
	];

	return {
		data,
		statuses,
		tags,
		employees,
	};
}
