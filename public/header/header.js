function acctivateForm(form){
    if ($("#" + form).css("display") === "block") {
        $("#" + form).css("display", "none")
    } else {
        $("#" + form).css("display", "block")
    }
}

