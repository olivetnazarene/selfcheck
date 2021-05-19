import { baseUrl } from './apiConstants'

const checkoutUrl = ({ bookBarcode, userId }) =>
    `${baseUrl}/users/${userId}/loans?item_barcode=${bookBarcode}`

async function checkout({ bookBarcode, userId }) {
    console.log(bookBarcode, userId)
    if (!bookBarcode) {
        return {
            failureMessage: "Please enter a book barcode to checkout."
        }
    }
    else {
        try {
            const bookResponse = await fetch(checkoutUrl({ bookBarcode, userId }))
            const book = await bookResponse.json()

            if ("error" in book && book.error) {
                console.log("Loan Error")
                console.log(book)
                return {
                    failureMessage: book.error + ". Please see the circulation desk for more information."
                }
            }
            else {
                let dueDateObj = new Date(book.due_date)
                let dueDateString = Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(dueDateObj)
                return {
                    barcode: bookBarcode,
                    bookString: book.title, // "title" includes the author's name, hence "bookString"
                    dueDate: dueDateString,
                }
            }
        }
        catch (error) {
            console.error("Failed to loan book")
            console.error(error)
            return {
                failureMessage: "Could not checkout book. Please try again or ask for help at the circulation desk."
            }
        }
    }
}
export default checkout