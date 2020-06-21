sessionStorage.clear();

// Deshabilitar botón de atrás para no volver del login sin autenticación.
function nobackbutton(){	
    window.location.hash="no-back-button";
    window.location.hash="Again-No-back-button" //chrome
    window.onhashchange=function(){
        window.location.hash="no-back-button";
     }
}

//Detección de mayúsculas para la contraseña.

document.addEventListener('keydown', function( event ) {
    var mayus = event.getModifierState && event.getModifierState( 'CapsLock' );
    console.log( mayus ); //que será verdadero cuando presiones Bloq Mayus
    if(mayus){
        $("#mayus").css("visibility", "visible")
    }
    else{
        $("#mayus").css("visibility", "hidden")
    }
});

/* Mostrar contraseña*/

function mostrarContrasena(){
    var tipo = document.getElementById("pass");
    if(tipo.type == "password"){
        tipo.type = "text";
    }else{
        tipo.type = "password";
    }
}

/* POST*/

function entra(){
    var user = document.getElementById("usuario").value;
    var password = document.getElementById("pass").value;
    let xhttp = new XMLHttpRequest;
    xhttp.open('POST', 'http://localhost:3000/api/login', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        id: user,
        password: password
    }));

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let datos = JSON.parse(this.response);
            sessionStorage.setItem("token", JSON.stringify(datos))
            location.href = "./indexAdministrador.html";
        }
        else if (this.readyState == 4 && this.status !=200){
            console.log(this.response);
            document.getElementById("alerta").style.display ="block";
        }
    };
}
