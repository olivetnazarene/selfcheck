const PillBox = ({ title, value }) =>
	<div class="flex items-center rounded-full border-2 border-blue-300 m-2 py-1 pl-3 pr-1 text-gray-300">
		<div class="font-extrabold text-xs uppercase">{title}</div>
		<div class="rounded-full w-8 h-8 bg-blue-300 flex justify-center items-center text-gray-100 ml-2">
			{value}
		</div>
	</div>

export default PillBox