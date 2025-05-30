export function getData() {
	const allData = [
		{
			id: 1,
			city: "Amieshire",
			country: 6,
			email: "Leora13@yahoo.com",
			firstName: "Ernest",
			lastName: "Schuppe",
			street: "Ratke Port",
			zipCode: "17026-3154",
			date: new Date("2023-09-23T07:57:40.195Z"),
			companyName: "Lebsack - Nicolas",
			stars: 820,
			followers: 70,
			newsletter: true,
			checked: 1,
			assigned: [1],
			user: 1,
		},
		{
			id: 2,
			city: "Gust",
			country: 4,
			email: "Mose_Gerhold51@yahoo.com",
			firstName: "Janis",
			lastName: "Vandervort",
			street: "Dickinson Keys",
			zipCode: "43767",
			date: new Date("2024-03-06T09:59:12.551Z"),
			companyName: "Glover - Hermiston",
			stars: 1200,
			followers: 170,
			checked: 1,
			assigned: [2],
			user: 2,
		},
		{
			id: 3,
			city: "Amieshire",
			country: 3,
			email: "Frieda.Sauer61@gmail.com",
			firstName: "Makenzie",
			lastName: "Bode",
			street: "Legros Divide",
			zipCode: "54812",
			date: new Date("2023-12-08T13:44:26.557Z"),
			companyName: "Williamson - Kassulke",
			stars: 610,
			followers: 170,
			checked: 1,
			assigned: [1],
			user: 1,
		},
		{
			id: 4,
			city: "Amieshire",
			country: 2,
			email: "Eloisa.OHara@hotmail.com",
			firstName: "Ciara",
			lastName: "Towne",
			street: "Schimmel Ramp",
			zipCode: "76315-2246",
			date: new Date("2023-07-19T12:54:30.994Z"),
			companyName: "Hilpert, Eichmann and Brown",
			stars: 5322,
			followers: 170,
			checked: 1,
			assigned: [4],
			user: 4,
		},
		{
			id: 5,
			city: "Amieshire",
			country: 2,
			email: "Brisa46@hotmail.com",
			firstName: "Suzanne",
			lastName: "Wolff",
			street: "Lemuel Radial",
			zipCode: "88870-3897",
			date: new Date("2024-02-23T17:11:53.875Z"),
			companyName: "Mayer - Considine",
			stars: 852,
			followers: 770,
			newsletter: true,
			checked: 1,
			assigned: [3],
			user: 4,
		},
		{
			id: 6,
			city: "Amieshire",
			country: 2,
			email: "Cody.Schultz56@gmail.com",
			firstName: "Alessandra",
			lastName: "Feeney",
			street: "Mosciski Estate",
			zipCode: "81514",
			date: new Date("2024-06-30T05:23:18.734Z"),
			companyName: "Nikolaus and Sons",
			stars: 3209,
			followers: 2780,
			assigned: [3],
			user: 3,
		},
		{
			id: 7,
			city: "Dejuan",
			country: 2,
			email: "Enrico_Beer@yahoo.com",
			firstName: "Margret",
			lastName: "Heller",
			street: "Gunner Drive",
			zipCode: "17423-9317",
			date: new Date("2024-03-13T21:09:47.253Z"),
			companyName: "Corwin, Maggio and Wintheiser",
			stars: 9920,
			newsletter: true,
			followers: 570,
			assigned: [2],
			user: 2,
		},
		{
			id: 8,
			city: "Schumm",
			country: 2,
			email: "Mitchel.Herman@yahoo.com",
			firstName: "Emiliano",
			lastName: "Moore",
			street: "Maria Junctions",
			zipCode: "33930-7081",
			date: new Date("2023-03-27T07:26:57.345Z"),
			companyName: "Gulgowski - Botsford",
			stars: 3820,
			followers: 880,
			assigned: [1],
			user: 1,
		},
		{
			id: 9,
			city: "Gihaven",
			country: 2,
			email: "Gaylord_Reichel16@yahoo.com",
			firstName: "Alessandra",
			lastName: "Smith",
			street: "Kali Spurs",
			zipCode: "01370",
			date: new Date("2024-01-24T22:11:53.835Z"),
			companyName: "Maggio LLC",
			stars: 330,
			followers: 590,
			assigned: [1],
			user: 1,
		},
		{
			id: 10,
			city: "Fechester",
			country: 2,
			email: "Eileen48@gmail.com",
			firstName: "Eldridge",
			lastName: "Bins",
			street: "Casper Squares",
			zipCode: "80025-1552",
			date: new Date("2023-07-20T05:59:45.630Z"),
			companyName: "Leffler, Cummerata and Price",
			stars: 923,
			followers: 704,
			assigned: [3],
			user: 3,
		},
		{
			id: 11,
			city: "Caleven",
			country: 6,
			email: "Rico_Nolan@hotmail.com",
			firstName: "Claude",
			lastName: "Hermiston",
			street: "Bode Pine",
			zipCode: "76773",
			date: new Date("2024-03-13T08:02:41.211Z"),
			companyName: "Heller, Rosenbaum and Lockman",
			stars: 421,
			followers: 403,
			checked: true,
			newsletter: true,
			assigned: [2],
			user: 2,
			avatar: "https://svar.dev/demos/grid/assets/avatars/Laura_Turner.png",
		},
		{
			id: 12,
			city: "Herzogmouth",
			country: 2,
			email: "Dawn_Metz@yahoo.com",
			firstName: "Clarabelle",
			lastName: "Ankunding",
			street: "Nolan Summit",
			zipCode: "04355",
			date: new Date("2023-07-09T09:07:34.744Z"),
			companyName: "Mante, Oberbrunner and Collins",
			stars: 8203,
			followers: 704,
			checked: true,
			newsletter: true,
			avatar: "https://svar.dev/demos/grid/assets/avatars/John_Doe.png",
		},
		{
			id: 13,
			city: "Eulaliabury",
			country: 4,
			email: "Ron.Franecki@gmail.com",
			firstName: "Hubert",
			lastName: "Boehm",
			street: "Anastacio Springs",
			zipCode: "91444",
			date: new Date("2024-04-22T16:37:24.331Z"),
			companyName: "Greenholt, Homenick and Considine",
			stars: 8209,
			followers: 909,
		},
		{
			id: 14,
			city: "West Meda",
			country: 2,
			email: "Hayley52@yahoo.com",
			firstName: "Vladimir",
			lastName: "Breitenberg",
			street: "Lula Port",
			zipCode: "04635",
			date: new Date("2023-09-26T01:25:23.057Z"),
			companyName: "Kshlerin - Pfeffer",
			stars: 8251,
			followers: 178,
			avatar: "https://svar.dev/demos/grid/assets/avatars/Robert_Williams.png",
		},
		{
			id: 15,
			city: "Eulaliabury",
			country: 2,
			email: "Duane.Rempel@hotmail.com",
			firstName: "Haylee",
			lastName: "Purdy",
			street: "Dena Walk",
			zipCode: "94111-0802",
			date: new Date("2023-11-26T16:36:38.472Z"),
			companyName: "Lemke, Mitchell and Harber",
			stars: 3099,
			followers: 707,
			assigned: [5],
			user: 5,
		},
		{
			id: 16,
			city: "Eulaliabury",
			country: 2,
			email: "Eddie_Bartell@hotmail.com",
			firstName: "Herminia",
			lastName: "Altenwerth",
			street: "Kshlerin Cape",
			zipCode: "86614-9727",
			date: new Date("2023-09-28T19:50:18.308Z"),
			companyName: "Gislason - Nicolas",
			stars: 8491,
			followers: 463,
			assigned: [5],
			user: 5,
			avatar: "https://svar.dev/demos/grid/assets/avatars/Mary_Johnson.png",
		},
		{
			id: 17,
			city: "Eulaliabury",
			country: 2,
			email: "Josephine_Legros@yahoo.com",
			firstName: "Erick",
			lastName: "Klein",
			street: "Megane Cliffs",
			zipCode: "42168",
			date: new Date("2023-04-02T05:03:42.377Z"),
			companyName: "Olson and Sons",
			stars: 9820,
			followers: 670,
		},
		{
			id: 18,
			city: "West Meda",
			country: 2,
			email: "Jared.Hudson@hotmail.com",
			firstName: "Lisandro",
			lastName: "Barton",
			street: "Torrance Union",
			zipCode: "19477",
			date: new Date("2023-08-01T14:24:45.209Z"),
			companyName: "Volkman and Sons",
			stars: 1220,
			followers: 708,
			assigned: [1],
			user: 1,
		},
		{
			id: 19,
			city: "Darrenport",
			country: 2,
			email: "Delpha.Tromp9@yahoo.com",
			firstName: "Ashton",
			lastName: "Daugherty",
			street: "Hermann Port",
			zipCode: "25133-9181",
			date: new Date("2023-07-29T09:49:39.424Z"),
			companyName: "Grady LLC",
			stars: 420,
			followers: 30,
			assigned: [1],
			user: 1,
		},
		{
			id: 20,
			city: "Janiyahaven",
			country: 2,
			email: "Ariel.Maggio9@yahoo.com",
			firstName: "Cassandra",
			lastName: "Schmitt",
			street: "Windler Lodge",
			zipCode: "87582-2944",
			date: new Date("2024-01-21T12:35:27.741Z"),
			companyName: "Ankunding Group",
			stars: 20,
			followers: 188,
			assigned: [3],
			user: 3,
		},
	];

	const treeData = [
		{
			id: 1,
			city: "Amieshire",
			country: 6,
			email: "Leora13@yahoo.com",
			firstName: "Ernest",
			lastName: "Schuppe",
			street: "Ratke Port",
			zipCode: "17026-3154",
			date: new Date("2023-09-23T07:57:40.195Z"),
			companyName: "Lebsack - Nicolas",
			stars: 820,
			followers: 70,
			newsletter: true,
			checked: 1,
			open: true,
			data: [
				{
					id: 5,
					city: "Gust",
					country: 4,
					email: "Mose_Gerhold51@yahoo.com",
					firstName: "Janis",
					lastName: "Vandervort",
					street: "Dickinson Keys",
					zipCode: "43767",
					date: new Date("2024-03-06T09:59:12.551Z"),
					companyName: "Glover - Hermiston",
					stars: 1200,
					followers: 170,
					checked: 1,
				},
				{
					id: 6,
					city: "Amieshire",
					country: 3,
					email: "Frieda.Sauer61@gmail.com",
					firstName: "Makenzie",
					lastName: "Bode",
					street: "Legros Divide",
					zipCode: "54812",
					date: new Date("2023-12-08T13:44:26.557Z"),
					companyName: "Williamson - Kassulke",
					stars: 610,
					followers: 170,
					checked: 1,
				},
			],
		},
		{
			id: 2,
			city: "Amieshire",
			country: 2,
			email: "Eloisa.OHara@hotmail.com",
			firstName: "Ciara",
			lastName: "Towne",
			street: "Schimmel Ramp",
			zipCode: "76315-2246",
			date: new Date("2023-07-19T12:54:30.994Z"),
			companyName: "Hilpert, Eichmann and Brown",
			stars: 5322,
			followers: 170,
			checked: 1,
			open: true,
			data: [
				{
					id: 7,
					city: "Amieshire",
					country: 2,
					email: "Brisa46@hotmail.com",
					firstName: "Suzanne",
					lastName: "Wolff",
					street: "Lemuel Radial",
					zipCode: "88870-3897",
					date: new Date("2024-02-23T17:11:53.875Z"),
					companyName: "Mayer - Considine",
					stars: 852,
					followers: 770,
					newsletter: true,
					checked: 1,
				},
				{
					id: 8,
					city: "Amieshire",
					country: 2,
					email: "Cody.Schultz56@gmail.com",
					firstName: "Alessandra",
					lastName: "Feeney",
					street: "Mosciski Estate",
					zipCode: "81514",
					date: new Date("2023-06-30T05:23:18.734Z"),
					companyName: "Nikolaus and Sons",
					stars: 3209,
					followers: 2780,
				},
				{
					id: 9,
					city: "Dejuan",
					country: 2,
					email: "Enrico_Beer@yahoo.com",
					firstName: "Margret",
					lastName: "Heller",
					street: "Gunner Drive",
					zipCode: "17423-9317",
					date: new Date("2024-03-13T21:09:47.253Z"),
					companyName: "Corwin, Maggio and Wintheiser",
					stars: 9920,
					newsletter: true,
					followers: 570,
				},
			],
		},
		{
			id: 3,
			city: "Schumm",
			country: 2,
			email: "Mitchel.Herman@yahoo.com",
			firstName: "Emiliano",
			lastName: "Moore",
			street: "Maria Junctions",
			zipCode: "33930-7081",
			date: new Date("2023-03-27T07:26:57.345Z"),
			companyName: "Gulgowski - Botsford",
			stars: 3820,
			followers: 880,
			open: true,
			data: [
				{
					id: 10,
					city: "Gihaven",
					country: 2,
					email: "Gaylord_Reichel16@yahoo.com",
					firstName: "Alessandra",
					lastName: "Smith",
					street: "Kali Spurs",
					zipCode: "01370",
					date: new Date("2024-01-24T22:11:53.835Z"),
					companyName: "Maggio LLC",
					stars: 330,
					followers: 590,
				},
				{
					id: 11,
					city: "Fechester",
					country: 2,
					email: "Eileen48@gmail.com",
					firstName: "Eldridge",
					lastName: "Bins",
					street: "Casper Squares",
					zipCode: "80025-1552",
					date: new Date("2023-07-20T05:59:45.630Z"),
					companyName: "Leffler, Cummerata and Price",
					stars: 923,
					followers: 704,
				},
				{
					id: 12,
					city: "Caleven",
					country: 6,
					email: "Rico_Nolan@hotmail.com",
					firstName: "Claude",
					lastName: "Hermiston",
					street: "Bode Pine",
					zipCode: "76773",
					date: new Date("2024-03-13T08:02:41.211Z"),
					companyName: "Heller, Rosenbaum and Lockman",
					stars: 421,
					followers: 403,
					checked: true,
					newsletter: true,
					assigned: [2],
				},
				{
					id: 13,
					city: "Herzogmouth",
					country: 2,
					email: "Dawn_Metz@yahoo.com",
					firstName: "Clarabelle",
					lastName: "Ankunding",
					street: "Nolan Summit",
					zipCode: "04355",
					date: new Date("2023-07-09T09:07:34.744Z"),
					companyName: "Mante, Oberbrunner and Collins",
					stars: 8203,
					followers: 704,
					checked: true,
					newsletter: true,
				},
			],
		},
		{
			id: 4,
			city: "Eulaliabury",
			country: 4,
			email: "Ron.Franecki@gmail.com",
			firstName: "Hubert",
			lastName: "Boehm",
			street: "Anastacio Springs",
			zipCode: "91444",
			date: new Date("2023-04-22T16:37:24.331Z"),
			companyName: "Greenholt, Homenick and Considine",
			stars: 8209,
			followers: 909,
			open: true,
			data: [
				{
					id: 14,
					city: "West Meda",
					country: 2,
					email: "Hayley52@yahoo.com",
					firstName: "Vladimir",
					lastName: "Breitenberg",
					street: "Lula Port",
					zipCode: "04635",
					date: new Date("2023-09-26T01:25:23.057Z"),
					companyName: "Kshlerin - Pfeffer",
					stars: 8251,
					followers: 178,
				},
				{
					id: 15,
					city: "Eulaliabury",
					country: 2,
					email: "Duane.Rempel@hotmail.com",
					firstName: "Haylee",
					lastName: "Purdy",
					street: "Dena Walk",
					zipCode: "94111-0802",
					date: new Date("2023-11-26T16:36:38.472Z"),
					companyName: "Lemke, Mitchell and Harber",
					stars: 3099,
					followers: 707,
					open: true,
					data: [
						{
							id: 17,
							city: "Eulaliabury",
							country: 2,
							email: "Eddie_Bartell@hotmail.com",
							firstName: "Herminia",
							lastName: "Altenwerth",
							street: "Kshlerin Cape",
							zipCode: "86614-9727",
							date: new Date("2023-09-28T19:50:18.308Z"),
							companyName: "Gislason - Nicolas",
							stars: 8491,
							followers: 463,
						},
						{
							id: 18,
							city: "Eulaliabury",
							country: 2,
							email: "Josephine_Legros@yahoo.com",
							firstName: "Erick",
							lastName: "Klein",
							street: "Megane Cliffs",
							zipCode: "42168",
							date: new Date("2023-04-02T05:03:42.377Z"),
							companyName: "Olson and Sons",
							stars: 9820,
							followers: 670,
							open: true,
							data: [
								{
									id: 19,
									city: "West Meda",
									country: 2,
									email: "Jared.Hudson@hotmail.com",
									firstName: "Lisandro",
									lastName: "Barton",
									street: "Torrance Union",
									zipCode: "19477",
									date: new Date("2023-08-01T14:24:45.209Z"),
									companyName: "Volkman and Sons",
									stars: 1220,
									followers: 708,
									open: true,
									data: [
										{
											id: 20,
											city: "Darrenport",
											country: 2,
											email: "Delpha.Tromp9@yahoo.com",
											firstName: "Ashton",
											lastName: "Daugherty",
											street: "Hermann Port",
											zipCode: "25133-9181",
											date: new Date(
												"2023-07-29T09:49:39.424Z"
											),
											companyName: "Grady LLC",
											stars: 420,
											followers: 30,
										},
									],
								},
							],
						},
					],
				},
				{
					id: 16,
					city: "Janiyahaven",
					country: 2,
					email: "Ariel.Maggio9@yahoo.com",
					firstName: "Cassandra",
					lastName: "Schmitt",
					street: "Windler Lodge",
					zipCode: "87582-2944",
					date: new Date("2024-01-21T12:35:27.741Z"),
					companyName: "Ankunding Group",
					stars: 20,
					followers: 188,
				},
			],
		},
	];

	const allColumns = [
		{ id: "id", width: 50 },
		{
			id: "city",
			width: 100,
			header: "City",
			footer: "City",
		},
		{
			id: "firstName",
			header: "First Name",
			footer: "First Name",
			width: 150,
		},
		{
			id: "lastName",
			header: "Last Name",
			footer: "Last Name",
			width: 150,
		},
		{ id: "email", header: "Email", footer: "Email" },
		{ id: "companyName", header: "Company", footer: "Company" },
		{ id: "stars" },
		{ id: "date" },
	];

	const treeColumns = [
		{
			id: "lastName",
			header: "Last Name",
			footer: "Last Name",
			flexgrow: 1,
			treetoggle: true,
			editor: "text",
			sort: true,
		},
		{
			id: "firstName",
			header: "First Name",
			footer: "First Name",
			width: 150,
			sort: true,
		},
		{
			id: "city",
			header: "City",
			footer: "City",
			width: 100,
			sort: true,
		},
	];

	const treeFixedColumns = [
		{
			id: "lastName",
			header: "Last Name",
			footer: "Last Name",
			width: 400,
			treetoggle: true,
			editor: "text",
			sort: true,
		},
		{
			id: "firstName",
			header: "First Name",
			footer: "First Name",
			width: 150,
			sort: true,
		},
		{
			id: "city",
			header: "City",
			footer: "City",
			width: 100,
			sort: true,
		},
	];

	const columns = allColumns.slice(0, 5);
	const data = allData.slice(10);

	const balance = [0.598, 1000.36, 45, 50, 0, 79, 138.1, 32, 11, -0.1];
	const clientData = data.map((item, i) => ({
		...item,
		balance: balance[i],
	}));

	const flexibleColumns = [
		{ id: "id", width: 50 },
		{ id: "city", header: "City", width: 160 },
		{ id: "firstName", header: "First Name", flexgrow: 1 },
		{ id: "lastName", header: "Last Name", flexgrow: 1 },
		{ id: "companyName", header: "Company", flexgrow: 2 },
	];

	const countries = [
		{ id: 1, label: "Poland" },
		{ id: 2, label: "Brasil" },
		{ id: 3, label: "USA" },
		{ id: 4, label: "Germany" },
		{ id: 5, label: "France" },
		{ id: 6, label: "Italy" },
		{ id: 7, label: "Spain" },
		{ id: 8, label: "Portugal" },
		{ id: 9, label: "Switzerland" },
		{ id: 10, label: "Ukraine" },
		{ id: 11, label: "Austria" },
	];

	const columnsSpans = [
		{ id: "id", width: 50, footer: { text: "All users", colspan: 7 } },
		{
			id: "firstName",
			header: [
				{ text: "Main client info", colspan: 5 },
				{ text: "User", colspan: 2 },
				{ text: "First Name" },
			],
			width: 150,
			resize: true,
			sort: true,
		},
		{
			id: "lastName",
			header: ["", "", "Last Name"],
			width: 150,
			resize: true,
			sort: true,
		},
		{
			id: "email",
			header: ["", { text: "Email", rowspan: 2, css: "center" }],
			resize: true,
			sort: true,
		},
		{
			id: "companyName",
			header: [
				"",
				{ text: "Company", colspan: 2, css: "center" },
				{ text: "Name" },
			],
			resize: true,
			sort: true,
			// flexgrow: 1
		},
		{
			id: "city",
			width: 100,
			// flexgrow: 1,
			header: ["", "", "City"],
			sort: true,
		},
		{ id: "stars", header: "Stars" },
		{
			id: "date",
			template: obj => obj.toDateString(),
			header: "Joined",
			footer: { text: data.length, css: "right" },
		},
	];

	const users = [
		{ id: 1, label: "Alex" },
		{ id: 2, label: "John" },
		{ id: 3, label: "Bob" },
		{ id: 4, label: "Mary" },
		{ id: 5, label: "Kate" },
	];

	const collapsibleColumns = mode => {
		if (typeof mode !== "string") mode = true;

		return [
			{
				id: "id",
				width: 50,
				footer: { text: "All users", colspan: 7 },
				sort: true,
			},
			{
				id: "firstName",
				header: [
					{
						text: "Main client info",
						colspan: 5,
						collapsible: mode,
					},
					{ text: "User", colspan: 2, collapsible: mode },
					{ text: "First Name" },
				],
				width: 150,
				sort: true,
			},
			{
				id: "lastName",
				header: ["", "", "Last Name"],
				width: 150,
			},
			{
				id: "email",
				header: [
					"",
					{
						text: "Email",
						rowspan: 2,
						css: "center",
					},
					"",
				],
			},
			{
				id: "companyName",
				header: [
					"",
					{
						text: "Company",
						colspan: 2,
						collapsible: mode,
						collapsed: true,
					},
					{ text: "Name" },
				],
			},
			{
				id: "city",
				width: 100,
				header: ["", "", "City"],
			},
			{ id: "stars", header: "Stars", width: 80 },
			{
				id: "date",
				template: obj => obj.toDateString(),
				header: "Joined",
				footer: { text: data.length, css: "right" },
			},
		];
	};
	const columnsVertical = allColumns.slice(0, 6).map(col => ({
		...col,
		header: { text: col.header, vertical: true },
		footer: { text: col.footer, vertical: true },
	}));

	const columnsSpansVertical = [
		{ id: "id", width: 50, footer: { text: "All users", colspan: 7 } },
		{
			id: "firstName",
			header: [
				{ text: "Main client info", colspan: 5 },
				{ text: "User", colspan: 2 },
				{ text: "First Name", vertical: true },
			],
			width: 50,
		},
		{
			id: "lastName",
			header: ["", "", { text: "Last Name", vertical: true }],
			width: 150,
		},
		{
			id: "email",
			header: [
				"",
				{ text: "Email with long text", vertical: true, rowspan: 2 },
			],
		},
		{
			id: "companyName",
			header: ["", { text: "Company", colspan: 2 }, { text: "Name" }],
		},
		{
			id: "city",
			width: 100,
			header: ["", "", "City"],
		},
		{
			id: "stars",
			header: { text: "Stars with long long text", vertical: true },
			width: 50,
		},
		{
			id: "date",
			template: obj => obj.toDateString(),
			header: "Joined",
			footer: { text: data.length, css: "right" },
		},
	];
	const clientColumns = columnsSpans.toSpliced(6, 1, {
		id: "balance",
		header: "Balance",
		template: v => v.toLocaleString(),
	});
	clientColumns[0].width = 80;
	clientColumns[0].template = v => v.toString().padStart(5, "0");

	return {
		data,
		users,
		allData,
		treeData,
		clientData,
		columns,
		allColumns,
		flexibleColumns,
		treeColumns,
		treeFixedColumns,
		countries,
		columnsSpans,
		collapsibleColumns,
		columnsVertical,
		columnsSpansVertical,
		clientColumns,
	};
}

export function repeatData(n) {
	var out = [];
	while (out.length < n) out = out.concat(getData().allData);

	out = out.map((x, i) => ({ ...x, id: i + 1 }));
	return out.slice(0, n);
}

const commonTemplate = (v, row, col) => row[col.dataId || col.id];
export function repeatColumns(n) {
	var out = [];
	let round = 0;
	let base = getData().allColumns;

	while (out.length < n) {
		out = out.concat(
			base.map(col => {
				return round
					? {
							...col,
							dataId: col.id,
							id: col.id + "_" + round,
							template: commonTemplate,
						}
					: col;
			})
		);
		round++;
	}

	out[0].width = 100;
	return out.slice(0, n);
}

export function getBackend() {
	const columns = [
		{
			id: "name",
			header: "Title",
			flexgrow: 1,
			sort: true,
			editor: "text",
		},
		{
			id: "year",
			header: "Year",
			width: 100,
			sort: true,
			editor: "text",
		},
		{
			id: "votes",
			header: "Votes",
			width: 100,
			sort: true,
			editor: "text",
		},
	];

	return { columns };
}
