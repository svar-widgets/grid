<script>
	import { getData } from "../data";

	let { row, column } = $props();

	const employeesData = getData().employees;

	function getEmployees(data, value) {
		const result = [];

		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			if (value.indexOf(item.id) !== -1) result.push(item);
			if (result.length === value.length) break;
		}

		return result;
	}
	let employees = $derived(getEmployees(employeesData, row[column.id]));
</script>

{#if employees.length}
	<div class="employees">
		{#each employees as employee (employee.id)}
			<div class="employee">
				<div class="avatar">
					<img src={employee.avatar} alt="avatar" />
				</div>
				<span>{employee.label}</span>
			</div>
		{/each}
	</div>
{/if}

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
