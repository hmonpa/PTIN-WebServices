var ctx = document.getElementById("canvas").getContext("2d");
var filtro = document.getElementsByClassName("filtro");
var imgpass = new Image;
var imgdisp = new Image;
var imgocup = new Image;
var imgparada = new Image;
imgpass.src = "./img/pngwing.com.png";
imgdisp.src = "./img/cochedisponible.png";
imgocup.src = "./img/cocheocupado.png";
imgparada.src = "./img/cocheenparada.png";
var coches = []
var pasajeros = []

nodes_mapa(filtro[0].checked);
passengers_mapa(filtro[0].checked);

function nodes_mapa(booleano){
    if(booleano){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost:3000/api/nodes", true);
        xhttp.setRequestHeader("miclavesecreta", token.token);
        xhttp.send();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                let datos = JSON.parse(this.response);
                for(item of datos){
                    coches.push({
                        name: item.id,
                        x: item.location_x,
                        y: item.location_y
                    });
                    drawCoordinates(item.location_x, item.location_y, item.state);
                }
            }
        }
    }// this code is executed every 3000 milliseconds:
}

function passengers_mapa(booleano){
    if(booleano){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost:3000/api/passengers", true);
        xhttp.setRequestHeader("miclavesecreta", token.token);
        xhttp.send();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                let datos = JSON.parse(this.response);
                for(item of datos){
                    pasajeros.push({
                        name: item.id,
                        x: item.location_x,
                        y: item.location_y
                    });
                    drawCoordinatesPass(item.location_x, item.location_y);
                }
            }
        }
    }
}

function drawCoordinates(x,y,state){

    if(state == 1){
        ctx.drawImage(imgdisp , x ,y , 30,30);
    }
    else if(state == 2){
        ctx.drawImage(imgocup,x ,y, 30,30);
    }
    else if(state == 4){
        ctx.drawImage(imgparada,x ,y, 30,30);
    }
}

function drawCoordinatesPass(x,y){
    ctx.drawImage(imgpass,x ,y, 25,25)
}

$( document ).ready(function(){
        let bool1 = new Boolean (false);
        let bool2 = new Boolean (false);
        for(var i=0; i<filtro.length; ++i){
            filtro[i].addEventListener("click", function(){ 
                if(filtro[0].checked == true){
                    bool1 = true;
                    bool2 = true;
                    nodes_mapa(bool1);
                    passengers_mapa(bool2);
                }
                else if(filtro[1].checked==true){
                    bool1= true;
                    bool2 = false;
                    nodes_mapa(bool1);
                    passengers_mapa(bool2);
                }
                else if(filtro[2].checked==true){
                    bool1 = false;
                    bool2 = true;
                    nodes_mapa(bool1);
                    passengers_mapa(bool2);
                }
            }) 
        }
        setInterval(function() {
            nodes_mapa(bool1);
            passengers_mapa(bool2);
        }, 5000);
});
