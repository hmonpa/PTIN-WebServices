

function guardarValor(){
    var localizadorvuelo=$("#input_localizador_index").val();
    localizadorvuelo=localizadorvuelo.toUpperCase();
    if(localizadorvuelo.length == 0 ){
       console.log('vacio');
       alert("Rellena todos los campos");
   }
   else{ 
       localStorage.setItem("localizadorvuelo",localizadorvuelo); 
       location.href = 'Vuelos_localizador.html';
   }
}

function valores_vuelos() {
    var origen=$("#inputOrigen").val();
    var destino=$("#inputDestino").val();
    var fecha=$("#inputFecha").val();
    localStorage.setItem("origen",origen);
    localStorage.setItem("destino",destino);
    localStorage.setItem("fechaVuelo",fecha);
 }