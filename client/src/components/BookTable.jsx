const BookTable = ({ books }) => books.length === 0 ? null :
    <table class="table-auto w-full">
        <thead class="uppercase text-xs font-bold text-blue-800">
            <tr>
                <td class="px-2">Due Date</td>
                <td class="px-2">Book</td>
            </tr>
        </thead>
        <tbody class="text-xl">
            {books.map(b =>
                <tr key={b.barcode} class="border-b border-gray-400">
                    <td class="p-2 text-gray-500 text-xs">{b.dueDate}</td>
                    <td class="p-2 truncate">{b.bookString}</td>
                </tr>
            )}
        </tbody>
    </table>

export default BookTable