exports.get404 = (req,res) => {
    //res.sendFile(path.join(rootDir,'views','404.html'))
    res.render('shop/404',{docTitle:"Not Found | 404",path:''})
    };