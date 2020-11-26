import InputBox from './InputBox'
import AlertBox from './AlertBox'
import { IdentificationIcon } from "./Icons"

const LoginLayout = ({ backgroundImageUrl, library, organization, login, alertMessage, showAlert }) =>
	<div class="h-screen w-screen flex flex-row">
		<div class="flex-auto bg-blue-100 text-gray-200"
			style={{
				background: `url(${backgroundImageUrl}) center center`,
				backgroundSize: "cover"
			}}
		/>
		<div class="flex-auto bg-gray-200 flex flex-col justify-center items-center">
			<div class="mb-16 text-center">
				<div class="font-light text-3xl">
					Self-Checkout for {library}
				</div>
				<div class="font-bold text-lg uppercase">
					{organization}
				</div>
			</div>
			<div class="flex-shrink flex-row bg-gray-100 rounded-lg border-blue-400 border-4">
				<InputBox Icon={IdentificationIcon} onClick={login} />
			</div>
			<div class="flex-shrink">
				<AlertBox visible={showAlert}>
					{alertMessage}
				</AlertBox>
			</div>
		</div>
	</div>

export default LoginLayout