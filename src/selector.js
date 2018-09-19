const urlRegExp = /paraview-docs\/(nightly|(v\d\.\d))\/(cxx|python)\//;
const langageMap = { python: "cxx", cxx: "python" };

// ----------------------------------------------------------------------------

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = e => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.response);
        } else {
          reject(xhr, e);
        }
      }
    };

    // Make request
    xhr.open("GET", url, true);
    xhr.responseType = "text";
    xhr.send();
  });
}

// ----------------------------------------------------------------------------

function buildDropDown(versions, active, otherLang) {
  var buf = ["<select>"];
  versions.forEach(function(version) {
    buf.push(
      `<option value="${version}" ${
        version == active ? 'selected="selected"' : ""
      }>${version}</option>`
    );
  });
  buf.push("</select>");
  buf.push(
    `<a href="/paraview-docs/${active}/${otherLang}" style="display: inline-block; margin-left: 10px; color: black;">Go to ${otherLang} documentation</a>`
  );
  return buf.join("");
}

// ----------------------------------------------------------------------------

function patchURL(url, new_version, new_lang) {
  const lang = new_lang || urlRegExp.exec(window.location.href)[3];
  return url.replace(urlRegExp, `paraview-docs/${new_version}/${lang}/`);
}

// ----------------------------------------------------------------------------

function onSwitch(event) {
  var selected = event.target.value;
  var url = window.location.href;
  const newURL = patchURL(url, selected);

  if (newURL != url) {
    window.location.href = newURL;
  }
}

// ----------------------------------------------------------------------------

export function updateDropDown() {
  fetchText("/paraview-docs/versions").then(txt => {
    console.log("fetchText");
    const versions = txt.split("\n").filter(str => str.length);
    versions.sort();
    const match = urlRegExp.exec(window.location.href);
    if (match) {
      const lang = match[3];
      const otherLang = langageMap[lang] || "cxx";
      const activeVersion = match[1];
      var selectHTML = buildDropDown(versions, activeVersion, otherLang);
      if (lang === "python") {
        const container = document.querySelector(
          ".wy-side-nav-search li.version"
        );
        container.innerHTML = selectHTML;
        container.querySelector("select").addEventListener("change", onSwitch);
      } else if (lang === "cxx") {
        // create a div, add to header
        const projectContainer = document.querySelector("#projectname");
        const selectContainer = document.createElement("div");
        selectContainer.setAttribute("class", "versionSwitch");
        selectContainer.setAttribute(
          "style",
          "display: inline-flex; align-items: center; margin-left: 15px;"
        );
        selectContainer.innerHTML = selectHTML;

        projectContainer.appendChild(selectContainer);
        selectContainer
          .querySelector("select")
          .addEventListener("change", onSwitch);
      }
    }
  });
}

setTimeout(updateDropDown, 500);
