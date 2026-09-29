(function () {
  var SYMBOLS = {
    wallet:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="13" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M2.5 10.2h19" stroke="currentColor" stroke-width="1.7"/><circle cx="16.6" cy="14.4" r="1.05" fill="currentColor"/></svg>',
    ticket:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V10a1.6 1.6 0 0 0 0 3.2v1.3A2.5 2.5 0 0 1 17.5 17h-11A2.5 2.5 0 0 1 4 14.5V13.2a1.6 1.6 0 0 0 0-3.2V8.5Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.2v9.6" stroke="currentColor" stroke-width="1.7" stroke-dasharray="1.6 2.1"/></svg>',
    lock:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    doc:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.8h7.2L19 8.6V20a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 20V5A1.2 1.2 0 0 1 7 3.8Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M14 3.8V8.6H19" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'
  };

  var body = document.body;
  var view = body.dataset.view || "library";
  var currentFolder = body.dataset.folder || "";

  function icon(name) {
    return SYMBOLS[name] || SYMBOLS.doc;
  }

  function policyHref(policy) {
    return (view === "policy" ? "../" : "") + policy.href;
  }

  function renderTabs(policies) {
    var bar = document.getElementById("tab-bar");
    if (!bar) return;
    var visible = policies.slice(0, 5);
    var overflow = policies.length > 5;
    if (overflow) visible = policies.slice(0, 4);
    var html = visible
      .map(function (policy) {
        var current = policy.folder === currentFolder ? ' aria-current="page"' : "";
        return (
          '<a class="tab" href="' +
          policyHref(policy) +
          '"' +
          current +
          ">" +
          icon(policy.symbol) +
          "<span>" +
          escapeHtml(policy.title) +
          "</span></a>"
        );
      })
      .join("");
    if (overflow) {
      var moreHref = view === "policy" ? "../" : "./";
      html +=
        '<a class="tab" href="' +
        moreHref +
        '">' +
        SYMBOLS.doc +
        "<span>More</span></a>";
    }
    bar.innerHTML = html;
  }

  function renderLibrary(policies) {
    var library = document.getElementById("library");
    var status = document.getElementById("library-status");
    if (!library) return;
    if (!policies.length) {
      if (status) status.textContent = "No privacy policies are published yet.";
      library.innerHTML = "";
      return;
    }
    if (status) status.hidden = true;
    library.innerHTML = policies
      .map(function (policy) {
        return (
          '<a class="card" href="' +
          policy.href +
          '"><span class="card-icon">' +
          icon(policy.symbol) +
          '</span><span><span class="card-title">' +
          escapeHtml(policy.title) +
          '</span><span class="card-summary">' +
          escapeHtml(policy.summary) +
          '</span><span class="card-meta">Updated ' +
          escapeHtml(policy.updated) +
          '</span></span><span class="chevron" aria-hidden="true">›</span></a>'
        );
      })
      .join("");
  }

  function renderSections(policies) {
    var policy = policies.filter(function (item) {
      return item.folder === currentFolder;
    })[0];
    var mount = document.getElementById("sections");
    if (!policy || !mount || !policy.documents || policy.documents.length < 2) return;
    var file = currentFile();
    mount.innerHTML =
      '<nav class="segment" aria-label="Documents in this policy">' +
      policy.documents
        .map(function (doc) {
          var current = doc.file === file ? ' aria-current="page"' : "";
          var href = doc.file === "index.html" ? "./" : doc.file;
          return '<a href="' + href + '"' + current + ">" + escapeHtml(shortTitle(doc.title)) + "</a>";
        })
        .join("") +
      "</nav>";
  }

  function currentFile() {
    var path = window.location.pathname;
    if (path.endsWith("/")) return "index.html";
    var name = path.split("/").pop();
    return name || "index.html";
  }

  function shortTitle(title) {
    return title.replace(/\s+Privacy Policy$/i, "") || title;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var catalogURL = new URL(view === "policy" ? "../catalog.json" : "catalog.json", window.location.href);
  fetch(catalogURL.href, { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Catalog request failed");
      return response.json();
    })
    .then(function (catalog) {
      var policies = catalog.policies || [];
      renderTabs(policies);
      if (view === "library") renderLibrary(policies);
      if (view === "policy") renderSections(policies);
    })
    .catch(function () {
      var status = document.getElementById("library-status");
      if (status) {
        status.innerHTML =
          'The policy list could not be loaded. <a href="Docs_to_Wallet_Privacy_Policy/">Open the Docs2Wallet privacy policy</a>.';
      }
    });
})();
