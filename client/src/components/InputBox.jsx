import { useRef } from "react"
import { ArrowCircleLeftIcon } from "./Icons"

const InputBox = ({ Icon, onClick }) => {
	const textInput = useRef()
	const callOnClick = () => {
		onClick(textInput.current.value)
		textInput.current.value = ""
	}
	return (
		<div class="flex bg-gray-100 rounded-lg border-blue-400 border-4">
			<div class="flex-none flex items-center m-5">
				<Icon classes={"w-8 h-8"} />
			</div>
			<input ref={textInput}
				class="text-2xl bg-transparent outline-none flex-grow"
				placeholder=" Scan your barcode"
				onKeyPress={key => {
					if (key.key === "Enter") {
						callOnClick()
					}
				}} />
			<a onClick={callOnClick} href="#" class="flex-none flex items-center m-2 p-2 rounded cursor-pointer bg-blue-400 text-gray-200 hover:bg-blue-500 hover:text-white hover:shadow-md active:bg-blue-600">
				<ArrowCircleLeftIcon classes="w-10 h-10" />
			</a>
		</div>
	)
}

export default InputBox