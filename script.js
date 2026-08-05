const copyButtons = document.querySelectorAll(".copy-button");
const toast = document.getElementById("toast");

let toastTimer;

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const accountNumber = button.dataset.account;

    try {
      await navigator.clipboard.writeText(accountNumber);
      showToast("계좌번호가 복사되었습니다.");
    } catch (error) {
      console.error("복사 실패:", error);
      showToast("복사하지 못했습니다. 직접 선택해 주세요.");
    }
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

/* 갤러리 더보기 */
const gallery = document.getElementById("wedding-gallery");
const galleryMoreButton = document.getElementById(
  "gallery-more-button"
);

if (gallery && galleryMoreButton) {
  galleryMoreButton.addEventListener("click", () => {
    const isExpanded = gallery.classList.toggle("is-expanded");

    galleryMoreButton.textContent = isExpanded
      ? "사진 접기"
      : "사진 전체보기";

    galleryMoreButton.setAttribute(
      "aria-expanded",
      String(isExpanded)
    );
  });
}

/* PhotoSwipe는 index.html의 module script에서 실행됩니다. */

/* ================================
   주소 복사
================================ */

const addressCopyButton = document.getElementById(
  "address-copy-button"
);

if (addressCopyButton) {
  addressCopyButton.addEventListener("click", async () => {
    const address = addressCopyButton.dataset.address;
    const originalText = addressCopyButton.textContent;

    try {
      await navigator.clipboard.writeText(address);

      addressCopyButton.textContent = "주소가 복사되었습니다";
    } catch (error) {
      /*
        일부 브라우저나 file:// 환경에서는
        Clipboard API가 제한될 수 있습니다.
      */
      const temporaryInput = document.createElement("textarea");

      temporaryInput.value = address;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";

      document.body.appendChild(temporaryInput);
      temporaryInput.select();

      document.execCommand("copy");
      temporaryInput.remove();

      addressCopyButton.textContent = "주소가 복사되었습니다";
    }

    window.setTimeout(() => {
      addressCopyButton.textContent = originalText;
    }, 1800);
  });
}


/* ================================
   공식 약도 확대
================================ */

const officialMapButton = document.getElementById(
  "official-map-button"
);

const mapModal = document.getElementById("map-modal");
const mapModalClose = document.getElementById(
  "map-modal-close"
);

function openMapModal() {
  if (!mapModal) {
    return;
  }

  mapModal.classList.add("is-open");
  mapModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("map-modal-open");

  mapModalClose?.focus();
}

function closeMapModal() {
  if (!mapModal) {
    return;
  }

  mapModal.classList.remove("is-open");
  mapModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("map-modal-open");

  officialMapButton?.focus();
}

officialMapButton?.addEventListener("click", openMapModal);
mapModalClose?.addEventListener("click", closeMapModal);

mapModal?.addEventListener("click", (event) => {
  if (event.target === mapModal) {
    closeMapModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    mapModal?.classList.contains("is-open")
  ) {
    closeMapModal();
  }
});

/* ================================
   연락처 펼치기
================================ */

const contactToggleButtons = document.querySelectorAll(
  ".contact-toggle-button"
);

contactToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const contactCard = button.closest(".contact-card");

    if (!contactCard) {
      return;
    }

    const isOpen = contactCard.classList.toggle("is-open");

    button.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    button.textContent = isOpen
      ? "닫기"
      : "연락하기";
  });
});

/* ================================
   계좌번호 펼치기
================================ */

const accountGroupToggles = document.querySelectorAll(
  ".account-group-toggle"
);

accountGroupToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const accountGroup = button.closest(".account-group");

    if (!accountGroup) {
      return;
    }

    const isOpen = accountGroup.classList.toggle("is-open");

    button.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
});


/* ================================
   계좌정보 복사
================================ */

const accountCopyButtons = document.querySelectorAll(
  ".account-copy-button"
);

const copyToast = document.getElementById("copy-toast");

let copyToastTimer;

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";

    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand("copy");

    temporaryInput.remove();

    if (!copied) {
      throw new Error("복사에 실패했습니다.");
    }
  }
}

function showCopyToast(message) {
  if (!copyToast) {
    return;
  }

  window.clearTimeout(copyToastTimer);

  copyToast.textContent = message;
  copyToast.classList.add("is-visible");

  copyToastTimer = window.setTimeout(() => {
    copyToast.classList.remove("is-visible");
  }, 1800);
}

accountCopyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const textToCopy = button.dataset.copy;

    if (!textToCopy) {
      return;
    }

    try {
      await copyText(textToCopy);

      const message = button.classList.contains(
        "account-copy-all"
      )
        ? "계좌정보가 복사되었습니다."
        : "계좌번호가 복사되었습니다.";

      showCopyToast(message);
    } catch (error) {
      console.error(error);
      showCopyToast("복사하지 못했습니다.");
    }
  });
});

/* ================================
   SUPABASE RSVP
================================ */

const SUPABASE_URL =
  "https://ttvgcultujlkdecaepag.supabase.co/";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Ji7VcJRMhodBlhcMx0hidA_ra79eKGK";

const RSVP_STORAGE_KEY = "wedding_rsvp_edit_credentials_v1";

const rsvpForm = document.getElementById("rsvp-form");
const rsvpResult = document.getElementById("rsvp-result");
const rsvpError = document.getElementById("rsvp-error");

const rsvpSubmitButton = document.getElementById(
  "rsvp-submit-button"
);

const rsvpSubmitText = rsvpSubmitButton?.querySelector(
  ".rsvp-submit-text"
);

const rsvpSubmitLoading = rsvpSubmitButton?.querySelector(
  ".rsvp-submit-loading"
);

const rsvpEditPanel = document.querySelector(
  ".rsvp-edit-panel"
);

const rsvpEditToggle = document.getElementById(
  "rsvp-edit-toggle"
);

const rsvpLoadButton = document.getElementById(
  "rsvp-load-button"
);

const rsvpLoadSavedButton = document.getElementById(
  "rsvp-load-saved-button"
);

const rsvpConfirmationInput = document.getElementById(
  "rsvp-confirmation-code"
);

const rsvpEditCodeInput = document.getElementById(
  "rsvp-edit-code"
);

const rsvpMessage = document.getElementById("rsvp-message");
const rsvpMessageCount = document.getElementById(
  "rsvp-message-count"
);

const rsvpCountField = document.getElementById(
  "rsvp-count-field"
);

const rsvpCompanionField = document.getElementById(
  "rsvp-companion-field"
);

const rsvpCountSelect = document.getElementById("rsvp-count");

const rsvpResultTitle = document.getElementById(
  "rsvp-result-title"
);

const rsvpResultConfirmation = document.getElementById(
  "rsvp-result-confirmation"
);

const rsvpResultEditCode = document.getElementById(
  "rsvp-result-edit-code"
);

const rsvpCopyCodesButton = document.getElementById(
  "rsvp-copy-codes-button"
);

const rsvpEditAgainButton = document.getElementById(
  "rsvp-edit-again-button"
);

let currentRsvpCredentials = null;


/* -------------------------------
   Supabase RPC 호출
-------------------------------- */

async function callRsvpRpc(functionName, payload) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/${functionName}`,
    {
      method: "POST",
      headers: {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const responseText = await response.text();

  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    const serverMessage =
      responseData?.message ||
      responseData?.hint ||
      "서버 요청을 처리하지 못했습니다.";

    throw new Error(serverMessage);
  }

  return responseData;
}


/* -------------------------------
   브라우저 수정정보 저장
-------------------------------- */

function saveRsvpCredentials(confirmationCode, editCode) {
  const credentials = {
    confirmationCode,
    editCode
  };

  localStorage.setItem(
    RSVP_STORAGE_KEY,
    JSON.stringify(credentials)
  );

  currentRsvpCredentials = credentials;

  if (rsvpLoadSavedButton) {
    rsvpLoadSavedButton.hidden = false;
  }
}

function getSavedRsvpCredentials() {
  try {
    const savedValue = localStorage.getItem(RSVP_STORAGE_KEY);

    if (!savedValue) {
      return null;
    }

    const parsedValue = JSON.parse(savedValue);

    if (
      !parsedValue.confirmationCode ||
      !parsedValue.editCode
    ) {
      return null;
    }

    return parsedValue;
  } catch (error) {
    console.error(error);
    return null;
  }
}


/* -------------------------------
   화면 상태
-------------------------------- */

function setRsvpLoading(isLoading) {
  if (!rsvpSubmitButton) {
    return;
  }

  rsvpSubmitButton.disabled = isLoading;

  if (rsvpSubmitText) {
    rsvpSubmitText.hidden = isLoading;
  }

  if (rsvpSubmitLoading) {
    rsvpSubmitLoading.hidden = !isLoading;
  }
}

function showRsvpError(message) {
  if (rsvpError) {
    rsvpError.textContent = message;
  }
}

function clearRsvpError() {
  showRsvpError("");
}

function showRsvpForm() {
  if (rsvpForm) {
    rsvpForm.hidden = false;
  }

  if (rsvpResult) {
    rsvpResult.hidden = true;
  }
}

function showRsvpResult(result) {
  if (!rsvpForm || !rsvpResult) {
    return;
  }

  clearRsvpError();

  rsvpForm.hidden = true;
  rsvpResult.hidden = false;

  if (rsvpResultTitle) {
  rsvpResultTitle.textContent =
    result.mode === "updated"
      ? "참석 여부가 정상적으로 수정되었습니다."
      : "참석 여부가 정상적으로 접수되었습니다.";
}

  if (rsvpResultConfirmation) {
    rsvpResultConfirmation.textContent =
      result.confirmation_code;
  }

  if (rsvpResultEditCode) {
    rsvpResultEditCode.textContent = result.edit_code;
  }

  rsvpResult.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


/* -------------------------------
   참석 여부에 따른 인원 표시
-------------------------------- */

function updateAttendanceFields() {
  const attendanceValue =
    rsvpForm?.querySelector(
      'input[name="attendance"]:checked'
    )?.value;

  const isAttending = attendanceValue === "attending";

  if (rsvpCountField) {
    rsvpCountField.hidden = !isAttending;
  }

  if (rsvpCompanionField) {
    rsvpCompanionField.hidden = !isAttending;
  }

  if (!isAttending && rsvpCountSelect) {
    rsvpCountSelect.value = "1";
  }
}

rsvpForm
  ?.querySelectorAll('input[name="attendance"]')
  .forEach((radio) => {
    radio.addEventListener(
      "change",
      updateAttendanceFields
    );
  });


/* -------------------------------
   글자수 표시
-------------------------------- */

rsvpMessage?.addEventListener("input", () => {
  if (rsvpMessageCount) {
    rsvpMessageCount.textContent =
      String(rsvpMessage.value.length);
  }
});


/* -------------------------------
   수정 영역 열기
-------------------------------- */

rsvpEditToggle?.addEventListener("click", () => {
  if (!rsvpEditPanel) {
    return;
  }

  const isOpen = rsvpEditPanel.classList.toggle("is-open");

  rsvpEditToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );
});


/* -------------------------------
   기존 응답을 폼에 반영
-------------------------------- */

function fillRsvpForm(data) {
  if (!rsvpForm || !data) {
    return;
  }

  document.getElementById("rsvp-name").value =
    data.guest_name || "";

  const sideRadio = rsvpForm.querySelector(
    `input[name="guest_side"][value="${data.guest_side}"]`
  );

  if (sideRadio) {
    sideRadio.checked = true;
  }

  const attendanceRadio = rsvpForm.querySelector(
    `input[name="attendance"][value="${data.attendance}"]`
  );

  if (attendanceRadio) {
    attendanceRadio.checked = true;
  }

  document.getElementById("rsvp-count").value =
    String(data.guest_count || 1);

  document.getElementById("rsvp-companions").value =
    data.companion_names || "";

  const savedPhone = (data.phone || "").replace(/\D/g, "");

const phonePart1 = document.getElementById("rsvp-phone-1");
const phonePart2 = document.getElementById("rsvp-phone-2");
const phonePart3 = document.getElementById("rsvp-phone-3");

if (savedPhone.length >= 10) {
  if (savedPhone.length === 10) {
    phonePart1.value = savedPhone.slice(0, 3);
    phonePart2.value = savedPhone.slice(3, 6);
    phonePart3.value = savedPhone.slice(6, 10);
  } else {
    phonePart1.value = savedPhone.slice(0, 3);
    phonePart2.value = savedPhone.slice(3, 7);
    phonePart3.value = savedPhone.slice(7, 11);
  }
} else {
  phonePart1.value = "";
  phonePart2.value = "";
  phonePart3.value = "";
}

  document.getElementById("rsvp-message").value =
    data.message || "";

  if (rsvpMessageCount) {
    rsvpMessageCount.textContent = String(
      (data.message || "").length
    );
  }

  updateAttendanceFields();
  showRsvpForm();

  rsvpForm.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* -------------------------------
   기존 응답 불러오기
-------------------------------- */

async function loadExistingRsvp(credentials) {
  clearRsvpError();

  if (
    !credentials?.confirmationCode ||
    !credentials?.editCode
  ) {
    showRsvpError(
      "접수번호와 수정 코드를 모두 입력해주세요."
    );
    return;
  }

  if (rsvpLoadButton) {
    rsvpLoadButton.disabled = true;
    rsvpLoadButton.textContent = "불러오는 중...";
  }

  try {
    const data = await callRsvpRpc(
      "get_rsvp_for_edit",
      {
        p_confirmation_code:
          credentials.confirmationCode.trim().toUpperCase(),

        p_edit_code:
          credentials.editCode.trim().toUpperCase()
      }
    );

    if (!data) {
      throw new Error(
        "접수번호 또는 수정 코드가 올바르지 않습니다."
      );
    }

    currentRsvpCredentials = {
      confirmationCode: data.confirmation_code,
      editCode: credentials.editCode
        .trim()
        .toUpperCase()
    };

    saveRsvpCredentials(
      currentRsvpCredentials.confirmationCode,
      currentRsvpCredentials.editCode
    );

    fillRsvpForm(data);

    rsvpEditPanel?.classList.remove("is-open");

    rsvpEditToggle?.setAttribute(
      "aria-expanded",
      "false"
    );
  } catch (error) {
    console.error(error);
    showRsvpError(error.message);
  } finally {
    if (rsvpLoadButton) {
      rsvpLoadButton.disabled = false;
      rsvpLoadButton.textContent =
  "기존 응답 불러오기";
    }
  }
}

rsvpLoadButton?.addEventListener("click", () => {
  loadExistingRsvp({
    confirmationCode: rsvpConfirmationInput?.value || "",
    editCode: rsvpEditCodeInput?.value || ""
  });
});

rsvpLoadSavedButton?.addEventListener("click", () => {
  const savedCredentials = getSavedRsvpCredentials();

  if (savedCredentials) {
    loadExistingRsvp(savedCredentials);
  }
});

function getRsvpPhoneNumber() {
  const phonePart1 =
    document.getElementById("rsvp-phone-1")
      ?.value
      .replace(/\D/g, "") || "";

  const phonePart2 =
    document.getElementById("rsvp-phone-2")
      ?.value
      .replace(/\D/g, "") || "";

  const phonePart3 =
    document.getElementById("rsvp-phone-3")
      ?.value
      .replace(/\D/g, "") || "";

  /*
    세 칸이 전부 비어 있으면 연락처를 선택 입력으로 처리합니다.
  */
  if (!phonePart1 && !phonePart2 && !phonePart3) {
    return null;
  }

  /*
    일부만 입력한 경우 제출할 수 없도록 합니다.
  */
  if (
    phonePart1.length !== 3 ||
    ![3, 4].includes(phonePart2.length) ||
    phonePart3.length !== 4
  ) {
    throw new Error(
      "연락처를 정확히 입력해주세요."
    );
  }

  return `${phonePart1}-${phonePart2}-${phonePart3}`;
}


/* -------------------------------
   폼 제출
-------------------------------- */

rsvpForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearRsvpError();

  /*
    숨겨진 칸에 값이 있으면 봇 요청으로 간주합니다.
  */
  const honeypotValue =
    document.getElementById("rsvp-website")?.value;

  if (honeypotValue) {
    return;
  }

  if (!rsvpForm.checkValidity()) {
    rsvpForm.reportValidity();
    return;
  }

  const guestName =
    document.getElementById("rsvp-name").value.trim();

  const guestSide = rsvpForm.querySelector(
    'input[name="guest_side"]:checked'
  )?.value;

  const attendance = rsvpForm.querySelector(
    'input[name="attendance"]:checked'
  )?.value;

  const privacyConsent =
    document.getElementById("rsvp-consent").checked;

  if (!guestName || !guestSide || !attendance) {
    showRsvpError(
      "필수 항목을 모두 입력해주세요."
    );
    return;
  }

  let guestCount = 0;
  let companionNames = null;

  if (attendance === "attending") {
    guestCount = Number(
      document.getElementById("rsvp-count").value
    );

    companionNames =
      document
        .getElementById("rsvp-companions")
        .value
        .trim() || null;
  }

  const savedCredentials =
    currentRsvpCredentials ||
    getSavedRsvpCredentials();

    let phoneNumber = null;

try {
  phoneNumber = getRsvpPhoneNumber();
} catch (error) {
  showRsvpError(error.message);
  return;
}

  const payload = {
    p_guest_name: guestName,
    p_guest_side: guestSide,
    p_attendance: attendance,
    p_guest_count: guestCount,
    p_privacy_consent: privacyConsent,

    p_companion_names: companionNames,

    p_phone: getRsvpPhoneNumber(),

    p_message:
      document.getElementById("rsvp-message").value.trim()
      || null,

    p_language: "ko",

    p_confirmation_code:
      savedCredentials?.confirmationCode || null,

    p_edit_code:
      savedCredentials?.editCode || null
  };

  setRsvpLoading(true);

  try {
    const result = await callRsvpRpc(
      "submit_or_update_rsvp",
      payload
    );

    if (!result?.success) {
      throw new Error(
        "응답을 저장하지 못했습니다."
      );
    }

    saveRsvpCredentials(
      result.confirmation_code,
      result.edit_code
    );

    showRsvpResult(result);
  } catch (error) {
    console.error(error);

    /*
      저장된 수정정보가 유효하지 않은 경우,
      사용자 몰래 새 응답을 만들지 않고 오류를 안내합니다.
    */
    showRsvpError(
      error.message ||
      "응답을 전송하지 못했습니다. 잠시 후 다시 시도해주세요."
    );
  } finally {
    setRsvpLoading(false);
  }
});


/* -------------------------------
   접수정보 복사
-------------------------------- */

rsvpCopyCodesButton?.addEventListener("click", async () => {
  const confirmationCode =
    rsvpResultConfirmation?.textContent || "";

  const editCode =
    rsvpResultEditCode?.textContent || "";

  const copyValue =
  `홍재호 · 장시한 결혼식 RSVP 접수정보\n\n` +
  `접수번호: ${confirmationCode}\n` +
  `수정 코드: ${editCode}\n\n` +
  `응답 수정 시 접수번호와 수정 코드가 모두 필요합니다.`;

  try {
    await copyText(copyValue);
    showCopyToast(
  "접수번호와 수정 코드가 복사되었습니다."
);
  } catch (error) {
    console.error(error);
  }
});


/* -------------------------------
   다시 수정
-------------------------------- */

rsvpEditAgainButton?.addEventListener("click", () => {
  showRsvpForm();

  rsvpForm?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});


/* -------------------------------
   초기 상태
-------------------------------- */

const initialSavedCredentials = getSavedRsvpCredentials();

if (initialSavedCredentials && rsvpLoadSavedButton) {
  rsvpLoadSavedButton.hidden = false;
}

updateAttendanceFields();

const rsvpPhoneInputs = document.querySelectorAll(
  ".rsvp-phone-grid input"
);

rsvpPhoneInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");

    /*
      입력 가능한 자릿수를 채우면 다음 칸으로 자동 이동합니다.
    */
    if (
      input.value.length === input.maxLength &&
      index < rsvpPhoneInputs.length - 1
    ) {
      rsvpPhoneInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (event) => {
    /*
      현재 칸이 비어 있는 상태에서 Backspace를 누르면
      앞 칸으로 이동합니다.
    */
    if (
      event.key === "Backspace" &&
      input.value.length === 0 &&
      index > 0
    ) {
      rsvpPhoneInputs[index - 1].focus();
    }
  });
});

/* ================================
   청첩장 공유
================================ */

const shareButton = document.getElementById("share-button");

function isMobileDevice() {
  const mobileUserAgent =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /*
    iPadOS는 데스크톱처럼 표시되는 경우가 있어
    터치 포인트도 함께 확인합니다.
  */
  const isIPadOS =
    navigator.platform === "MacIntel" &&
    navigator.maxTouchPoints > 1;

  return mobileUserAgent || isIPadOS;
}

shareButton?.addEventListener("click", async () => {
  const pageUrl =
    "https://jaehoetsihan.com/";

  const shareData = {
    title: "홍재호 · 장시한 결혼식에 초대합니다",
    text: "2026년 10월 10일 토요일 오후 12시, 루나미엘레",
    url: pageUrl
  };

  /*
    모바일 기기이면서 Web Share API가 실제로
    해당 데이터를 공유할 수 있을 때만 공유창을 엽니다.
  */
  const canUseNativeShare =
    isMobileDevice() &&
    typeof navigator.share === "function" &&
    (
      typeof navigator.canShare !== "function" ||
      navigator.canShare(shareData)
    );

  if (canUseNativeShare) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error("공유창 실행 실패:", error);
    }
  }

  /*
    PC 또는 공유창 실행 실패 시 주소 복사
  */
  try {
    await copyText(pageUrl);
    showCopyToast("청첩장 주소가 복사되었습니다.");
  } catch (error) {
    console.error("주소 복사 실패:", error);

    window.prompt(
      "아래 청첩장 주소를 복사해주세요.",
      pageUrl
    );
  }
});

/* ================================
   WEDDING D-DAY
================================ */

function updateWeddingDday() {
  const ddayElement =
    document.getElementById("wedding-dday");

  const ddayNumber =
    document.getElementById("dday-number");

  if (!ddayElement || !ddayNumber) {
    console.error(
      "D-Day 표시 요소를 찾지 못했습니다."
    );
    return;
  }

  /*
    결혼식 날짜를 직접 지정합니다.
    시간은 D-Day 일수 계산에 사용하지 않고,
    날짜 부분만 기준으로 계산합니다.
  */
  const weddingYear = 2026;
  const weddingMonth = 10;
  const weddingDay = 10;

  const now = new Date();

  /*
    오늘과 결혼식 날짜를 UTC 자정 기준으로 맞춰
    서머타임이나 시간대 차이로 인한 오차를 줄입니다.
  */
  const todayUtc = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const weddingUtc = Date.UTC(
    weddingYear,
    weddingMonth - 1,
    weddingDay
  );

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference = Math.round(
    (weddingUtc - todayUtc) /
    millisecondsPerDay
  );

  ddayElement.classList.remove(
    "is-wedding-day",
    "is-finished"
  );

  if (difference > 0) {
    ddayNumber.textContent = `D-${difference}`;
    return;
  }

  if (difference === 0) {
    ddayElement.classList.add(
      "is-wedding-day"
    );

    ddayNumber.textContent = "TODAY";
    return;
  }

  ddayElement.classList.add(
    "is-finished"
  );

  ddayNumber.textContent =
    "함께해 주셔서 감사합니다";
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    updateWeddingDday
  );
} else {
  updateWeddingDday();
}

/* ========================================
   SCROLL REVEAL — NON-BLOCKING
======================================== */

function initializeRevealAnimation() {
  const revealElements =
    document.querySelectorAll(".reveal");

  if (revealElements.length === 0) {
    return;
  }

  /*
    IntersectionObserver 미지원 환경에서는
    모든 섹션을 즉시 표시합니다.
  */
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("show");
    });

    return;
  }

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 100px 0px"
      }
    );

  revealElements.forEach((element) => {
    /*
      첫 화면 안에 이미 들어온 요소는
      Observer 응답을 기다리지 않고 즉시 표시합니다.
    */
    const rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight + 80) {
      element.classList.add("show");
      return;
    }

    revealObserver.observe(element);
  });
}

/*
  첫 화면 렌더링과 터치 처리를 먼저 허용한 뒤
  다음 프레임에 애니메이션을 준비합니다.
*/
window.requestAnimationFrame(() => {
  window.requestAnimationFrame(
    initializeRevealAnimation
  );
});

/* ========================================
   SCROLL TO TOP
======================================== */

const scrollTopButton = document.getElementById(
  "scroll-top-button"
);

function updateScrollTopButton() {
  if (!scrollTopButton) {
    return;
  }

  /*
    약 600px 이상 내려갔을 때 버튼을 표시합니다.
  */
  const shouldShow = window.scrollY > 600;

  scrollTopButton.classList.toggle(
    "is-visible",
    shouldShow
  );
}

scrollTopButton?.addEventListener("click", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth"
  });
});

/*
  스크롤 이벤트가 지나치게 많이 실행되지 않도록
  requestAnimationFrame으로 화면 갱신 시점에 맞춥니다.
*/
let scrollTopTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (scrollTopTicking) {
      return;
    }

    scrollTopTicking = true;

    window.requestAnimationFrame(() => {
      updateScrollTopButton();
      scrollTopTicking = false;
    });
  },
  {
    passive: true
  }
);

updateScrollTopButton();

/* ========================================
   WEDDING BGM
   Fade + 저장된 위치 + 재생 선호 기억
======================================== */

const weddingBgm = document.getElementById(
  "wedding-bgm"
);

const bgmButton = document.getElementById(
  "bgm-button"
);

const BGM_TARGET_VOLUME = 0.2;
const BGM_FADE_IN_DURATION = 1100;
const BGM_FADE_OUT_DURATION = 750;

const BGM_STORAGE_KEYS = {
  enabled: "weddingBgmEnabled",
  currentTime: "weddingBgmCurrentTime"
};

let bgmFadeFrame = null;
let bgmFadeToken = 0;
let bgmSaveTimer = null;
let shouldResumeSavedBgm = false;

/*
  localStorage 접근이 제한된 브라우저에서도
  페이지 기능이 멈추지 않도록 안전하게 처리합니다.
*/
function readBgmStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(
      "BGM 저장 정보를 읽지 못했습니다.",
      error
    );

    return null;
  }
}

function writeBgmStorage(key, value) {
  try {
    window.localStorage.setItem(
      key,
      String(value)
    );
  } catch (error) {
    console.warn(
      "BGM 저장 정보를 기록하지 못했습니다.",
      error
    );
  }
}

function updateBgmButton(isPlaying) {
  if (!bgmButton) {
    return;
  }

  bgmButton.classList.toggle(
    "is-playing",
    isPlaying
  );

  bgmButton.setAttribute(
    "aria-pressed",
    String(isPlaying)
  );

  bgmButton.setAttribute(
    "aria-label",
    isPlaying
      ? "배경음악 일시정지"
      : shouldResumeSavedBgm
        ? "배경음악 이어서 재생"
        : "배경음악 재생"
  );

  bgmButton.title =
    isPlaying
      ? "음악 끄기"
      : shouldResumeSavedBgm
        ? "음악 이어듣기"
        : "음악 듣기";
}

function cancelBgmFade() {
  bgmFadeToken += 1;

  if (bgmFadeFrame !== null) {
    window.cancelAnimationFrame(
      bgmFadeFrame
    );

    bgmFadeFrame = null;
  }
}

function fadeBgmVolume({
  from,
  to,
  duration,
  onComplete
}) {
  if (!weddingBgm) {
    return;
  }

  cancelBgmFade();

  const currentToken = bgmFadeToken;
  const startTime = performance.now();
  const difference = to - from;

  weddingBgm.volume = Math.min(
    Math.max(from, 0),
    1
  );

  function animate(currentTime) {
    if (currentToken !== bgmFadeToken) {
      return;
    }

    const elapsed = currentTime - startTime;

    const progress = Math.min(
      elapsed / duration,
      1
    );

    const easedProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 -
          Math.pow(
            -2 * progress + 2,
            2
          ) / 2;

    weddingBgm.volume = Math.min(
      Math.max(
        from +
          difference * easedProgress,
        0
      ),
      1
    );

    if (progress < 1) {
      bgmFadeFrame =
        window.requestAnimationFrame(
          animate
        );

      return;
    }

    bgmFadeFrame = null;
    weddingBgm.volume = to;

    onComplete?.();
  }

  bgmFadeFrame =
    window.requestAnimationFrame(
      animate
    );
}

function saveBgmCurrentTime() {
  if (
    !weddingBgm ||
    !Number.isFinite(weddingBgm.currentTime)
  ) {
    return;
  }

  writeBgmStorage(
    BGM_STORAGE_KEYS.currentTime,
    weddingBgm.currentTime.toFixed(2)
  );
}

function restoreBgmPreference() {
  if (!weddingBgm) {
    return;
  }

  shouldResumeSavedBgm =
    readBgmStorage(
      BGM_STORAGE_KEYS.enabled
    ) === "true";

  const savedTime = Number(
    readBgmStorage(
      BGM_STORAGE_KEYS.currentTime
    )
  );

  if (
    Number.isFinite(savedTime) &&
    savedTime >= 0
  ) {
    /*
      duration을 알기 전에는 currentTime 설정이
      일부 브라우저에서 무시될 수 있어
      loadedmetadata 이후 다시 적용합니다.
    */
    const applySavedTime = () => {
      if (!Number.isFinite(weddingBgm.duration)) {
        return;
      }

      weddingBgm.currentTime =
        savedTime < weddingBgm.duration
          ? savedTime
          : 0;
    };

    if (weddingBgm.readyState >= 1) {
      applySavedTime();
    } else {
      weddingBgm.addEventListener(
        "loadedmetadata",
        applySavedTime,
        {
          once: true
        }
      );
    }
  }

  updateBgmButton(false);
}

async function playWeddingBgm() {
  if (!weddingBgm) {
    return;
  }

  cancelBgmFade();
  weddingBgm.volume = 0;

  try {
    await weddingBgm.play();

    shouldResumeSavedBgm = true;

    writeBgmStorage(
      BGM_STORAGE_KEYS.enabled,
      true
    );

    updateBgmButton(true);

    fadeBgmVolume({
      from: 0,
      to: BGM_TARGET_VOLUME,
      duration: BGM_FADE_IN_DURATION
    });
  } catch (error) {
  updateBgmButton(false);

  console.error(
    "배경음악 재생에 실패했습니다.",
    error
  );

  throw error;
  }
}

function pauseWeddingBgm() {
  if (!weddingBgm || weddingBgm.paused) {
    return;
  }

  saveBgmCurrentTime();

  /*
    사용자가 직접 껐으므로 다음 방문 때
    이어듣기 선호도도 끈 상태로 저장합니다.
  */
  shouldResumeSavedBgm = false;

  writeBgmStorage(
    BGM_STORAGE_KEYS.enabled,
    false
  );

  const currentVolume =
    Number.isFinite(weddingBgm.volume)
      ? weddingBgm.volume
      : BGM_TARGET_VOLUME;

  fadeBgmVolume({
    from: currentVolume,
    to: 0,
    duration: BGM_FADE_OUT_DURATION,

    onComplete: () => {
      weddingBgm.pause();
      weddingBgm.volume = 0;
      updateBgmButton(false);
    }
  });
}

bgmButton?.addEventListener(
  "click",
  async () => {
    if (!weddingBgm) {
      console.error(
        "BGM 오디오 요소를 찾지 못했습니다."
      );

      return;
    }

    if (!weddingBgm.paused) {
      pauseWeddingBgm();
      return;
    }

    await playWeddingBgm();
  }
);

weddingBgm?.addEventListener(
  "play",
  () => {
    updateBgmButton(true);
  }
);

weddingBgm?.addEventListener(
  "pause",
  () => {
    updateBgmButton(false);
  }
);

/*
  재생 중 3초마다 현재 위치를 저장합니다.
*/
weddingBgm?.addEventListener(
  "timeupdate",
  () => {
    if (bgmSaveTimer !== null) {
      return;
    }

    bgmSaveTimer = window.setTimeout(
      () => {
        saveBgmCurrentTime();
        bgmSaveTimer = null;
      },
      3000
    );
  }
);

weddingBgm?.addEventListener(
  "error",
  () => {
    cancelBgmFade();
    updateBgmButton(false);

    console.error(
      "BGM 파일을 불러오는 중 오류가 발생했습니다."
    );
  }
);

/*
  페이지를 떠나기 직전 현재 재생 위치를 저장합니다.
*/
window.addEventListener(
  "pagehide",
  saveBgmCurrentTime
);

if (weddingBgm) {
  weddingBgm.volume = 0;
}

restoreBgmPreference();

/* ========================================
   BGM AUTO START
   자동재생 시도 → 차단 시 첫 사용자 동작에 재생
======================================== */

let bgmAutoStartCompleted = false;

function removeBgmStartListeners() {
  document.removeEventListener(
    "pointerdown",
    startBgmFromFirstInteraction
  );

  document.removeEventListener(
    "touchstart",
    startBgmFromFirstInteraction
  );

  document.removeEventListener(
    "keydown",
    startBgmFromFirstInteraction
  );

  window.removeEventListener(
    "scroll",
    startBgmFromFirstInteraction
  );
}

async function startBgmFromFirstInteraction() {
  if (
    bgmAutoStartCompleted ||
    !weddingBgm ||
    !weddingBgm.paused
  ) {
    removeBgmStartListeners();
    return;
  }

  try {
    await playWeddingBgm();
    bgmAutoStartCompleted = true;
    removeBgmStartListeners();
  } catch (error) {
    /*
      브라우저가 아직 재생을 허용하지 않으면
      다음 사용자 동작에서 다시 시도합니다.
    */
    console.warn(
      "첫 사용자 동작에서 BGM 재생을 시작하지 못했습니다.",
      error
    );
  }
}

async function attemptBgmAutoplay() {
  if (!weddingBgm) {
    return;
  }

  try {
    await playWeddingBgm();

    bgmAutoStartCompleted = true;
    removeBgmStartListeners();
  } catch (error) {
    /*
      자동재생이 차단된 경우:
      첫 터치, 첫 클릭, 첫 스크롤, 첫 키 입력에 재생합니다.
    */
    document.addEventListener(
      "pointerdown",
      startBgmFromFirstInteraction,
      {
        passive: true
      }
    );

    document.addEventListener(
      "touchstart",
      startBgmFromFirstInteraction,
      {
        passive: true
      }
    );

    document.addEventListener(
      "keydown",
      startBgmFromFirstInteraction
    );

    window.addEventListener(
      "scroll",
      startBgmFromFirstInteraction,
      {
        passive: true
      }
    );
  }
}

/*
  첫 화면 렌더링 직후 자동재생을 시도합니다.
*/
window.requestAnimationFrame(() => {
  attemptBgmAutoplay();
});

/*
  Hero 사진과 문구가 먼저 보인 다음
  BGM 버튼을 부드럽게 표시합니다.
*/
window.setTimeout(() => {
  bgmButton?.classList.add(
    "is-ready"
  );
}, 700)

/* ========================================
   GUESTBOOK ENTRY MANAGEMENT
   길게 누르기 / 우클릭으로 관리 모달 열기
======================================== */

const guestbookList = document.getElementById(
  "guestbook-list"
);

const guestbookModal = document.getElementById(
  "guestbook-modal"
);

const guestbookModalClose = document.getElementById(
  "guestbook-modal-close"
);

const guestbookEntryId = document.getElementById(
  "guestbook-entry-id"
);

const guestbookEditName = document.getElementById(
  "guestbook-edit-name"
);

const guestbookEditMessage = document.getElementById(
  "guestbook-edit-message"
);

const guestbookEditPassword = document.getElementById(
  "guestbook-edit-password"
);

const guestbookEditCharacterCount =
  document.getElementById(
    "guestbook-edit-character-count"
  );

const guestbookModalError = document.getElementById(
  "guestbook-modal-error"
);

let guestbookLongPressTimer = null;
let guestbookLongPressStartX = 0;
let guestbookLongPressStartY = 0;
let guestbookLongPressTriggered = false;

const GUESTBOOK_LONG_PRESS_DELAY = 650;
const GUESTBOOK_MOVE_TOLERANCE = 12;


/*
  수정·삭제 모달 열기
*/
function openGuestbookManagementModal(entryElement) {
  if (
    !entryElement ||
    !guestbookModal
  ) {
    return;
  }

  const entryId =
    entryElement.dataset.entryId || "";

  const guestName =
    entryElement.dataset.guestName || "";

  const message =
    entryElement.dataset.message || "";

  if (guestbookEntryId) {
    guestbookEntryId.value = entryId;
  }

  if (guestbookEditName) {
    guestbookEditName.value = guestName;
  }

  if (guestbookEditMessage) {
    guestbookEditMessage.value = message;
  }

  if (guestbookEditPassword) {
    guestbookEditPassword.value = "";
  }

  if (guestbookModalError) {
    guestbookModalError.textContent = "";
  }

  if (guestbookEditCharacterCount) {
    guestbookEditCharacterCount.textContent =
      `${message.length} / 200`;
  }

  guestbookModal.hidden = false;

  guestbookModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "guestbook-modal-open"
  );

  window.requestAnimationFrame(() => {
    guestbookModal.classList.add(
      "is-open"
    );

    guestbookEditName?.focus();
  });
}


/*
  수정·삭제 모달 닫기
*/
function closeGuestbookManagementModal() {
  if (!guestbookModal) {
    return;
  }

  guestbookModal.classList.remove(
    "is-open"
  );

  guestbookModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "guestbook-modal-open"
  );

  window.setTimeout(() => {
    guestbookModal.hidden = true;
  }, 220);
}


/*
  길게 누르기 타이머 정리
*/
function clearGuestbookLongPressTimer() {
  if (guestbookLongPressTimer) {
    window.clearTimeout(
      guestbookLongPressTimer
    );

    guestbookLongPressTimer = null;
  }
}


/*
  모바일: 누르기 시작
*/
guestbookList?.addEventListener(
  "pointerdown",
  (event) => {
    const entryElement =
      event.target.closest(".guestbook-entry");

    if (!entryElement) {
      return;
    }

    /*
      마우스는 우클릭 기능을 사용하므로
      길게 누르기는 터치·펜 입력에만 적용합니다.
    */
    if (event.pointerType === "mouse") {
      return;
    }

    guestbookLongPressTriggered = false;
    guestbookLongPressStartX = event.clientX;
    guestbookLongPressStartY = event.clientY;

    clearGuestbookLongPressTimer();

    guestbookLongPressTimer =
      window.setTimeout(() => {
        guestbookLongPressTriggered = true;

        openGuestbookManagementModal(
          entryElement
        );

        /*
          지원 기기에서는 아주 짧은 진동을 줍니다.
        */
        if ("vibrate" in navigator) {
          navigator.vibrate(25);
        }
      }, GUESTBOOK_LONG_PRESS_DELAY);
  },
  {
    passive: true
  }
);


/*
  손가락이 움직이면 일반 스크롤로 판단하고
  길게 누르기 실행을 취소합니다.
*/
guestbookList?.addEventListener(
  "pointermove",
  (event) => {
    if (!guestbookLongPressTimer) {
      return;
    }

    const movedX = Math.abs(
      event.clientX - guestbookLongPressStartX
    );

    const movedY = Math.abs(
      event.clientY - guestbookLongPressStartY
    );

    if (
      movedX > GUESTBOOK_MOVE_TOLERANCE ||
      movedY > GUESTBOOK_MOVE_TOLERANCE
    ) {
      clearGuestbookLongPressTimer();
    }
  },
  {
    passive: true
  }
);

guestbookList?.addEventListener(
  "pointerup",
  clearGuestbookLongPressTimer
);

guestbookList?.addEventListener(
  "pointercancel",
  clearGuestbookLongPressTimer
);

guestbookList?.addEventListener(
  "pointerleave",
  clearGuestbookLongPressTimer
);


/*
  PC: 방명록 메시지를 우클릭하면 모달을 엽니다.
*/
guestbookList?.addEventListener(
  "contextmenu",
  (event) => {
    const entryElement =
      event.target.closest(".guestbook-entry");

    if (!entryElement) {
      return;
    }

    event.preventDefault();

    openGuestbookManagementModal(
      entryElement
    );
  }
);


/*
  모달 닫기 버튼
*/
guestbookModalClose?.addEventListener(
  "click",
  closeGuestbookManagementModal
);


/*
  모달 배경을 누르면 닫기
*/
guestbookModal?.addEventListener(
  "click",
  (event) => {
    if (
      event.target.matches(
        "[data-guestbook-modal-close]"
      )
    ) {
      closeGuestbookManagementModal();
    }
  }
);


/*
  ESC 키로 닫기
*/
document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      guestbookModal &&
      !guestbookModal.hidden
    ) {
      closeGuestbookManagementModal();
    }
  }
);


/*
  수정 메시지 글자 수 표시
*/
guestbookEditMessage?.addEventListener(
  "input",
  () => {
    if (!guestbookEditCharacterCount) {
      return;
    }

    guestbookEditCharacterCount.textContent =
      `${guestbookEditMessage.value.length} / 200`;
  }
);

/* ========================================
   GUESTBOOK — LOAD ENTRIES
======================================== */

const guestbookLoading = document.getElementById(
  "guestbook-loading"
);

const guestbookEmpty = document.getElementById(
  "guestbook-empty"
);

const guestbookMoreButton = document.getElementById(
  "guestbook-more-button"
);

const GUESTBOOK_PAGE_SIZE = 5;

let guestbookCurrentOffset = 0;
let guestbookTotalCount = 0;
let guestbookIsLoading = false;


/*
  Supabase 방명록 RPC 호출
*/
async function callGuestbookRpc(
  functionName,
  payload = {}
) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/${functionName}`,
    {
      method: "POST",
      headers: {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const responseText = await response.text();

  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    const serverMessage =
      responseData?.message ||
      responseData?.hint ||
      "방명록을 불러오지 못했습니다.";

    throw new Error(serverMessage);
  }

  return responseData;
}


/*
  날짜 표시
*/
function formatGuestbookDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  )
    .format(date)
    .replace(/\s/g, "");
}


/*
  이름에서 아바타 글자 추출
*/
function getGuestbookAvatarLetter(name) {
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    return "♥";
  }

  return Array.from(cleanName)[0];
}


/*
  방명록 메시지 요소 생성

  innerHTML을 사용하지 않고 textContent로 출력해
  입력된 HTML이나 스크립트가 실행되지 않게 합니다.
*/
function createGuestbookEntryElement(entry) {
  const article = document.createElement("article");

  article.className = "guestbook-entry";

  article.dataset.entryId =
    String(entry.id || "");

  article.dataset.guestName =
    String(entry.guest_name || "");

  article.dataset.message =
    String(entry.message || "");

  article.dataset.createdAt =
    String(entry.created_at || "");

  article.dataset.updatedAt =
    String(entry.updated_at || "");

  article.tabIndex = 0;

  article.setAttribute(
    "aria-label",
    `${entry.guest_name || "익명"}님의 축하 메시지`
  );

  const header =
    document.createElement("div");

  header.className =
    "guestbook-entry-header";

  const profile =
    document.createElement("div");

  profile.className =
    "guestbook-entry-profile";

  const avatar =
    document.createElement("span");

  avatar.className =
    "guestbook-entry-avatar";

  avatar.setAttribute(
    "aria-hidden",
    "true"
  );

  avatar.textContent =
    getGuestbookAvatarLetter(
      entry.guest_name
    );

  const name =
    document.createElement("strong");

  name.className =
    "guestbook-entry-name";

  name.textContent =
    entry.guest_name || "익명";

  profile.append(
    avatar,
    name
  );

  const meta =
    document.createElement("div");

  meta.className =
    "guestbook-entry-meta";

  const date =
    document.createElement("time");

  date.className =
    "guestbook-entry-date";

  date.dateTime =
    String(entry.created_at || "");

  date.textContent =
    formatGuestbookDate(
      entry.created_at
    );

  meta.appendChild(date);

  const createdTime =
    new Date(
      entry.created_at
    ).getTime();

  const updatedTime =
    new Date(
      entry.updated_at
    ).getTime();

  /*
    등록 직후 발생하는 미세한 시간 차이는
    수정으로 표시하지 않습니다.
  */
  const isEdited =
    Number.isFinite(createdTime) &&
    Number.isFinite(updatedTime) &&
    updatedTime - createdTime > 1000;

  if (isEdited) {
    const edited =
      document.createElement("span");

    edited.className =
      "guestbook-entry-edited";

    edited.textContent =
      "수정됨";

    meta.appendChild(edited);
  }

  header.append(
    profile,
    meta
  );

  const message =
    document.createElement("p");

  message.className =
    "guestbook-entry-message";

  message.textContent =
    entry.message || "";

  article.append(
    header,
    message
  );

  return article;
}


/*
  로딩 상태
*/
function setGuestbookLoading(isLoading) {
  guestbookIsLoading = isLoading;

  if (guestbookLoading) {
    guestbookLoading.hidden = !isLoading;
  }

  if (guestbookMoreButton) {
    guestbookMoreButton.disabled = isLoading;
    guestbookMoreButton.textContent =
      isLoading
        ? "불러오는 중..."
        : "방명록 더보기";
  }
}


/*
  빈 방명록 상태
*/
function updateGuestbookEmptyState() {
  if (!guestbookEmpty || !guestbookList) {
    return;
  }

  guestbookEmpty.hidden =
    guestbookList.children.length > 0;
}


/*
  더보기 버튼 표시 여부
*/
function updateGuestbookMoreButton() {
  if (!guestbookMoreButton) {
    return;
  }

  const loadedCount =
    guestbookList?.children.length || 0;

  guestbookMoreButton.hidden =
    loadedCount === 0 ||
    loadedCount >= guestbookTotalCount;
}


/*
  전체 방명록 개수 조회
*/
async function loadGuestbookCount() {
  const result = await callGuestbookRpc(
    "get_guestbook_count"
  );

  guestbookTotalCount =
    Number(result) || 0;
}


/*
  방명록 목록 조회

  reset이 true이면 기존 목록을 지우고
  최신 5개부터 다시 불러옵니다.
*/
async function loadGuestbookEntries({
  reset = false
} = {}) {
  if (
    guestbookIsLoading ||
    !guestbookList
  ) {
    return;
  }

  if (reset) {
    guestbookCurrentOffset = 0;
    guestbookList.replaceChildren();
  }

  setGuestbookLoading(true);

  try {
    if (reset) {
      await loadGuestbookCount();
    }

    const entries = await callGuestbookRpc(
      "get_guestbook_entries",
      {
        p_limit: GUESTBOOK_PAGE_SIZE,
        p_offset: guestbookCurrentOffset
      }
    );

    const entryList =
      Array.isArray(entries)
        ? entries
        : [];

    const fragment =
      document.createDocumentFragment();

    entryList.forEach((entry) => {
      fragment.appendChild(
        createGuestbookEntryElement(entry)
      );
    });

    guestbookList.appendChild(fragment);

    guestbookCurrentOffset +=
      entryList.length;

    updateGuestbookEmptyState();
    updateGuestbookMoreButton();
  } catch (error) {
    console.error(
      "방명록 조회 오류:",
      error
    );

    if (
      guestbookLoading &&
      guestbookList.children.length === 0
    ) {
      guestbookLoading.hidden = false;
      guestbookLoading.textContent =
        "축하 메시지를 불러오지 못했습니다.";
    }
  } finally {
    setGuestbookLoading(false);
  }
}


/*
  방명록 더보기
*/
guestbookMoreButton?.addEventListener(
  "click",
  () => {
    loadGuestbookEntries();
  }
);


/*
  페이지를 열면 최근 메시지 5개 조회
*/
loadGuestbookEntries({
  reset: true
});

/* ========================================
   GUESTBOOK — CREATE ENTRY
======================================== */

const guestbookForm =
  document.getElementById("guestbook-form");

const guestbookNameInput =
  document.getElementById("guestbook-name");

const guestbookMessageInput =
  document.getElementById("guestbook-message");

const guestbookPasswordInput =
  document.getElementById("guestbook-password");

const guestbookWebsiteInput =
  document.getElementById("guestbook-website");

const guestbookCharacterCount =
  document.getElementById(
    "guestbook-character-count"
  );

const guestbookError =
  document.getElementById("guestbook-error");

const guestbookSubmitButton =
  document.getElementById(
    "guestbook-submit-button"
  );

const GUESTBOOK_SUBMIT_COOLDOWN = 30000;
const GUESTBOOK_LAST_SUBMIT_KEY =
  "weddingGuestbookLastSubmit";

let guestbookIsSubmitting = false;


/*
  글자 수 표시
*/
function updateGuestbookCharacterCount() {
  if (
    !guestbookMessageInput ||
    !guestbookCharacterCount
  ) {
    return;
  }

  guestbookCharacterCount.textContent =
    `${guestbookMessageInput.value.length} / 200`;
}

guestbookMessageInput?.addEventListener(
  "input",
  updateGuestbookCharacterCount
);


/*
  오류 메시지 표시
*/
function setGuestbookFormError(message = "") {
  if (!guestbookError) {
    return;
  }

  guestbookError.textContent = message;
}


/*
  등록 버튼 상태 변경
*/
function setGuestbookSubmitState(state) {
  if (!guestbookSubmitButton) {
    return;
  }

  guestbookSubmitButton.classList.remove(
    "is-loading",
    "is-success"
  );

  switch (state) {
    case "loading":
      guestbookSubmitButton.disabled = true;
      guestbookSubmitButton.classList.add(
        "is-loading"
      );
      guestbookSubmitButton.textContent =
        "등록 중...";
      break;

    case "success":
      guestbookSubmitButton.disabled = true;
      guestbookSubmitButton.classList.add(
        "is-success"
      );
      guestbookSubmitButton.textContent =
        "✓ 등록 완료";
      break;

    default:
      guestbookSubmitButton.disabled = false;
      guestbookSubmitButton.textContent =
        "메시지 남기기";
  }
}


/*
  30초 연속 등록 제한 확인
*/
function getGuestbookCooldownRemaining() {
  try {
    const lastSubmittedAt = Number(
      localStorage.getItem(
        GUESTBOOK_LAST_SUBMIT_KEY
      )
    );

    if (!lastSubmittedAt) {
      return 0;
    }

    const elapsed =
      Date.now() - lastSubmittedAt;

    return Math.max(
      GUESTBOOK_SUBMIT_COOLDOWN - elapsed,
      0
    );
  } catch (error) {
    return 0;
  }
}


/*
  최근 등록 시간을 저장합니다.
*/
function saveGuestbookSubmitTime() {
  try {
    localStorage.setItem(
      GUESTBOOK_LAST_SUBMIT_KEY,
      String(Date.now())
    );
  } catch (error) {
    /*
      사생활 보호 모드 등에서 localStorage가
      차단되더라도 등록 자체는 계속 진행합니다.
    */
  }
}


/*
  입력값 검증
*/
function validateGuestbookForm() {
  const guestName =
    guestbookNameInput?.value.trim() || "";

  const message =
    guestbookMessageInput?.value.trim() || "";

  const password =
    guestbookPasswordInput?.value.trim() || "";

  if (!guestName) {
    return {
      isValid: false,
      message: "이름을 입력해 주세요.",
      target: guestbookNameInput
    };
  }

  if (guestName.length > 20) {
    return {
      isValid: false,
      message:
        "이름은 20자 이하로 입력해 주세요.",
      target: guestbookNameInput
    };
  }

  if (!message) {
    return {
      isValid: false,
      message:
        "축하 메시지를 입력해 주세요.",
      target: guestbookMessageInput
    };
  }

  if (message.length > 200) {
    return {
      isValid: false,
      message:
        "축하 메시지는 200자 이하로 입력해 주세요.",
      target: guestbookMessageInput
    };
  }

  if (!/^[0-9]{4}$/.test(password)) {
    return {
      isValid: false,
      message:
        "비밀번호는 숫자 4자리로 입력해 주세요.",
      target: guestbookPasswordInput
    };
  }

  return {
    isValid: true,
    guestName,
    message,
    password
  };
}


/*
  등록 직후 첫 번째 메시지에
  등장 애니메이션과 '방금 전'을 적용합니다.
*/
function highlightNewestGuestbookEntry() {
  if (!guestbookList) {
    return;
  }

  const newestEntry =
    guestbookList.querySelector(
      ".guestbook-entry"
    );

  if (!newestEntry) {
    return;
  }

  newestEntry.classList.add(
    "is-new-entry"
  );

  const dateElement =
    newestEntry.querySelector(
      ".guestbook-entry-date"
    );

  if (dateElement) {
    dateElement.textContent = "방금 전";
  }

  window.setTimeout(() => {
    newestEntry.classList.remove(
      "is-new-entry"
    );
  }, 1200);
}


/*
  방명록 등록
*/
guestbookForm?.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    if (guestbookIsSubmitting) {
      return;
    }

    setGuestbookFormError("");

    /*
      자동 등록 방지용 숨김 입력칸에 값이 있으면
      실제 요청을 보내지 않습니다.
    */
    if (
      guestbookWebsiteInput?.value.trim()
    ) {
      guestbookForm.reset();
      updateGuestbookCharacterCount();
      return;
    }

    const validation =
      validateGuestbookForm();

    if (!validation.isValid) {
      setGuestbookFormError(
        validation.message
      );

      validation.target?.focus();
      return;
    }

    const cooldownRemaining =
      getGuestbookCooldownRemaining();

    if (cooldownRemaining > 0) {
      const remainingSeconds =
        Math.ceil(
          cooldownRemaining / 1000
        );

      setGuestbookFormError(
        `잠시 후 다시 등록해 주세요. ` +
        `약 ${remainingSeconds}초 남았습니다.`
      );

      return;
    }

    guestbookIsSubmitting = true;
    setGuestbookSubmitState("loading");

    try {
      await callGuestbookRpc(
        "create_guestbook_entry",
        {
          p_guest_name:
            validation.guestName,

          p_message:
            validation.message,

          p_password:
            validation.password
        }
      );

      saveGuestbookSubmitTime();

      guestbookForm.reset();
      updateGuestbookCharacterCount();

      setGuestbookSubmitState("success");

      /*
        새 글이 포함된 최신 5개를 다시 불러옵니다.
        이 방식은 더보기 페이지 번호가 꼬이는 것을
        방지합니다.
      */
      await loadGuestbookEntries({
        reset: true
      });

      highlightNewestGuestbookEntry();

      /*
        등록된 글이 보이도록 방명록 목록 쪽으로
        부드럽게 이동합니다.
      */
      guestbookList?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

      window.setTimeout(() => {
        setGuestbookSubmitState("idle");
      }, 1200);
    } catch (error) {
      console.error(
        "방명록 등록 오류:",
        error
      );

      const errorMessage =
        error?.message ||
        "메시지 등록에 실패했습니다.";

      setGuestbookFormError(
        errorMessage
      );

      setGuestbookSubmitState("idle");
    } finally {
      guestbookIsSubmitting = false;
    }
  }
);


/*
  첫 로딩 시 글자 수를 0 / 200으로 맞춥니다.
*/
updateGuestbookCharacterCount();

/* ========================================
   GUESTBOOK — UPDATE & DELETE
======================================== */

const guestbookUpdateButton =
  document.getElementById(
    "guestbook-update-button"
  );

const guestbookDeleteButton =
  document.getElementById(
    "guestbook-delete-button"
  );

const guestbookDeleteConfirm =
  document.getElementById(
    "guestbook-delete-confirm"
  );

const guestbookDeleteCancel =
  document.getElementById(
    "guestbook-delete-cancel"
  );

const guestbookDeleteConfirmButton =
  document.getElementById(
    "guestbook-delete-confirm-button"
  );

let guestbookIsUpdating = false;
let guestbookIsDeleting = false;


/*
  관리 모달 오류 표시
*/
function setGuestbookModalError(message = "") {
  if (guestbookModalError) {
    guestbookModalError.textContent = message;
  }
}


/*
  수정 버튼 상태
*/
function setGuestbookUpdateState(state) {
  if (!guestbookUpdateButton) {
    return;
  }

  guestbookUpdateButton.classList.remove(
    "is-loading",
    "is-success"
  );

  switch (state) {
    case "loading":
      guestbookUpdateButton.disabled = true;
      guestbookUpdateButton.classList.add(
        "is-loading"
      );
      guestbookUpdateButton.textContent =
        "수정 중...";
      break;

    case "success":
      guestbookUpdateButton.disabled = true;
      guestbookUpdateButton.classList.add(
        "is-success"
      );
      guestbookUpdateButton.textContent =
        "✓ 수정 완료";
      break;

    default:
      guestbookUpdateButton.disabled = false;
      guestbookUpdateButton.textContent =
        "수정하기";
  }
}


/*
  삭제 버튼 상태
*/
function setGuestbookDeleteState(state) {
  if (!guestbookDeleteConfirmButton) {
    return;
  }

  guestbookDeleteConfirmButton.classList.remove(
    "is-loading",
    "is-success"
  );

  switch (state) {
    case "loading":
      guestbookDeleteConfirmButton.disabled = true;
      guestbookDeleteConfirmButton.classList.add(
        "is-loading"
      );
      guestbookDeleteConfirmButton.textContent =
        "삭제 중...";
      break;

    case "success":
      guestbookDeleteConfirmButton.disabled = true;
      guestbookDeleteConfirmButton.classList.add(
        "is-success"
      );
      guestbookDeleteConfirmButton.textContent =
        "✓ 삭제 완료";
      break;

    default:
      guestbookDeleteConfirmButton.disabled = false;
      guestbookDeleteConfirmButton.textContent =
        "삭제";
  }
}


/*
  현재 관리 중인 방명록 카드 찾기
*/
function getCurrentGuestbookEntryElement() {
  const entryId =
    guestbookEntryId?.value || "";

  if (!entryId || !guestbookList) {
    return null;
  }

  return Array.from(
    guestbookList.querySelectorAll(
      ".guestbook-entry"
    )
  ).find(
    (entryElement) =>
      entryElement.dataset.entryId === entryId
  ) || null;
}


/*
  삭제 확인창 열기
*/
function openGuestbookDeleteConfirm() {
  if (!guestbookDeleteConfirm) {
    return;
  }

  setGuestbookModalError("");
  setGuestbookDeleteState("idle");

  guestbookDeleteConfirm.hidden = false;

  guestbookDeleteConfirm.setAttribute(
    "aria-hidden",
    "false"
  );

  window.requestAnimationFrame(() => {
    guestbookDeleteConfirm.classList.add(
      "is-open"
    );

    guestbookDeleteCancel?.focus();
  });
}


/*
  삭제 확인창 닫기
*/
function closeGuestbookDeleteConfirm() {
  if (!guestbookDeleteConfirm) {
    return;
  }

  guestbookDeleteConfirm.classList.remove(
    "is-open"
  );

  guestbookDeleteConfirm.setAttribute(
    "aria-hidden",
    "true"
  );

  window.setTimeout(() => {
    guestbookDeleteConfirm.hidden = true;
  }, 220);
}


/*
  수정 입력 검증
*/
function validateGuestbookEditForm() {
  const guestName =
    guestbookEditName?.value.trim() || "";

  const message =
    guestbookEditMessage?.value.trim() || "";

  const password =
    guestbookEditPassword?.value.trim() || "";

  if (!guestName) {
    return {
      isValid: false,
      message: "이름을 입력해 주세요.",
      target: guestbookEditName
    };
  }

  if (guestName.length > 20) {
    return {
      isValid: false,
      message:
        "이름은 20자 이하로 입력해 주세요.",
      target: guestbookEditName
    };
  }

  if (!message) {
    return {
      isValid: false,
      message:
        "축하 메시지를 입력해 주세요.",
      target: guestbookEditMessage
    };
  }

  if (message.length > 200) {
    return {
      isValid: false,
      message:
        "축하 메시지는 200자 이하로 입력해 주세요.",
      target: guestbookEditMessage
    };
  }

  if (!/^[0-9]{4}$/.test(password)) {
    return {
      isValid: false,
      message:
        "작성 시 입력한 숫자 4자리 비밀번호를 입력해 주세요.",
      target: guestbookEditPassword
    };
  }

  return {
    isValid: true,
    guestName,
    message,
    password
  };
}


/*
  방명록 수정
*/
guestbookUpdateButton?.addEventListener(
  "click",
  async () => {
    if (guestbookIsUpdating) {
      return;
    }

    setGuestbookModalError("");

    const entryId =
      guestbookEntryId?.value || "";

    if (!entryId) {
      setGuestbookModalError(
        "수정할 메시지를 찾지 못했습니다."
      );
      return;
    }

    const validation =
      validateGuestbookEditForm();

    if (!validation.isValid) {
      setGuestbookModalError(
        validation.message
      );
      validation.target?.focus();
      return;
    }

    guestbookIsUpdating = true;
    setGuestbookUpdateState("loading");

    try {
      const wasUpdated =
        await callGuestbookRpc(
          "update_guestbook_entry",
          {
            p_id: entryId,
            p_guest_name:
              validation.guestName,
            p_message:
              validation.message,
            p_password:
              validation.password
          }
        );

      if (wasUpdated !== true) {
        throw new Error(
          "비밀번호가 일치하지 않습니다."
        );
      }

      const currentEntry =
        getCurrentGuestbookEntryElement();

      if (currentEntry) {
        currentEntry.dataset.guestName =
          validation.guestName;

        currentEntry.dataset.message =
          validation.message;

        currentEntry.dataset.updatedAt =
          new Date().toISOString();

        const nameElement =
          currentEntry.querySelector(
            ".guestbook-entry-name"
          );

        const avatarElement =
          currentEntry.querySelector(
            ".guestbook-entry-avatar"
          );

        const messageElement =
          currentEntry.querySelector(
            ".guestbook-entry-message"
          );

        const metaElement =
          currentEntry.querySelector(
            ".guestbook-entry-meta"
          );

        if (nameElement) {
          nameElement.textContent =
            validation.guestName;
        }

        if (avatarElement) {
          avatarElement.textContent =
            getGuestbookAvatarLetter(
              validation.guestName
            );
        }

        if (messageElement) {
          messageElement.textContent =
            validation.message;
        }

        if (
          metaElement &&
          !metaElement.querySelector(
            ".guestbook-entry-edited"
          )
        ) {
          const edited =
            document.createElement("span");

          edited.className =
            "guestbook-entry-edited";

          edited.textContent = "수정됨";

          metaElement.appendChild(edited);
        }

        currentEntry.classList.add(
          "is-updated"
        );

        window.setTimeout(() => {
          currentEntry.classList.remove(
            "is-updated"
          );
        }, 1000);
      }

      setGuestbookUpdateState("success");

      window.setTimeout(() => {
        closeGuestbookManagementModal();
        setGuestbookUpdateState("idle");
      }, 750);
    } catch (error) {
      console.error(
        "방명록 수정 오류:",
        error
      );

      setGuestbookModalError(
        error?.message ||
        "메시지 수정에 실패했습니다."
      );

      setGuestbookUpdateState("idle");
    } finally {
      guestbookIsUpdating = false;
    }
  }
);


/*
  삭제 버튼 클릭
*/
guestbookDeleteButton?.addEventListener(
  "click",
  () => {
    const password =
      guestbookEditPassword?.value.trim() ||
      "";

    if (!/^[0-9]{4}$/.test(password)) {
      setGuestbookModalError(
        "삭제하려면 작성 시 입력한 숫자 4자리 비밀번호를 입력해 주세요."
      );

      guestbookEditPassword?.focus();
      return;
    }

    openGuestbookDeleteConfirm();
  }
);


/*
  삭제 최종 확인
*/
guestbookDeleteConfirmButton?.addEventListener(
  "click",
  async () => {
    if (guestbookIsDeleting) {
      return;
    }

    const entryId =
      guestbookEntryId?.value || "";

    const password =
      guestbookEditPassword?.value.trim() ||
      "";

    if (!entryId) {
      closeGuestbookDeleteConfirm();

      setGuestbookModalError(
        "삭제할 메시지를 찾지 못했습니다."
      );
      return;
    }

    guestbookIsDeleting = true;
    setGuestbookDeleteState("loading");

    try {
      const wasDeleted =
        await callGuestbookRpc(
          "delete_guestbook_entry",
          {
            p_id: entryId,
            p_password: password
          }
        );

      if (wasDeleted !== true) {
        throw new Error(
          "비밀번호가 일치하지 않습니다."
        );
      }

      const currentEntry =
        getCurrentGuestbookEntryElement();

      setGuestbookDeleteState("success");

      if (currentEntry) {
        currentEntry.classList.add(
          "is-deleting"
        );

        window.setTimeout(() => {
          currentEntry.remove();

          guestbookCurrentOffset =
            Math.max(
              guestbookCurrentOffset - 1,
              0
            );

          guestbookTotalCount =
            Math.max(
              guestbookTotalCount - 1,
              0
            );

          updateGuestbookEmptyState();
          updateGuestbookMoreButton();
        }, 430);
      }

      window.setTimeout(() => {
        closeGuestbookDeleteConfirm();
        closeGuestbookManagementModal();
        setGuestbookDeleteState("idle");
      }, 650);
    } catch (error) {
      console.error(
        "방명록 삭제 오류:",
        error
      );

      closeGuestbookDeleteConfirm();

      setGuestbookModalError(
        error?.message ||
        "메시지 삭제에 실패했습니다."
      );

      setGuestbookDeleteState("idle");
    } finally {
      guestbookIsDeleting = false;
    }
  }
);


/*
  삭제 확인창 닫기
*/
guestbookDeleteCancel?.addEventListener(
  "click",
  closeGuestbookDeleteConfirm
);

guestbookDeleteConfirm?.addEventListener(
  "click",
  (event) => {
    if (
      event.target.matches(
        "[data-guestbook-confirm-close]"
      )
    ) {
      closeGuestbookDeleteConfirm();
    }
  }
);


/*
  ESC 키 처리
*/
document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      guestbookDeleteConfirm &&
      !guestbookDeleteConfirm.hidden
    ) {
      event.stopPropagation();
      closeGuestbookDeleteConfirm();
    }
  }
);