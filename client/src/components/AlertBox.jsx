import { ExclamationSolidIcon } from "./Icons"

const AlertBox = ({ children, visible }) => [
	<style>{`
		.--hide-alert {
			opacity: 0;
			transform: translateY(-10px);
			transition: opacity 100ms ease-in-out,
						transform 100ms ease-in-out;
		}
		.--show-alert {
			opacity: 1;
			transform: translateY(0);
			transition: opacity 100ms ease-in-out,
						transform 100ms ease-in-out;
		}
	`}</style>,
	<div class={`flex flex-row items-center m-4 bg-red-300 rounded-lg border-2 border-red-800 p-2 ${visible ? "--show-alert" : "--hide-alert"}`}>
		<ExclamationSolidIcon classes="w-6 h-6 text-red-800" />
		<div class="mx-2 text-red-900">
			{children}
		</div>
	</div>]

export default AlertBox