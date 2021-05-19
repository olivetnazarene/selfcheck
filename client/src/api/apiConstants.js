const protocol = window.location.protocol + "//"
const hostname = window.location.hostname
const port = window.location.port
const baseUrl = port ? (protocol + hostname + ":" + port) : (protocol + hostname)

export {
    baseUrl
}