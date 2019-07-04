function showPassword() {
    var userPassInput = document.getElementById("id_password");
    if (userPassInput.type === "password") {
        userPassInput.type = "text";
    } else {
        userPassInput.type = "password";
    }
}

function footerAlign(){
    $('footer').css('height', 'auto');
    var footerHeight = $('footer').outerHeight();
    $('body').css('padding-bottom', footerHeight);
    $('footer').css('height', footerHeight);
}

$(document).ready(()=>{
    footerAlign();
})

$(window).resize(()=>{
    footerAlign();
})
