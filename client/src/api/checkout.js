import { baseUrl } from './apiConstants'

const checkoutUrl = ({ bookBarcode, userId }) =>
    `${baseUrl}/users/${userId}/loans?item_barcode=${bookBarcode}`

export default async function checkout({ bookBarcode, userId }) {
    if (!bookBarcode) {
        return {
            failureMessage: "Please enter a book barcode to checkout."
        }
    }
    else {
        try {
            const bookResponse = await fetch(checkoutUrl({ bookBarcode, userId }))
            const book = await bookResponse.json()
            console.log(book)

            if ("error" in book && book.error) {
                console.log("Loan Error")
                console.log(book)
                return {
                    failureMessage: book.error + ".<br/>Please see the circulation desk for more information."
                }
            }
            else {
                let dueDateObj = new Date(book.due_date)
                let dueDate = Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(dueDateObj)
                return {
                    barcode: bookBarcode,
                    author: "Fred",
                    title: book.title,
                    dueDate
                }
                prependBookToTable({
                    barcode,
                    title: data.title,
                    dueDate: dueDateText
                })
                sessionScans.push(barcode)
                returnToBarcode()
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