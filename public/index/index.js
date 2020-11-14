function getSessionName() {
    fetch("/getsessionname")
        .then(result => result.json())
        .then(data => {
            if(data.data === undefined){
                $("#greeting").append("Hello stranger")
            }else{
                const username = data.data
                $("#greeting").append("Hello " + data.data)

            }
        })
}

getSessionName()
