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