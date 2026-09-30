var Module = {
  locateFile: function (file) {
    if (file.endsWith(".wasm")) return "./assets/wasm/" + file;
    if (file.endsWith(".data")) return "./assets/wasm/" + file;
    return file;
  },
};
Module.canvas = document.getElementById("canvas");

var script = document.createElement("script");
script.src = "./assets/wasm/app2.js";
script.async = true;
document.body.appendChild(script);

document.addEventListener("DOMContentLoaded", function () {
  function setNewConfiguration() {
    // Get values from each input
    const algorithmName = document.getElementById("algorithm-name").value;
    const collisions = document.getElementById("collisions").checked;
    const gravityGlobal = document.getElementById("gravity-global").checked;
    const gravityParticle = document.getElementById("gravity-particle").checked;
    const minSizePx = parseFloat(document.getElementById("minSize").value);
    const maxSizePx = parseFloat(document.getElementById("maxSize").value);

    // Display the values in the console (you can also display in an alert or a div)
    console.log("Setting configuration:");
    console.log("Algorithm:", algorithmName);
    console.log("Collisions:", collisions);
    console.log("Global gravity:", gravityGlobal);
    console.log("Gravity per particle:", gravityParticle);
    console.log("Min size in pixels:", minSizePx);
    console.log("Max size in pixels:", maxSizePx);

    Module.setMinSizeParam(minSizePx);
    Module.setMaxSizeParam(maxSizePx);
    Module.setCollisionsParam(collisions);
    Module.setGravityGlobalParam(gravityGlobal);
    Module.setGravityParticleParam(gravityParticle);
    Module.setAlgorithmParam(algorithmName);
  }

  const setConfigButton = document.getElementById("setConfigButton");

  console.log(setConfigButton.innerText);

  setConfigButton.addEventListener("click", setNewConfiguration);

  function changeValue(inputId, delta) {
    const inputElement = document.getElementById(inputId);
    let currentValue = parseInt(inputElement.value, 10); // Get the current value as an integer
    currentValue += delta; // Increase or decrease by delta value (1 or -1)
    inputElement.value = currentValue; // Set the new value
  }

  // Add event listeners for the buttons
  document
    .getElementById("decrease-maxSize")
    .addEventListener("click", function () {
      changeValue("maxSize", -1);
    });

  document
    .getElementById("increase-maxSize")
    .addEventListener("click", function () {
      changeValue("maxSize", 1);
    });

  document
    .getElementById("decrease-minSize")
    .addEventListener("click", function () {
      changeValue("minSize", -1);
    });

  document
    .getElementById("increase-minSize")
    .addEventListener("click", function () {
      changeValue("minSize", 1);
    });
});
