exports.get404 = (req,res) => {
    //res.sendFile(path.join(rootDir,'views','404.html'))
    res.status(404).render('shop/404',{docTitle:"Not Found | 404",path:'',isAuthenticated:req.user})
    };


exports.get500 = (req,res) => {
    return res.status(500).render('shop/500',{
        docTitle:'500',
        path:'500',
        isAuthenticated:req.user
      })
}