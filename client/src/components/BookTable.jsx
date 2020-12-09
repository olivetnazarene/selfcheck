const BookTable = ({ books, rowLimit }) => {
    if (books.length === 0) {
        return null
    }

    const bookList = books.length > rowLimit + 1 ? books.slice(0, rowLimit) : books
    return (
        <table class="table-auto w-full">
            <thead class="uppercase text-xs font-bold text-blue-800">
                <tr>
                    <td class="px-2">Due Date</td>
                    <td class="px-2">Book</td>
                </tr>
            </thead>
            <tbody class="text-xl">
                {bookList.map(b =>
                    <tr key={b.barcode} class="border-b border-gray-400">
                        <td class="p-2 text-gray-500 text-xs">{b.dueDate}</td>
                        <td class="p-2 truncate" style={{ maxWidth: "50vw" }}>{b.bookString}</td>
                    </tr>
                )}
                {books.length > rowLimit + 1 ? <tr><td></td><td class="p-2 italic">{`and ${books.length - rowLimit} others...`}</td></tr> : null}
            </tbody>
        </table>
    )
}

export default BookTable
