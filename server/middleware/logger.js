function logger(req,res,next){
    const start = Date.now()
    res.on('finish',()=>{
        const ms = Date.now - start
        console.log(   `${req.method}${req.originalURL} ${req.statusCode} ${ms}ms`)
    })
    next()
}
module.exports = logger