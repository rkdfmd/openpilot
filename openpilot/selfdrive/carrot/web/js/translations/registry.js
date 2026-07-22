"use strict";

(function initCarrotTranslations(global) {
  const api = global.CarrotTranslations || {};
  const packs = api.packs || {};
  const order = api.order || ["en", "ko", "zh"];
  const strings = api.strings || {};
  const actionLabels = api.actionLabels || {};
  const errorMessages = api.errorMessages || {};
  const driveModes = api.driveModes || {};

  function brandKoreanText(value) {
    if (typeof value !== "string") return value;
    if (value.includes("comma.ai/terms") || value.includes("Terms and Conditions") || value.includes("약관")) {
      return value;
    }
    return value
      .replace(/강릉 파일(?!럿)/g, "강릉 파일럿")
      .replaceAll("오픈파일럿", "강릉 파일럿")
      .replace(/(^|[^A-Za-z0-9_/])openpilot(?![A-Za-z0-9_/])/g, "$1강릉 파일럿");
  }

  function brandedKoreanStrings(lang, values) {
    if (lang !== "ko") return values;
    const branded = {};
    Object.entries(values).forEach(([key, value]) => {
      branded[key] = brandKoreanText(value);
    });
    return branded;
  }

  function rebuild() {
    const fallback = packs.en || packs.ko || {};
    order.forEach((lang) => {
      const pack = packs[lang] || {};
      const mergedStrings = Object.assign({}, fallback.strings || {}, pack.strings || {});
      strings[lang] = brandedKoreanStrings(lang, mergedStrings);
      actionLabels[lang] = Object.assign({}, fallback.actionLabels || {}, pack.actionLabels || {});
      errorMessages[lang] = Object.assign({}, fallback.errorMessages || {}, pack.errorMessages || {});
      driveModes[lang] = Object.assign({}, fallback.driveModes || {}, pack.driveModes || {});
    });
  }

  api.packs = packs;
  api.order = order;
  api.strings = strings;
  api.actionLabels = actionLabels;
  api.errorMessages = errorMessages;
  api.driveModes = driveModes;
  api.register = function register(lang, pack) {
    if (!lang || !pack) return;
    packs[lang] = Object.assign({}, packs[lang] || {}, pack);
    if (!order.includes(lang)) order.push(lang);
    rebuild();
  };
  api.getPack = function getPack(lang) {
    return packs[lang] || packs.en || packs.ko || {};
  };

  global.CarrotTranslations = api;
})(window);
