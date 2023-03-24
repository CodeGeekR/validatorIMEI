function luhnCheck(num) {
  var arr = (num + "").split("").reverse();
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    var intVal = parseInt(arr[i]);
    if (i % 2 === 1) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }
  return sum % 10 === 0;
}

function gsmaCheck(imei) {
  var gsmaRanges = [
    [12000, 15999],
    [100000, 389999],
    [440000, 449999],
    [490000, 499999],
    [700000, 799999],
    [880000, 919999],
    [930000, 989999],
    [990000, 999999],
  ];
  var prefix = parseInt(imei.slice(0, 6));
  for (var i = 0; i < gsmaRanges.length; i++) {
    if (prefix >= gsmaRanges[i][0] && prefix <= gsmaRanges[i][1]) {
      return true;
    }
  }
  return false;
}

const imeiInput = document.getElementById("imei-input");
const counter = document.querySelector(".counter");
const validateBtn = document.getElementById("validate-btn");
const resetBtn = document.getElementById("reset-btn");
const imeiContainer = document.querySelector(".imei-input-container");
const resultContainer = document.createElement("div");
resultContainer.classList.add("result-container");

imeiInput.addEventListener("input", function () {
  const count = this.value.length;
  counter.innerText = `${count}/15`;
  if (count === 15) {
    validateBtn.disabled = false;
  } else {
    validateBtn.disabled = true;
  }
});

/* Función principal que valida el IMEI ingresado. 
Toma el IMEI como parámetro y lo valida mediante una expresión regular que verifica
si el IMEI consta de exactamente 15 caracteres numéricos. 
Luego realiza dos verificaciones adicionales, una utilizando el algoritmo de Luhn 
y otra utilizando una base de datos de GSMA, para asegurarse de que el IMEI sea válido. 
Si alguna de las verificaciones falla, la función devuelve false. 
Si todas las verificaciones son exitosas, devuelve true.
 */

function validateIMEI(imei) {
  const imeiRegex = /^[0-9]{15}$/;
  if (!imeiRegex.test(imei)) {
    return false;
  }
  if (!luhnCheck(imei) || !gsmaCheck(imei.slice(0, 6))) {
    return false;
  }
  return true;
}

// Evento de click del botón "Validar"
validateBtn.addEventListener("click", function () {
  const imei = imeiInput.value.replace(/\D/g, "");

  if (validateIMEI(imei)) {
    resultContainer.innerText = "El IMEI es correcto";
    resultContainer.style.color = "green";
    imeiContainer.replaceWith(resultContainer);

    // Mostrar botón "Comprobar otro código"
    showCheckAnotherBtn();
  } else {
    resultContainer.innerText =
      "El IMEI ingresado es inválido. Por favor inténtelo nuevamente.";
    resultContainer.style.color = "red";
    resultContainer.classList.add("show");
    if (resultContainer.parentNode !== null) {
      resultContainer.parentNode.removeChild(resultContainer);
    }
    imeiContainer.after(resultContainer);
  }
});

// Evento de click del botón "Comprobar otro código"
resetBtn.addEventListener("click", function () {
  // Mostrar class="imei-input-container" para que el usuario pueda ingresar otro código IMEI
  imeiContainer.style.display = "block";
  // Mostrar class="counter" para que el usuario pueda ver el contador de caracteres
  imeiInput.style.display = "block";
  counter.style.display = "block";

  // Limpiar el input
  imeiInput.value = "";
  // Deshabilitar botón "Validar"
  validateBtn.disabled = true;

  // Ocultar botón "Comprobar otro código" y mostrar botón "Validar"
  validateBtn.style.display = "block";
  resetBtn.style.display = "none";

  // Ocultar mensaje de resultado
  resultContainer.style.display = "none";
  // Ocultar mensaje de resultado y cuadro sombreado
  resultContainer.classList.remove("show");
});

// Función para mostrar el botón "Comprobar otro código"
function showCheckAnotherBtn() {
  validateBtn.style.display = "none";
  resetBtn.style.display = "block";
  // Mostrar mensaje de resultado y cuadro sombreado
  resultContainer.classList.add("show");
}
