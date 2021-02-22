import PillBox from "./PillBox"
import {
	UserCircleIcon,
	BookOpenIcon
} from "./Icons"
import AlertBox from "./AlertBox"
import InputBox from "./InputBox"
import BookTable from "./BookTable"

const LogoutInstruction = () => (
	<div class="text-center text-2xl font-bold text-gray-400 opacity-50">
		To log out, scan your ID again.
	</div>
)

// This is the rgb value for tailwind's bg-blue-200 but with alpha
// for the booktable if it expands into the white logo area
const bg_blue_200_alpha_80 = "rgba(226, 232, 240, 0.8)"

const CheckoutLayout = ({ libraryLogo, library, organization, userName, userLoans, userRequests, userFines, timeout, timeLimit, checkoutBook, books, showAlert, alertMessage }) =>
	<div class="h-screen w-screen flex flex-col bg-gray-200">

		{/* <!-- Header Bar --> */}
		<div class="flex-shrink bg-blue-400 flex content-between items-center p-2 shadow-md" style={{ zIndex: 1 }}>

			{/* <!-- Library Name --> */}
			<div class="flex-auto text-gray-100 m-2">
				<div class="flex flex-col">
					<div class="font-light text-2xl">
						{library}
					</div>
					<div class="font-extrabold text-sm uppercase">
						{organization}
					</div>
				</div>
			</div>

			{/* <!-- User Details --> */}
			<div class="flex-auto flex flex-row justify-end items-center">
				<UserCircleIcon classes="w-10 h-10 m-2 text-blue-100" />

				<div class="text-2xl mr-4 text-white">
					{userName}
				</div>

				{/* <!-- State Pills --> */}
				<PillBox
					title={"Loans"}
					value={userLoans} />
				<PillBox
					title={"Requests"}
					value={userRequests} />
				<PillBox
					title={"Fines & Fees"}
					value={"$" + userFines} />
			</div>
		</div>

		{/* <!-- Main Content --> */}
		<div class="flex-auto flex flex-col justify-center items-center">

			{/* <!-- Barcode Scanner --> */}
			<div class="flex-shrink w-3/4 mt-20">
				<InputBox
					placeholder={"Scan your next item"}
					Icon={BookOpenIcon}
					onClick={checkoutBook}
					autoFocus={true} />
			</div>

			{/* <!-- Alert Dialog --> */}
			<AlertBox visible={showAlert} >
				{alertMessage}
			</AlertBox>

			{/* <!-- Book Table --> */}
			<div class="flex-auto w-3/4 px-8 mt-2 z-10">
				<div class="p-5 rounded" style={{ background: bg_blue_200_alpha_80 }}>
					{books.length === 0 ? <LogoutInstruction /> : null}
					<BookTable books={books} rowLimit={5} />
				</div>
			</div>
		</div>

		{/* <!-- Logout progress bar --> */}
		<div class={"fixed w-full bottom-0" + (libraryLogo ? " bg-white" : "")}>
			{libraryLogo && (
				<div class="w-full bg-white flex flex-row justify-center pt-2">
					<img src={libraryLogo} class="h-24 z-0" alt={`${library} at ${organization} logo`} />
				</div>
			)}
			<div class="bg-blue-400" style={{ width: (100 - timeout / timeLimit * 100) + "%" }}>
				<div class="text-blue-100 uppercase text-sm font-bold px-4 py-1 whitespace-nowrap">
					Logging out in {Math.round(timeout)} seconds
				</div>
			</div>
		</div>
	</div>

export default CheckoutLayout
