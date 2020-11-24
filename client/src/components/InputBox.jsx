import { useRef } from "react"
import { ArrowCircleLeftIcon } from "./Icons"

const InputBox = ({ Icon, onClick }) => {
	const textInput = useRef()
	return (
		<div class="flex">
			<div class="flex-none flex items-center m-5">
				<Icon classes={"w-8 h-8"} />
			</div>
			<input ref={textInput}
				class="text-2xl bg-transparent outline-none"
				placeholder=" Scan your barcode" />
			<a onClick={() => onClick(textInput.current.value)} href="#" class="flex-none flex items-center m-2 p-2 rounded cursor-pointer bg-blue-400 text-gray-200 hover:bg-blue-300 hover:text-white hover:shadow-md focus:bg-blue-600 focus:shadow-inner">
				<ArrowCircleLeftIcon classes="w-10 h-10" />
			</a>
		</div>
	)
}

export default InputBox