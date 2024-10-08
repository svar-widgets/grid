<script>
	import { Cell } from "wx-svelte-grid";
	import { getData } from "./data";

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;

	const employeesData = getData().employees;

	$: employees = getEmployees(employeesData, row[col.id]);

	function getEmployees(data, value) {
		const result = [];

		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			if (value.indexOf(item.id) !== -1) result.push(item);
			if (result.length === value.length) break;
		}

		return result;
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	{#if employees.length}
		<div class="employees">
			{#each employees as employee (employee.id)}
				<div class="employee">
					<div class="avatar">
						<img src={employee.avatar} alt="avatar" />
					</div>
					<span>{employee.name}</span>
				</div>
			{/each}
		</div>
	{/if}
</Cell>

<style>
	.employees {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 8px;
	}
	.employees .employee {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.employees .avatar {
		height: 28px;
		width: 28px;
		border-radius: 50%;
	}
	.employees .avatar img {
		height: 100%;
		width: 100%;
		border-radius: 50%;
		object-fit: cover;
	}
</style>
