
export function notFound(req,res,next) {
    res.status(404).json({error: "Route not found"})
}
export function errorHandler(err,req,res,next){
    console.error(err.message)
    res.status(err.status || 500).json({
        err: "Something wwent wrong"
    })
}