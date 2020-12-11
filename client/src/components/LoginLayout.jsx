import InputBox from './InputBox'
import AlertBox from './AlertBox'
import { IdentificationIcon } from "./Icons"

const LoginLayout = ({ backgroundImageUrl, libraryLogo, library, organization, login, alertMessage, showAlert }) =>
	<div class="h-screen w-screen flex flex-row">
		{backgroundImageUrl && <div class="lg:flex-auto bg-blue-100 text-gray-200"
			style={{
				background: `url(${backgroundImageUrl}) center center`,
				backgroundSize: "cover"
			}}
		/>}
		<div class="flex-auto bg-gray-200 flex flex-col justify-center items-center">
			<div class="flex-grow flex flex-col justify-end mb-8 text-center">
				<div class="font-light text-3xl">
					Self-Checkout for {library}
				</div>
				<div class="font-bold text-lg uppercase">
					{organization}
				</div>
			</div>

			<div class="flex-shrink flex-row">
				<InputBox
					placeholder={"Scan your ID"}
					Icon={IdentificationIcon}
					onClick={login}
					autoFocus={true} />
			</div>
			<div class="flex-shrink">
				<AlertBox visible={showAlert}>
					{alertMessage}
				</AlertBox>
			</div>
			<div class="flex-grow flex flex-col justify-end w-full">
				{libraryLogo && (
					<div class="w-full bg-white flex flex-row justify-center">
						<img src={libraryLogo} class="max-h-32" alt={`${library} at ${organization} logo`} />
					</div>
				)}
			</div>
		</div>
	</div >

export default LoginLayout
