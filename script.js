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