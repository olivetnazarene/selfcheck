import { Component, createRef } from "react"
import { ArrowCircleLeftIcon } from "./Icons"

class InputBox extends Component {
	constructor(props) {
		super(props);
		this.textInput = createRef();
	}
	componentDidMount() {
		if (this.props?.autoFocus) {
			this.textInput.current.focus()
		}
	}
	onClick() {
		const value = this.textInput.current.value
		this.props.onClick(value)
		this.textInput.current.value = ""
		this.textInput.current.focus()
	}
	render() {
		const { Icon } = this.props
		return (
			<div class="flex bg-gray-50 rounded-lg border-blue-400 border-4" >
				<div class="flex-none flex items-center m-5">
					<Icon classes={"w-8 h-8"} />
				</div>
				<input ref={this.textInput}
					class="text-2xl bg-transparent outline-none flex-grow"
					placeholder={" " + this.props.placeholder}
					onKeyPress={key => {
						if (key.key === "Enter") {
							this.onClick()
						}
					}} />
				<button onClick={this.onClick.bind(this)} href="#" class="flex-none flex items-center m-2 p-2 rounded cursor-pointer bg-blue-400 text-gray-200 hover:bg-blue-500 hover:text-white hover:shadow-md active:bg-blue-600">
					<ArrowCircleLeftIcon classes="w-10 h-10" />
				</button>
			</div>
		)
	}
}

export default InputBox