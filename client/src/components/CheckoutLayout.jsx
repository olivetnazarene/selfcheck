import PillBox from "./PillBox"
import {
	UserCircleIcon,
	BookOpenIcon
} from "./Icons"
import AlertBox from "./AlertBox"
import InputBox from "./InputBox"


const CheckoutLayout = ({ library, organization, userName, userLoans, userRequests, userFines, timeout, booksCheckedOut }) =>
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
				<InputBox Icon={BookOpenIcon} onClick={() => alert("yay")} />
				{/* <div class="flex">
					<div class="flex-none flex items-center m-5">
						<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
					</div>
					<input class="text-2xl bg-transparent outline-none w-full" placeholder=" Scan your book" />
					<a href="#" class="flex-none flex items-center m-2 p-2 rounded cursor-pointer bg-blue-400 text-gray-200 hover:bg-blue-300 hover:text-white hover:shadow-md focus:bg-blue-600 focus:shadow-inner">
						<svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					</a>
				</div> */}
			</div>

			{/* <!-- Alert Dialog --> */}
			<AlertBox visible={true} >
				The barcode you scanned does not exist. Please scan a book that is actually real.
			</AlertBox>

			{/* <!-- Book Table --> */}
			<div class="flex-auto w-3/4 px-8">
				{booksCheckedOut &&
					<table class="table-auto w-full">
						<thead class="uppercase text-sm font-bold">
							<tr>
								<td class="px-2 text-blue-800">Due Date</td>
								<td class="px-2 text-blue-800">Book</td>
							</tr>
						</thead>
						<tbody class="text-xl">
							{booksCheckedOut.map(b =>
								<tr key={b.title + b.author} class="border-b border-gray-400">
									<td class="p-2">{b.dueDate}</td>
									<td class="p-2">{b.title + " // " + b.author}</td>
								</tr>
							)}
						</tbody>
					</table>
				}
			</div>
		</div>
	</div>

export default CheckoutLayout