// Ohm's law calculator.
// The student fills in exactly two of voltage (V), current (I) and resistance (R).
// The tool works out the missing one, plus power (P = V × I), and shows worked steps.

(function () {
  var SIG_FIGS = 3;

  var QUANTITIES = {
    voltage: { symbol: "V", unit: "V", name: "Voltage" },
    current: { symbol: "I", unit: "A", name: "Current" },
    resistance: { symbol: "R", unit: "Ω", name: "Resistance" }
  };

  var form = document.getElementById("ohms-form");
  var clearButton = document.getElementById("clear-button");
  var result = document.getElementById("result");
  var inputs = {
    voltage: document.getElementById("voltage"),
    current: document.getElementById("current"),
    resistance: document.getElementById("resistance")
  };

  // ---------- Number formatting ----------

  // Round to 3 significant figures and drop trailing zeros (3.00 → 3).
  // Returns { text, rounded } where "rounded" is true if digits were lost.
  function formatNumber(value) {
    var r = Number(value.toPrecision(SIG_FIGS));
    var rounded = Math.abs(r - value) > Math.abs(value) * 1e-12;
    return { text: plainOrScientific(r), rounded: rounded };
  }

  // Show inputs as the student typed them (no rounding).
  function formatInput(value) {
    return plainOrScientific(value);
  }

  // Very large or very small numbers use scientific notation, e.g. 1.2 × 10⁶.
  function plainOrScientific(n) {
    var abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) {
      var exponent = Math.floor(Math.log10(abs));
      var mantissa = Number((n / Math.pow(10, exponent)).toPrecision(12));
      // Floating-point can give a mantissa of 10 (e.g. 9.99999…); fix it.
      if (Math.abs(mantissa) >= 10) {
        mantissa = mantissa / 10;
        exponent += 1;
      }
      return String(mantissa) + " × 10" + toSuperscript(exponent);
    }
    return String(n);
  }

  function toSuperscript(n) {
    var map = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
                "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
    return String(n).split("").map(function (c) { return map[c]; }).join("");
  }

  // ---------- Reading and checking the inputs ----------

  // Returns { values, missing } on success, or { error } with a friendly message.
  function readInputs() {
    var values = {};
    var filled = [];
    var empty = [];

    for (var key in inputs) {
      var input = inputs[key];
      var name = QUANTITIES[key].name.toLowerCase();

      // "badInput" means the browser couldn't read the text as a number.
      if (input.validity.badInput) {
        return { error: "The " + name + " value isn't a number. Please check it.", field: key };
      }

      if (input.value.trim() === "") {
        empty.push(key);
        continue;
      }

      var number = Number(input.value);
      if (!isFinite(number)) {
        return { error: "The " + name + " value isn't a number. Please check it.", field: key };
      }
      if (number <= 0) {
        return { error: "The " + name + " must be greater than zero.", field: key };
      }

      values[key] = number;
      filled.push(key);
    }

    if (filled.length < 2) {
      return { error: "Fill in two values. Leave empty only the one you want to find." };
    }
    if (filled.length > 2) {
      return { error: "All three values are filled in. Clear the one you want to find, then press Calculate." };
    }

    return { values: values, missing: empty[0] };
  }

  // ---------- Calculation ----------

  // Returns the steps to show, as a list of { title, lines }.
  function calculate(values, missing) {
    var V = values.voltage;
    var I = values.current;
    var R = values.resistance;
    var steps = [];
    var main;

    if (missing === "current") {
      I = V / R;
      main = step("Current (I)", "I = V ÷ R",
        "I = " + formatInput(V) + " V ÷ " + formatInput(R) + " Ω", I, "I", "A");
    } else if (missing === "resistance") {
      R = V / I;
      main = step("Resistance (R)", "R = V ÷ I",
        "R = " + formatInput(V) + " V ÷ " + formatInput(I) + " A", R, "R", "Ω");
    } else {
      V = I * R;
      main = step("Voltage (V)", "V = I × R",
        "V = " + formatInput(I) + " A × " + formatInput(R) + " Ω", V, "V", "V");
    }
    steps.push(main);

    // Power uses the unrounded values so rounding errors don't build up.
    var P = V * I;
    var vShown = missing === "voltage" ? formatNumber(V).text : formatInput(V);
    var iShown = missing === "current" ? formatNumber(I).text : formatInput(I);
    steps.push(step("Power (P)", "P = V × I",
      "P = " + vShown + " V × " + iShown + " A", P, "P", "W"));

    return steps;
  }

  // One worked step: formula, numbers substituted in, answer.
  // "≈" is used instead of "=" when the answer has been rounded.
  function step(title, formula, substituted, answer, symbol, unit) {
    var f = formatNumber(answer);
    var sign = f.rounded ? " ≈ " : " = ";
    return {
      title: title,
      lines: [formula, substituted, symbol + sign + f.text + " " + unit],
      rounded: f.rounded
    };
  }

  // ---------- Showing results ----------

  function showError(message, field) {
    clearResult();
    result.classList.add("result-error");
    var p = document.createElement("p");
    p.textContent = message;
    result.appendChild(p);
    result.hidden = false;
    if (field) {
      inputs[field].setAttribute("aria-invalid", "true");
      inputs[field].focus();
    }
  }

  function showSteps(steps) {
    clearResult();

    var heading = document.createElement("h2");
    heading.textContent = "Worked steps";
    result.appendChild(heading);

    var anyRounded = false;
    steps.forEach(function (s) {
      if (s.rounded) anyRounded = true;

      var block = document.createElement("div");
      block.className = "step";

      var title = document.createElement("h3");
      title.textContent = s.title;
      block.appendChild(title);

      s.lines.forEach(function (line, i) {
        var p = document.createElement("p");
        p.className = "step-line" + (i === s.lines.length - 1 ? " step-answer" : "");
        p.textContent = line;
        block.appendChild(p);
      });

      result.appendChild(block);
    });

    if (anyRounded) {
      var note = document.createElement("p");
      note.className = "note";
      note.textContent = "≈ means the answer is rounded to " + SIG_FIGS + " significant figures.";
      result.appendChild(note);
    }

    result.hidden = false;
  }

  function clearResult() {
    result.textContent = "";
    result.classList.remove("result-error");
    for (var key in inputs) {
      inputs[key].removeAttribute("aria-invalid");
    }
  }

  // ---------- Events ----------

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stay on this page instead of reloading it
    var read = readInputs();
    if (read.error) {
      showError(read.error, read.field);
      return;
    }
    showSteps(calculate(read.values, read.missing));
  });

  clearButton.addEventListener("click", function () {
    form.reset();
    clearResult();
    result.hidden = true;
    inputs.voltage.focus();
  });
})();
