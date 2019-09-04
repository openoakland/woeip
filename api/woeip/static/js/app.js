function showPassword() {
    var userPassInput = document.getElementById("id_password");
    if (userPassInput.type === "password") {
        userPassInput.type = "text";
    } else {
        userPassInput.type = "password";
    }
}