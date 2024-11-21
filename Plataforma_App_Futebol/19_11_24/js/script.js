document.addEventListener("DOMContentLoaded", function () {
  function pushGA4(event) {
    const target = event.currentTarget;

    const btnType = target.getAttribute("data-btn-type");
    const eventSession = target.getAttribute("data-gtm-event-session");
    const eventAction = target.getAttribute("data-gtm-event-action");
    const eventLabel = target.getAttribute("data-gtm-event-label");

    if (btnType === "interacao") {
      dataLayer.push({
        event: "event",
        eventCategory: eventSession,
        eventAction: eventAction,
        eventLabel: eventLabel,
      });
    } else {
      dataLayer.push({
        event: btnType,
        custom_section: eventSession,
        custom_title: eventAction,
        custom_callback: eventLabel,
      });
    }

    console.log("DataLayer:", dataLayer);
  }

  function changePlanCard() {
    $('input[name="netflix-bundle-app"]').on("click", function (event) {
      var productURL = $(this).data("producturl");
      var price = $(this).data("price");
      var afterPrice = $(this).data("after-price");
      var btnPropType = $(this).data("btn-prop-type");
      var eventSession = $(this).data("gtm-event-session");
      var eventAction = $(this).data("gtm-event-action");

      // Atualiza o link no elemento pai
      const btnPlan = $(this).closest(".product-plan").find(".btn-plan")[0];
      btnPlan.setAttribute("href", productURL);
      btnPlan.setAttribute("data-btn-prop-type", btnPropType);
      btnPlan.setAttribute("data-gtm-event-session", eventSession);
      btnPlan.setAttribute(
        "data-gtm-event-action",
        eventAction.replace("selecionou:", "clique:")
      );

      // Separa o preço em parte inteira e decimal
      var priceParts = price.split(",");
      var priceWhole = priceParts[0];
      var priceDecimal = priceParts[1];

      // Reconstrói o HTML do preço usando template string
      var priceHTML = `<span>R$</span> <strong>${priceWhole}</strong>,${priceDecimal}`;

      // Atualiza os valores de preço no elemento pai
      const closestRowPop = $(this).closest(".product-plan");
      const priceElement = closestRowPop.find("h5[data-price]")[0];
      priceElement.setAttribute("data-price", price);
      priceElement.innerHTML = priceHTML;

      const valuePlanMonth = closestRowPop.find(".value-plan-month span")[0];
      valuePlanMonth.innerHTML = afterPrice;

      // Enviar o evento de comparação de card
      pushGA4(event);
    });
  }

  function initScrollSuave() {
    let linksInternos = document.querySelectorAll(
      'a[href^="#"]:not(.btn-compare):not(.btn-compare-sound)'
    );

    function scrollToSection(event) {
      event.preventDefault();
      let href = event.currentTarget.getAttribute("href");
      let section = document.querySelector(href);

      let sectionRect = section.getBoundingClientRect();
      let scrollPosition = window.pageYOffset + sectionRect.top - 45;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }

    linksInternos.forEach((link) => {
      link.addEventListener("click", scrollToSection);
    });
  }

  function initScrollProducts() {
    let slideTrack = document.querySelector(".slide-track");
    let contentToDuplicate = slideTrack.innerHTML;
    slideTrack.innerHTML += contentToDuplicate;

    let slider = document.querySelector(".slider");
    let slideCount = slider.querySelectorAll(".slide").length;
    slider.style.setProperty("--slide-count", slideCount);

    let channelInverseTrack = document.querySelector(".channel-inverse-track");
    contentToDuplicate = channelInverseTrack.innerHTML;
    channelInverseTrack.innerHTML += contentToDuplicate;

    let channelDir = document.querySelector(".channel-dir");
    let channelDirCount = channelDir.querySelectorAll(".channel").length;
    channelDir.style.setProperty("--slide-channel-dir", channelDirCount);
  }

  function showPopUp() {
    $(".btn-compare").click(() => showExitIntentPopup("AppPlan"));
    $(".btn-compare-full").click(() => showExitIntentPopup("fullAppPlan"));
  }

  function showExitIntentPopup(modalId) {
    var popup = document.getElementById(modalId);
    var background = document.getElementById("popupBackground");

    if (!popup.classList.contains("active")) {
      popup.classList.add("active");
      background.style.opacity = 0;
      background.style.display = "block";
      background.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        background.style.opacity = 1;
      }, 10);
      document.body.style.overflow = "hidden"; // Desabilita o scroll do body
    }

    // Enviar o evento de "abertura-modal" ao abrir a modal
    pushGA4(event);

    document
      .getElementById("closeBtn")
      .addEventListener("click", () => closeExitIntentPopup(modalId));
    document
      .getElementById("closeBtnFull")
      .addEventListener("click", () => closeExitIntentPopup(modalId));
    document
      .getElementById("popupBackground")
      .addEventListener("click", () => closeExitIntentPopup(modalId));
  }

  function closeExitIntentPopup(modalId) {
    var popup = document.getElementById(modalId);
    var background = document.getElementById("popupBackground");

    popup.classList.remove("active");
    background.style.display = "none";
    document.body.style.overflow = ""; // Habilita o scroll do body novamente

    pushGA4(event);
  }

  function setupFaqAccordionClick() {
    const faqAccordion = document.getElementById("faqAccordion");
    if (faqAccordion) {
      faqAccordion.addEventListener("click", (event) => {
        const button = event.target.closest("button.accordion-button");
        if (button) {
          // Passa o botão como currentTarget do evento
          pushGA4({
            ...event,
            currentTarget: button,
          });
        }
      });
    }
  }

  const radiosBox = document.querySelectorAll(
    'input[type="radio"][name="netflix-bundle-app-popup"]'
  );

  function handleRadioChange(event) {
    // Determine which group of radios triggered the change event
    const radios = radiosBox;

    radios.forEach((radio) => {
      const label = radio.id;
      const content = document.querySelector(
        `.netflix-info[data-label="${label}"]`
      );
      const closestRowPop = radio.closest(".row-pop");

      if (radio.checked) {
        content?.classList.remove("d-none");

        const price = radio.dataset.price;
        const priceParts = price.split(",");
        const priceWhole = priceParts[0];
        const priceDecimal = priceParts[1];
        const priceHTML = `<span>R$</span> <strong>${priceWhole}</strong>,${priceDecimal}`;

        const valuePlan = closestRowPop.querySelector(".value-plan h5");
        valuePlan.innerHTML = priceHTML;

        const btnModalOffer = closestRowPop.querySelector(".btn-modal-offer");
        btnModalOffer.href = radio.dataset.producturl;

        const valuePlanMonth = closestRowPop.querySelector(
          ".value-plan-month span"
        );
        valuePlanMonth.innerHTML = radio.dataset.afterPrice;

        // Atualiza os atributos do botão com base nos dados do rádio
        btnModalOffer.setAttribute(
          "data-btn-prop-type",
          radio.dataset.btnPropType
        );
        btnModalOffer.setAttribute(
          "data-gtm-event-session",
          radio.dataset.gtmEventSession
        );
        btnModalOffer.setAttribute(
          "data-gtm-event-action",
          radio.dataset.gtmEventAction.replace("selecionou:", "clique:")
        );

        // Enviar o evento de "abertura-modal" ao abrir a modal
        pushGA4(event);
      } else {
        content?.classList.add("d-none");
      }
    });
  }

  document.querySelectorAll(".gtm-link-event").forEach((element) => {
    element.addEventListener("click", pushGA4);
  });

  $(".banner-content .owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    dots: false,
    nav: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    items: 1,
    animateOut: "fadeOut",
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: false,
  });

  $(".buyflow .owl-carousel").owlCarousel({
    margin: 15,
    loop: false,
    autoWidth: true,
    dots: false,
    nav: false,
    responsive: {
      0: {
        center: true,
        stagePadding: 30,
        margin: 10,
        dots: true,
        items: 1,
        autoWidth: false,
      },
      480: {
        center: false,
        stagePadding: 0,
      },
    },
  });

  $(".buyflow-channels .owl-carousel").owlCarousel({
    loop: true,
    margin: 30,
    dots: true,
    nav: false,
    items: 1,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
  });

  $(".price-plan .owl-carousel").owlCarousel({
    items: 2,
    margin: 30,
    stagePadding: 50,
    loop: false,
    dots: true,
    URLhashListener: true,
    startPosition: "URLHash",
    responsive: {
      0: {
        URLhashListener: false,
        items: 1,
        margin: 15,
        stagePadding: 30,
      },
      480: {
        URLhashListener: false,
        items: 1,
        margin: 30,
        stagePadding: 60,
      },
      768: {
        URLhashListener: false,
        items: 2,
        margin: 20,
      },
      1201: {
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        items: 2,
      },
    },
  });

  $(".popup-container .owl-carousel").owlCarousel({
    items: 1,
    dots: false,
    loop: false,
    margin: 15,
    center: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    freeDrag: false,
  });

  window.addEventListener("scroll", function () {
    let sessionHeader = document.querySelector("header");

    window.scrollY > 200
      ? sessionHeader.classList.add("header-sticky")
      : sessionHeader.classList.remove("header-sticky");
  });

  initScrollSuave();
  initScrollProducts();
  changePlanCard();
  showPopUp();
  setupFaqAccordionClick();

  // Attach event listeners to each radio button
  radiosBox.forEach((radio) => {
    radio.addEventListener("change", handleRadioChange);
  });

  lozad(".lozad", {
    load: function (el) {
      el.src = el.dataset.src;
      el.onload = function () {
        el.classList.add("fadeAnimation");
      };
    },
  }).observe();
});
