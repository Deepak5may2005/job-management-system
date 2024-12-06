class HandleError {
    constructor(statusCode, message = "Something Went Wrong!"){
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.sussess = false
    }
}

export default HandleError