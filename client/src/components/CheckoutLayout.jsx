import PillBox from "./PillBox"
import {
	UserCircleIcon,
	BookOpenIcon
} from "./Icons"
import AlertBox from "./AlertBox"
import InputBox from "./InputBox"
import BookTable from "./BookTable"


const CheckoutLayout = ({ library, organization, userName, userLoans, userRequests, userFines, timeout, checkoutBook, books, showAlert, alertMessage }) =>
	<div class="h-screen w-screen flex flex-col">

		{/* <!-- Header Bar --> */}
		<div class="flex-shrink bg-blue-400 flex content-between items-center p-2 shadow-md" style={{ zIndex: 1 }}>

			{/* <!-- Library Name --> */}
			<div class="flex-auto text-gray-100 m-2">
				<div class="font-light text-2xl">
					{library}
				</div>
				<div class="font-extrabold text-sm uppercase">
					{organization}
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
				<PillBox
					value={timeout} />
			</div>
		</div>

		{/* <!-- Main Content --> */}
		<div class="flex-auto bg-gray-200 flex flex-col justify-center items-center">

			{/* <!-- Barcode Scanner --> */}
			<div class="flex-shrink w-3/4 mt-20">
				<InputBox Icon={BookOpenIcon} onClick={checkoutBook} />
			</div>

			{/* <!-- Alert Dialog --> */}
			<AlertBox visible={showAlert} >
				{alertMessage}
			</AlertBox>

			{/* <!-- Book Table --> */}
			<div class="flex-auto w-3/4 px-8 mt-2">
				<BookTable books={books} />
			</div>
		</div>
	</div>

export default CheckoutLayout