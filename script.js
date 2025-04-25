document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const decreaseFont = document.getElementById("decreaseFont");
  const resetFont = document.getElementById("resetFont");
  const increaseFont = document.getElementById("increaseFont");

  // 기본 폰트 크기 설정
  const defaultFontSize = 16;
  let currentFontSize =
    parseInt(localStorage.getItem("fontSize")) || defaultFontSize;

  // 저장된 폰트 크기 적용
  updateFontSize(currentFontSize);

  // 저장된 테마가 있다면 적용
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateButtonText(savedTheme === "dark");
  }

  darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateButtonText(newTheme === "dark");
  });

  // 폰트 크기 조절 이벤트
  decreaseFont.addEventListener("click", () => {
    if (currentFontSize > 12) {
      updateFontSize(currentFontSize - 2);
    }
  });

  resetFont.addEventListener("click", () => {
    updateFontSize(defaultFontSize);
  });

  increaseFont.addEventListener("click", () => {
    if (currentFontSize < 24) {
      updateFontSize(currentFontSize + 2);
    }
  });

  function updateButtonText(isDark) {
    darkModeToggle.innerHTML = isDark ? "☀️ 라이트모드" : "🌙 다크모드";
  }

  function updateFontSize(newSize) {
    currentFontSize = newSize;
    document.documentElement.style.setProperty(
      "--font-size-base",
      `${newSize}px`
    );
    localStorage.setItem("fontSize", newSize);
  }
});
