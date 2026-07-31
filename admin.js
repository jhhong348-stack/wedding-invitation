import {
  createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
  "https://ttvgcultujlkdecaepag.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Ji7VcJRMhodBlhcMx0hidA_ra79eKGK";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById(
  "dashboard-view"
);

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");

const loginButtonText = loginButton?.querySelector(
  ".login-button-text"
);

const loginButtonLoading = loginButton?.querySelector(
  ".login-button-loading"
);

const adminAccount = document.getElementById(
  "admin-account"
);

const logoutButton = document.getElementById(
  "logout-button"
);

const refreshButton = document.getElementById(
  "refresh-button"
);

const csvButton = document.getElementById("csv-button");

const searchInput = document.getElementById("admin-search");
const attendanceFilter = document.getElementById(
  "attendance-filter"
);

const sideFilter = document.getElementById("side-filter");
const sortFilter = document.getElementById("sort-filter");

const dashboardStatus = document.getElementById(
  "dashboard-status"
);

const responseList = document.getElementById(
  "response-list"
);

let allResponses = [];

/* 로그인 화면 상태 */

function setLoginLoading(isLoading) {
  if (!loginButton) {
    return;
  }

  loginButton.disabled = isLoading;

  if (loginButtonText) {
    loginButtonText.hidden = isLoading;
  }

  if (loginButtonLoading) {
    loginButtonLoading.hidden = !isLoading;
  }
}

function showLoginError(message = "") {
  if (loginError) {
    loginError.textContent = message;
  }
}

function showLoginView() {
  loginView.hidden = false;
  dashboardView.hidden = true;
}

function showDashboardView(user) {
  loginView.hidden = true;
  dashboardView.hidden = false;

  if (adminAccount) {
    adminAccount.textContent = user?.email || "";
  }
}

/* 로그인 */

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showLoginError("");

  const email = document
    .getElementById("admin-email")
    .value
    .trim();

  const password = document.getElementById(
    "admin-password"
  ).value;

  if (!email || !password) {
    showLoginError("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  setLoginLoading(true);

  try {
    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    showDashboardView(data.user);
    await loadResponses();
  } catch (error) {
    console.error(error);

    showLoginError(
      "이메일 또는 비밀번호를 확인해주세요."
    );
  } finally {
    setLoginLoading(false);
  }
});

/* 로그아웃 */

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;

  try {
    await supabase.auth.signOut();
    allResponses = [];
    showLoginView();
  } catch (error) {
    console.error(error);
  } finally {
    logoutButton.disabled = false;
  }
});

/* RSVP 조회 */

async function loadResponses() {
  dashboardStatus.textContent =
    "응답을 불러오는 중입니다.";

  refreshButton.disabled = true;

  try {
    const {
      data,
      error
    } = await supabase
      .from("wedding_rsvp")
      .select(`
        id,
        confirmation_no,
        guest_name,
        guest_side,
        attendance,
        guest_count,
        companion_names,
        phone,
        message,
        language,
        created_at,
        updated_at
      `)
      .order("created_at", {
        ascending: false
      });

    if (error) {
      throw error;
    }

    allResponses = data || [];

    updateStatistics(allResponses);
    renderFilteredResponses();
  } catch (error) {
    console.error(error);

    /*
      로그인은 성공했으나 관리자 정책을 통과하지
      못한 경우에도 이 메시지가 표시됩니다.
    */
    dashboardStatus.textContent =
      "응답을 불러올 권한이 없거나 서버 요청에 실패했습니다.";

    responseList.innerHTML = "";
  } finally {
    refreshButton.disabled = false;
  }
}

/* 통계 */

function updateStatistics(responses) {
  const attendingResponses = responses.filter(
    (item) => item.attendance === "attending"
  );

  const totalGuests = attendingResponses.reduce(
    (total, item) => total + Number(item.guest_count || 0),
    0
  );

  const countGuestsBySide = (side) =>
    attendingResponses
      .filter((item) => item.guest_side === side)
      .reduce(
        (total, item) =>
          total + Number(item.guest_count || 0),
        0
      );

  setStat("stat-total-responses", responses.length);
  setStat("stat-total-guests", totalGuests);

  setStat(
    "stat-attending",
    attendingResponses.length
  );

  setStat(
    "stat-not-attending",
    responses.filter(
      (item) => item.attendance === "not_attending"
    ).length
  );

  setStat(
    "stat-undecided",
    responses.filter(
      (item) => item.attendance === "undecided"
    ).length
  );

  setStat(
    "stat-groom-guests",
    countGuestsBySide("groom")
  );

  setStat(
    "stat-bride-guests",
    countGuestsBySide("bride")
  );

  setStat(
    "stat-both-guests",
    countGuestsBySide("both")
  );
}

function setStat(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = String(value);
  }
}

/* 필터와 정렬 */

function getFilteredResponses() {
  const searchTerm = searchInput.value
    .trim()
    .toLowerCase();

  const selectedAttendance = attendanceFilter.value;
  const selectedSide = sideFilter.value;
  const selectedSort = sortFilter.value;

  const filtered = allResponses.filter((item) => {
    const searchContent = [
      item.guest_name,
      item.phone,
      item.companion_names,
      item.message
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchTerm || searchContent.includes(searchTerm);

    const matchesAttendance =
      selectedAttendance === "all" ||
      item.attendance === selectedAttendance;

    const matchesSide =
      selectedSide === "all" ||
      item.guest_side === selectedSide;

    return (
      matchesSearch &&
      matchesAttendance &&
      matchesSide
    );
  });

  filtered.sort((a, b) => {
    if (selectedSort === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    }

    if (selectedSort === "updated") {
      return new Date(b.updated_at) - new Date(a.updated_at);
    }

    if (selectedSort === "name") {
      return String(a.guest_name).localeCompare(
        String(b.guest_name),
        "ko"
      );
    }

    return new Date(b.created_at) - new Date(a.created_at);
  });

  return filtered;
}

function renderFilteredResponses() {
  const filteredResponses = getFilteredResponses();

  dashboardStatus.textContent =
    `전체 ${allResponses.length}건 중 ` +
    `${filteredResponses.length}건을 표시하고 있습니다.`;

  renderResponses(filteredResponses);
}

[
  searchInput,
  attendanceFilter,
  sideFilter,
  sortFilter
].forEach((element) => {
  element?.addEventListener(
    element === searchInput ? "input" : "change",
    renderFilteredResponses
  );
});

/* 응답 카드 출력 */

function renderResponses(responses) {
  responseList.innerHTML = "";

  if (responses.length === 0) {
    responseList.innerHTML = `
      <div class="empty-state">
        조건에 맞는 RSVP 응답이 없습니다.
      </div>
    `;

    return;
  }

  const fragment = document.createDocumentFragment();

  responses.forEach((item) => {
    const card = document.createElement("article");
    card.className = "response-card";

    const confirmationCode =
      `W${String(item.confirmation_no).padStart(6, "0")}`;

    const attendanceLabel =
      getAttendanceLabel(item.attendance);

    const sideLabel = getSideLabel(item.guest_side);

    const badgeClass =
      item.attendance === "attending"
        ? "attending"
        : item.attendance === "not_attending"
          ? "not-attending"
          : "undecided";

    const wasUpdated =
      Math.abs(
        new Date(item.updated_at) -
        new Date(item.created_at)
      ) > 1000;

    card.innerHTML = `
      <header class="response-card-header">
        <div>
          <h2 class="response-name">
            ${escapeHtml(item.guest_name)}
          </h2>

          <span class="response-code">
            ${confirmationCode}
          </span>
        </div>

        <div class="response-badges">
          <span class="response-badge ${badgeClass}">
            ${attendanceLabel}
          </span>

          <span class="response-badge">
            ${sideLabel}
          </span>

          ${
            wasUpdated
              ? `
                <span class="response-badge">
                  수정됨
                </span>
              `
              : ""
          }
        </div>
      </header>

      <div class="response-details">
        <div class="response-detail">
          <span>참석 인원</span>
          <strong>
            ${
              item.attendance === "attending"
                ? `${Number(item.guest_count || 0)}명`
                : "-"
            }
          </strong>
        </div>

        <div class="response-detail">
          <span>연락처</span>
          <strong>
            ${escapeHtml(item.phone || "-")}
          </strong>
        </div>

        <div class="response-detail">
          <span>최초 작성</span>
          <strong>
            ${formatDateTime(item.created_at)}
          </strong>
        </div>

        <div class="response-detail">
          <span>최근 수정</span>
          <strong>
            ${formatDateTime(item.updated_at)}
          </strong>
        </div>
      </div>

      <div class="response-extra">
        ${
          item.companion_names
            ? `
              <div>
                <span>동반인 성함</span>
                ${escapeHtml(item.companion_names)}
              </div>
            `
            : ""
        }

        ${
          item.message
            ? `
              <div>
                <span>전하실 말씀</span>
                ${escapeHtml(item.message)}
              </div>
            `
            : ""
        }
      </div>

      <p class="response-time">
        ${
          wasUpdated
            ? `최근 수정 ${formatDateTime(item.updated_at)}`
            : `접수 ${formatDateTime(item.created_at)}`
        }
      </p>
    `;

    fragment.appendChild(card);
  });

  responseList.appendChild(fragment);
}

function getAttendanceLabel(value) {
  const labels = {
    attending: "참석",
    not_attending: "불참",
    undecided: "미정"
  };

  return labels[value] || value;
}

function getSideLabel(value) {
  const labels = {
    groom: "신랑측",
    bride: "신부측",
    both: "양측 모두"
  };

  return labels[value] || value;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* 새로고침 */

refreshButton?.addEventListener("click", loadResponses);

/* CSV 다운로드 */

csvButton?.addEventListener("click", () => {
  const rows = getFilteredResponses();

  if (rows.length === 0) {
    window.alert("다운로드할 응답이 없습니다.");
    return;
  }

  const header = [
    "접수번호",
    "성함",
    "하객구분",
    "참석여부",
    "참석인원",
    "동반인",
    "연락처",
    "메시지",
    "최초작성일",
    "최근수정일"
  ];

  const body = rows.map((item) => [
    `W${String(item.confirmation_no).padStart(6, "0")}`,
    item.guest_name,
    getSideLabel(item.guest_side),
    getAttendanceLabel(item.attendance),

    item.attendance === "attending"
      ? Number(item.guest_count || 0)
      : 0,

    item.companion_names || "",
    item.phone || "",
    item.message || "",
    formatDateTime(item.created_at),
    formatDateTime(item.updated_at)
  ]);

  const csvContent = [
    header,
    ...body
  ]
    .map((row) =>
      row
        .map((cell) => escapeCsvCell(cell))
        .join(",")
    )
    .join("\r\n");

  /*
    UTF-8 BOM을 붙여 Excel에서 한글이
    깨질 가능성을 줄입니다.
  */
  const blob = new Blob(
    ["\uFEFF", csvContent],
    {
      type: "text/csv;charset=utf-8"
    }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const dateText = new Date()
    .toISOString()
    .slice(0, 10);

  link.href = url;
  link.download = `wedding-rsvp-${dateText}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});

function escapeCsvCell(value) {
  const text = String(value ?? "");

  return `"${text.replaceAll('"', '""')}"`;
}

/* 초기 로그인 상태 확인 */

async function initializeAdminPage() {
  const {
    data,
    error
  } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    showLoginView();
    return;
  }

  const session = data.session;

  if (!session?.user) {
    showLoginView();
    return;
  }

  showDashboardView(session.user);
  await loadResponses();
}

supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT") {
    showLoginView();
  }

  if (event === "SIGNED_IN" && session?.user) {
    showDashboardView(session.user);
  }
});

initializeAdminPage();