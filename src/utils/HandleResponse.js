class HandleResponse {
    constructor(statusCode, data, message = "Success!"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.sussess = true
    }
}

export default HandleResponse