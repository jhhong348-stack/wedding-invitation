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
      : "사진 더보기";

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
    "https://jhhong348-stack.github.io/wedding-invitation/";

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
   스크롤 등장 애니메이션
================================ */

function initializeScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".section, .wedding-footer"
  );

  if (revealElements.length === 0) {
    return;
  }

  revealElements.forEach((element) => {
    element.classList.add("scroll-reveal");
  });

  document.documentElement.classList.add("reveal-ready");

  /*
    IntersectionObserver를 지원하지 않는 환경에서는
    모든 섹션을 즉시 표시합니다.
  */
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      /*
        섹션이 아주 조금이라도 화면에 들어오면 표시합니다.
        긴 갤러리·지도·RSVP 섹션도 정상 작동합니다.
      */
      threshold: 0,
      rootMargin: "0px 0px 120px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  /*
    브라우저 오류나 관찰 누락이 발생해도
    콘텐츠가 계속 숨겨져 있지 않도록 하는 안전장치입니다.
  */
  window.setTimeout(() => {
    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.top < window.innerHeight + 200) {
        element.classList.add("is-visible");
      }
    });
  }, 500);
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeScrollReveal
  );
} else {
  initializeScrollReveal();
}