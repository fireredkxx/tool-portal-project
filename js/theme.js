// Light/dark theme toggle, shared by every page.
// Load this in <head> (without "defer") so the saved theme is applied
// before the page is drawn – this avoids a white flash in dark mode.

(function () {
  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  // Read the saved choice. Storage can be blocked (e.g. private windows),
  // so fall back to the light theme if it fails.
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Storage unavailable – the theme still changes for this page.
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  // Light is the default.
  applyTheme(getSavedTheme());

  // Once the page has loaded, wire up the toggle button(s).
  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".theme-toggle");

    function updateButtons() {
      var isDark = root.getAttribute("data-theme") === "dark";
      buttons.forEach(function (btn) {
        btn.textContent = isDark ? "Switch to light theme" : "Switch to dark theme";
        btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        saveTheme(next);
        updateButtons();
      });
    });

    updateButtons();
  });
})();
