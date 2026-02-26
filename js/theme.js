(function () {
  const storageKey = "ecopulse-theme";
  const root = document.documentElement;
  const themeToggleId = "theme-toggle";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore storage failures (private mode, blocked storage, etc.)
    }
  };

  const resolveTheme = () => {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return prefersDark.matches ? "dark" : "light";
  };

  const initialTheme = resolveTheme();
  root.setAttribute("data-theme", initialTheme);
  root.style.colorScheme = initialTheme;

  const updateToggleUi = (theme) => {
    const toggle = document.getElementById(themeToggleId);
    if (!toggle) return;

    const isLight = theme === "light";
    const icon = toggle.querySelector(".theme-toggle__icon");
    const label = toggle.querySelector(".theme-toggle__text");

    toggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );

    if (icon) {
      icon.textContent = isLight ? "🌞" : "🌙";
    }

    if (label) {
      label.textContent = isLight ? "Light" : "Dark";
    }
  };

  const applyTheme = (theme, persist) => {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    updateToggleUi(theme);

    if (persist) {
      setStoredTheme(theme);
    }

    document.dispatchEvent(
      new CustomEvent("ecopulse-theme-change", {
        detail: { theme }
      })
    );
  };

  const mountToggle = () => {
    if (document.getElementById(themeToggleId)) return;

    const nav = document.querySelector("nav");
    if (!nav) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = themeToggleId;
    toggle.className = "theme-toggle";
    toggle.innerHTML =
      "<span class=\"theme-toggle__icon\" aria-hidden=\"true\">🌙</span>" +
      "<span class=\"theme-toggle__text\">Dark</span>";

    const menuBtn = nav.querySelector("#mobile-menu-btn");
    if (menuBtn && menuBtn.parentNode) {
      menuBtn.parentNode.insertBefore(toggle, menuBtn);
    } else {
      const target = nav.querySelector(".flex.justify-between") || nav;
      target.appendChild(toggle);
    }

    toggle.addEventListener("click", () => {
      const nextTheme =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    mountToggle();
    applyTheme(initialTheme, false);
  });

  prefersDark.addEventListener("change", (event) => {
    if (getStoredTheme()) return;
    applyTheme(event.matches ? "dark" : "light", false);
  });
})();
