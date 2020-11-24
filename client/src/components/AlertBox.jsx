import { ExclamationSolidIcon } from "./Icons"

const AlertBox = ({ children }) =>
	<div class="flex flex-row items-center">
		<ExclamationSolidIcon classes="w-6 h-6 text-red-800" />
		<div class="mx-2 text-red-900">
			{children}
		</div>
	</div>

export default AlertBox