function getSession() {
    fetch("/getsession")
        .then(result => result.json())
        .then(data => {
            if(data.username === undefined){
                $("#greeting").append("Hello stranger")
            }else{
                $("#greeting").append("Hello " + " " + data.username)

            }
        })
}
getSession()
