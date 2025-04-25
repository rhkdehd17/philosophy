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

  // DOM 요소
  const diaryForm = document.getElementById("diaryForm");
  const writeSection = document.getElementById("writeSection");
  const listSection = document.getElementById("listSection");
  const diaryEntries = document.getElementById("diaryEntries");
  const diaryDetail = document.getElementById("diaryDetail");
  const backToList = document.getElementById("backToList");
  const navLinks = document.querySelectorAll(".nav-link");

  // 초기 데이터 로드 및 마지막 상태 복원
  loadDiaryEntries();
  restoreLastView();

  // 마지막 상태 복원 함수
  function restoreLastView() {
    const lastView = localStorage.getItem("lastView") || "write";
    navLinks.forEach((link) => {
      if (link.dataset.view === lastView) {
        link.click();
      }
    });
  }

  // 네비게이션 이벤트
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const view = e.target.dataset.view;

      navLinks.forEach((l) => l.classList.remove("active"));
      e.target.classList.add("active");

      // 현재 뷰 저장
      localStorage.setItem("lastView", view);

      if (view === "write") {
        writeSection.classList.remove("hidden");
        listSection.classList.add("hidden");
      } else {
        writeSection.classList.add("hidden");
        listSection.classList.remove("hidden");
        diaryDetail.classList.add("hidden");
        diaryEntries.classList.remove("hidden");
        loadDiaryEntries();
      }
    });
  });

  // 일기 저장
  diaryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const content = document.getElementById("content").value;

    const diary = {
      id: Date.now(),
      title,
      date,
      content,
      createdAt: new Date().toISOString(),
    };

    saveDiaryEntry(diary);
    diaryForm.reset();

    // 저장 완료 메시지와 함께 목록 화면으로 이동
    alert("일기가 저장되었습니다.");

    // 목록 화면으로 자동 전환
    navLinks.forEach((link) => {
      if (link.dataset.view === "list") {
        link.click();
      }
    });
  });

  // 목록으로 돌아가기
  backToList.addEventListener("click", () => {
    diaryDetail.classList.add("hidden");
    diaryEntries.classList.remove("hidden");
  });

  // 일기 저장 함수
  function saveDiaryEntry(diary) {
    const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    entries.push(diary);
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }

  // 일기 목록 로드 함수
  function loadDiaryEntries() {
    const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    diaryEntries.innerHTML = "";

    if (entries.length === 0) {
      diaryEntries.innerHTML =
        '<p class="no-entries">저장된 일기가 없습니다.</p>';
      return;
    }

    // 최신 순으로 정렬
    entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((entry) => {
        const entryElement = createDiaryEntryElement(entry);
        diaryEntries.appendChild(entryElement);
      });
  }

  // 일기 항목 요소 생성 함수
  function createDiaryEntryElement(entry) {
    const div = document.createElement("div");
    div.className = "diary-entry";
    div.innerHTML = `
      <h3>${entry.title}</h3>
      <p class="entry-date">${formatDate(entry.date)}</p>
    `;

    div.addEventListener("click", () => showDiaryDetail(entry));
    return div;
  }

  // 일기 상세 내용 표시 함수
  function showDiaryDetail(entry) {
    document.getElementById("detailTitle").textContent = entry.title;
    document.getElementById("detailDate").textContent = formatDate(entry.date);
    document.getElementById("detailContent").textContent = entry.content;

    diaryEntries.classList.add("hidden");
    diaryDetail.classList.remove("hidden");
  }

  // 날짜 포맷 함수
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  }
});
