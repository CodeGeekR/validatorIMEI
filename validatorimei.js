/* La función toma un número como argumento, convierte sus dígitos en un arreglo 
y realiza una suma de verificación utilizando la fórmula de Luhn. 
Si el resultado de la suma es divisible por 10, el número es válido según la fórmula de Luhn 
y la función devuelve true. De lo contrario, devuelve false.*/

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

/*La función gsmaCheck valida si un número IMEI dado cumple con los rangos de números aprobados por la GSMA.*/

function gsmaCheck(imei) {
  var gsmaRanges = [
    [1, 1],
    [10, 19],
    [20, 29],
    [30, 39],
    [44, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 89],
    [90, 99],
  ];
  var prefix = parseInt(imei.slice(0, 2));
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
  if (!luhnCheck(imei) || !gsmaCheck(imei.slice(0, 2))) {
    return false;
  }
  return true;
}

// Funcion que agrega un evento onkeydown para el campo de entrada IMEI, se activa teclado Numerico. Bloquea ingreso de otras teclas.
imeiContainer.addEventListener("keydown", function (event) {
  // Solo permitir números, teclas de control y borrar
  if (
    !(
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Tab" ||
      event.key === "Control" ||
      event.key === "Meta" ||
      event.key === "Shift" ||
      (event.key >= "0" && event.key <= "9")
    )
  ) {
    event.preventDefault();
  }
});
imeiContainer.addEventListener("paste", function (event) {
  // Obtener texto del portapapeles
  const clipboardText = event.clipboardData.getData("text/plain");
  // Solo permitir números
  if (!/^[0-9]*$/.test(clipboardText)) {
    event.preventDefault();
  }
});
imeiContainer.addEventListener("input", function (event) {
  // Eliminar cualquier carácter no numérico ingresado
  const input = event.target.value;
  event.target.value = input.replace(/[^0-9]/g, "");
});

// Evento de click del botón "Validar"
validateBtn.addEventListener("click", function () {
  const imei = imeiInput.value.replace(/\D/g, "");

  if (validateIMEI(imei)) {
    resultContainer.innerText = "El IMEI es válido";
    resultContainer.style.color = "green";
    // Agregamos el fondo verde claro suave al mensaje de resultado
    resultContainer.style.backgroundColor = "#D4EDDA";
    imeiContainer.replaceWith(resultContainer);

    // Ocultar título "Call IMEI"
    const callIMEI = document.getElementById("callIMEI");
    callIMEI.style.display = "none";

    // Mostrar botón "Comprobar otro código"
    showCheckAnotherBtn();
  } else {
    resultContainer.innerText =
      "El IMEI ingresado es inválido. Por favor inténtelo nuevamente.";
    resultContainer.style.color = "red";
    resultContainer.style.backgroundColor = "mistyrose"; // Cambio de color de fondo rojo claro
    resultContainer.classList.add("show");
    if (resultContainer.parentNode !== null) {
      resultContainer.parentNode.removeChild(resultContainer);
    }
    imeiContainer.after(resultContainer);
  }
});

// Evento de click del botón "Comprobar otro código"
resetBtn.addEventListener("click", function () {
  // Mostrar class="imei-input-container" y el "imei-input" para que el usuario pueda ingresar otro código IMEI
  location.reload();

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
