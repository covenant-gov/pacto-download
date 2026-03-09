const words = [
  "Private.",
  "Decentralized.",
  "Open-Source.",
  "Free.",
  "No KYC.",
  "No Metadata.",
  "No Data Leaks.",
  "No Ads.",
];
let currentIndex = 0;
const dynamicEl = document.getElementById("taglineDynamic");
let isAnimating = !1;
function createCharSpans(e) {
  const n = document.createDocumentFragment();
  return (
    e.split("").forEach((e) => {
      const t = document.createElement("span");
      ((t.className = "tagline-char"), (t.textContent = e), n.appendChild(t));
    }),
    n
  );
}
async function fadeOutChars() {
  const e = dynamicEl.querySelectorAll(".tagline-char");
  for (let n = e.length - 1; n >= 0; n--)
    (e[n].classList.add("fade-out"),
      await new Promise((e) => setTimeout(e, 80)));
  await new Promise((e) => setTimeout(e, 150));
}
async function fadeInChars(e) {
  dynamicEl.innerHTML = "";
  const n = createCharSpans(e);
  dynamicEl.appendChild(n);
  const t = dynamicEl.querySelectorAll(".tagline-char");
  for (let e = 0; e < t.length; e++)
    (t[e].classList.add("fade-in"),
      (t[e].style.animationDelay = 0.08 * e + "s"),
      await new Promise((e) => setTimeout(e, 80)));
}
async function rotateTagline() {
  isAnimating ||
    ((isAnimating = !0),
    await fadeOutChars(),
    (currentIndex = (currentIndex + 1) % words.length),
    await fadeInChars(words[currentIndex]),
    (isAnimating = !1));
}
(fadeInChars(words[0]), setInterval(rotateTagline, 3e3));
const GITHUB_REPO = "covenant-gov/pacto-app";
function getReleaseData() {
  const e = window.PACTO_DOWNLOAD_CONFIG || {};
  const n = e.repo || GITHUB_REPO;
  const t = e.releaseTag || "";
  const a = Array.isArray(e.files) ? e.files : [];
  return {
    repo: n,
    releaseTag: t,
    assets: a.map((e) => ({
      name: e,
      browser_download_url: `https://github.com/${n}/releases/download/${t}/${e}`,
    })),
  };
}
function getReleasesPageUrl(e, n) {
  return n
    ? `https://github.com/${e}/releases/tag/${n}`
    : `https://github.com/${e}/releases`;
}
function detectOS() {
  const e = (window.navigator.userAgent || "").toLowerCase(),
    n = (window.navigator.platform || "").toLowerCase();
  if (n.includes("mac")) {
    return {os: "macOS", buttonText: "Download for macOS", filePattern: /\.dmg$/i};
  }
  if (n.includes("win")) {
    return {
      os: "Windows",
      buttonText: "Download for Windows",
      filePattern: /\.(exe|msi)$/i,
    };
  }
  if (e.includes("android") || n.includes("android")) {
    return {os: "Android", buttonText: "Download for Android", filePattern: /\.apk$/i};
  }
  if (
    n.includes("iphone") ||
    n.includes("ipad") ||
    n.includes("ipod") ||
    (e.includes("mac") && "ontouchend" in document)
  ) {
    return {os: "iOS", buttonText: "Coming Soon", filePattern: null};
  }
  if (n.includes("linux") || n.includes("x11")) {
    return {
      os: "Linux",
      buttonText: "Download for Linux",
      filePattern: /\.(AppImage|deb|rpm|tar\.gz|tgz)$/i,
    };
  }
  return {os: "Other", buttonText: "Download Pacto", filePattern: null};
}
function setupDownloadButton() {
  const e = document.getElementById("downloadBtn"),
    n = document.getElementById("downloadText"),
    { os: t, buttonText: a, filePattern: o } = detectOS();
  if (((n.textContent = a), "iOS" === t))
    return (
      (e.href = "#"),
      (e.style.cursor = "default"),
      (e.style.pointerEvents = "none"),
      (e.style.background =
        "linear-gradient(135deg, #7c4cff 0%, #9966ff 100%)"),
      void (e.onclick = (e) => (e.preventDefault(), !1))
    );
  if ("Other" !== t) {
    const s = document.createElement("div");
    ((s.className = "os-icon"),
      (s.innerHTML = getOSIcon(t)),
      e.insertBefore(s, n));
  }
  const s = getReleaseData(),
    i = getReleasesPageUrl(s.repo, s.releaseTag);
  if (s.assets && o) {
    const n = s.assets.find((e) => o.test(e.name));
    n
      ? ((e.href = n.browser_download_url),
        console.log(`Found download: ${n.name}`))
      : ((e.href = i),
        console.log("No matching asset found, linking to releases page"));
  } else e.href = i;
}
function getOSIcon(e) {
  const n = {
    Windows:
      '<svg xmlns="http://www.w3.org/2000/svg" height="88" width="88" viewBox="0 0 88 88"><path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.678-.066-34.739z"/></svg>',
    macOS:
      '<svg height="800px" width="800px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.773 22.773"><g><path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"/><path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"/></g></svg>',
    Linux:
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 800"><path d="M143.3729,749.0272c41.2542,4.9268,87.6064,31.6514,126.3972,36.3696,38.9994,4.9243,51.0679-26.5583,51.0679-26.5583,0,0,43.8864-9.8113,90.025-10.9412,46.1834-1.2938,89.9009,9.6052,89.9009,9.6052,0,0,8.4778,19.4165,24.3035,27.8943,15.8257,8.6417,49.8983,9.8113,71.736-13.1959,21.8799-23.1736,80.256-52.3642,113.0348-70.611,32.9874-18.2891,26.9333-46.1809,6.223-54.6587-20.7102-8.4753-37.6633-21.8377-36.3696-47.4771,1.1274-25.4284-18.2891-42.3815-18.2891-42.3815,0,0,16.9953-55.9525,1.1696-102.3022-15.8257-46.1387-68.021-120.3405-108.1478-176.1266-40.1267-55.9525-6.0566-120.5491-42.5901-203.1021C475.2959-7.1355,380.5527-2.2484,329.4847,32.9913c-51.0679,35.2422-35.411,122.6375-32.9477,164.1027,2.4634,41.2542,1.1274,70.775-3.5908,81.3834-4.7181,10.7723-37.6634,49.8983-59.5432,82.6771-21.8377,32.9452-37.6658,100.9662-53.6579,129.0269-15.6593,27.8943-4.7181,53.3227-4.7181,53.3227,0,0-10.9387,3.7571-19.5829,22.0487-8.4778,18.0805-25.4309,26.7222-55.955,32.6124-30.3154,6.2205-30.3154,25.7637-23.0073,47.6435,7.3479,21.8377,0,34.0726-8.4778,61.9669-8.4754,27.8892,33.9484,36.3645,75.3689,41.2516ZM572.2094,621.7932c21.6712,9.4785,52.8211-3.7174,62.2997-13.1959,9.4388-9.4363,16.1187-23.4667,16.1187-23.4667,0,0,9.4785,4.7181,8.5175,19.707-1.0032,15.1999,6.5135,36.8712,20.7102,44.388,14.1967,7.4746,35.868,17.9117,24.6362,28.3512-11.4428,10.4396-74.7432,35.9102-93.6581,55.7861-18.7485,19.7492-43.3848,35.9102-58.3761,31.1498-15.1552-4.7181-28.3934-25.4284-21.8774-55.7439,6.7221-30.1888,12.4013-63.3029,11.4403-82.2178-1.0008-18.9149-4.7181-44.3855,0-48.1451,4.7181-3.7174,12.2349-1.922,12.2349-1.922,0,0-3.7621,35.8754,17.9539,45.3093ZM431.5758,110.7837c20.8767,0,37.7056,20.7102,37.7056,46.1809,0,18.0805-8.4778,33.7399-20.8791,41.2566-3.1313-1.2938-6.3894-2.7564-9.9802-4.2613,7.5168-3.7149,12.7341-13.1935,12.7341-24.1346,0-14.3209-8.8081-26.0964-19.8759-26.0964-10.7723,0-19.7517,11.7731-19.7517,26.0964,0,5.2223,1.2963,10.4395,3.4244,14.532-6.5136-2.6322-12.4013-4.8845-17.1195-6.6799-2.4634-6.223-3.926-13.2382-3.926-20.7102.0025-25.4707,16.7868-46.1834,37.6683-46.1834ZM379.8796,190.3717c10.2732,1.7954,38.4978,14.0303,48.9398,17.7875,10.4396,3.5908,22.004,10.2707,20.8767,16.9531-1.2938,6.8885-6.6799,6.8885-20.8767,15.5327-14.0303,8.4778-44.6785,27.3927-54.4923,28.6864-9.7716,1.2938-15.3241-4.219-25.7662-10.9412-10.4395-6.8488-30.02-22.8409-25.0957-31.3162,0,0,15.3241-11.7333,22.0065-17.7453,6.6825-6.223,23.9683-20.8791,34.4079-18.9571ZM334.8658,118.1341c16.4515,0,29.856,19.5829,29.856,43.7175,0,4.3854-.5016,8.4753-1.2938,12.5677-4.0924,1.2938-8.1823,3.4244-12.1108,6.8488-1.9195,1.629-3.7174,3.0892-5.3439,4.7181,2.5876-4.8845,3.5908-11.8997,2.4212-19.2501-2.2548-13.0271-11.0653-22.672-19.7095-21.3782-8.6864,1.4626-13.864,13.4045-11.7756,26.6005,2.297,13.3623,10.9387,23.0048,19.7492,21.5446.5016-.1664.961-.3328,1.4626-.5016-4.2165,4.0924-8.1426,7.6831-12.2349,10.6059-11.8997-5.555-20.7102-22.1729-20.7102-41.7558.0024-24.301,13.1959-43.7175,29.6896-43.7175ZM243.2118,434.0599c16.9531-26.7222,27.8918-85.1405,44.8449-104.557,17.122-19.3743,30.3154-60.6706,24.3035-78.9175,0,0,36.536,43.7175,61.9669,36.536,25.4706-7.3504,82.7193-49.8983,91.1946-42.5901,8.4778,7.3479,81.3834,167.691,88.7313,218.7589,7.3504,51.0257-4.8846,90.0275-4.8846,90.0275,0,0-27.8918-7.3504-31.485,9.6027-3.5908,17.1195-3.5908,79.1286-3.5908,79.1286,0,0-37.7056,52.1953-96.0817,60.837-58.3761,8.4778-87.6064,2.297-87.6064,2.297l-32.7788-37.5392s25.4731-3.7571,21.8799-29.3545c-3.5908-25.4284-77.8348-60.6731-91.1971-92.3245-13.3573-31.6514-2.4583-85.1405,14.7033-111.9048ZM98.8608,625.5528c2.9228-12.5255,40.7525-12.5255,55.2844-21.3361,14.532-8.8106,17.4522-34.1148,29.188-40.7948,11.5645-6.8488,32.9452,17.4547,41.7558,31.1473,8.6442,13.3624,41.7582,71.7807,55.287,86.3101,13.6951,14.6561,26.2653,34.0726,22.3393,51.5273-3.7149,17.4522-24.301,30.1888-24.301,30.1888-18.4132,5.6791-69.7742-16.4937-93.1142-26.2653-23.34-9.8113-82.7194-12.7366-90.3603-21.3783-7.8495-8.8106,3.7571-28.227,6.8463-46.6428,2.7539-18.6218-5.8878-30.1888-2.9253-42.7565Z"/></svg>',
    Android:
      '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill="#8A5CFF" d="M31.69,24.5h0c-.01-.07-.02-.13-.03-.19-.07-.4-.15-.79-.24-1.17-.17-.67-.37-1.33-.62-1.97-.21-.54-.45-1.07-.71-1.58-.34-.65-.73-1.28-1.15-1.88-.52-.73-1.1-1.42-1.74-2.05-.27-.27-.54-.52-.83-.77-.62-.53-1.28-1.02-1.97-1.45,0-.01.01-.02.02-.03.32-.55.64-1.1.96-1.65.31-.54.62-1.07.93-1.61.22-.39.45-.77.67-1.16.05-.09.09-.19.13-.28.09-.27.09-.55.02-.82-.02-.07-.04-.13-.07-.19-.03-.06-.06-.12-.09-.18-.12-.2-.29-.37-.5-.5-.19-.11-.4-.18-.62-.2-.09,0-.18,0-.27,0-.08,0-.15.02-.22.04-.26.07-.51.21-.7.42-.07.08-.13.16-.18.25-.22.39-.45.77-.67,1.16l-.93,1.61c-.32.55-.64,1.1-.96,1.65-.03.06-.07.12-.1.18-.05-.02-.1-.04-.14-.06-1.76-.67-3.66-1.04-5.65-1.04-.05,0-.11,0-.16,0-1.77.02-3.47.33-5.06.88-.18.06-.36.13-.54.2-.03-.06-.07-.11-.1-.17-.32-.55-.64-1.1-.96-1.65-.31-.54-.62-1.07-.93-1.61-.22-.39-.45-.77-.67-1.16-.05-.09-.11-.17-.18-.25-.19-.21-.44-.35-.7-.42-.07-.02-.15-.03-.22-.04-.09,0-.18-.01-.27,0-.22.02-.43.09-.62.2-.21.13-.38.3-.5.5-.03.06-.07.12-.09.18-.03.06-.05.13-.07.19-.07.26-.07.55.02.82.03.1.07.19.13.28.22.39.45.77.67,1.16.31.54.62,1.07.93,1.61.32.55.64,1.1.96,1.65,0,0,0,0,0,.01-.64.4-1.25.84-1.83,1.33-.35.29-.68.59-1,.91-.64.63-1.22,1.32-1.74,2.05-.43.6-.81,1.22-1.15,1.88-.27.51-.5,1.04-.71,1.58-.25.64-.46,1.3-.62,1.97-.09.39-.17.78-.24,1.17-.01.06-.02.13-.03.19-.04.23-.07.46-.09.69h31.57c-.03-.23-.06-.46-.09-.69ZM9.9,20.18c-.52.78-1.45,1.07-2.08.65-.63-.42-.72-1.39-.2-2.17.52-.78,1.45-1.07,2.08-.65.63.42.72,1.39.2,2.17ZM24.21,20.83c-.63.42-1.56.13-2.08-.65-.52-.78-.43-1.75.2-2.17.63-.42,1.56-.13,2.08.65.52.78.43,1.75-.2,2.17Z"/></svg>',
  };
  return "Mac Silicon" === e || "Mac Intel" === e ? n.macOS : n[e] || n.Linux;
}
function simplifyFilename(e) {
  const n =
    (t = e).includes("aarch64") || t.includes("arm64")
      ? "ARM64"
      : t.includes("x86_64") || t.includes("x64") || t.includes("amd64")
        ? "x64"
        : t.includes("i686") || t.includes("i386") || t.includes("x86")
          ? "x86"
          : null;
  var t;
  return e.includes(".exe")
    ? { platform: "Windows", variant: n ? `${n} Installer` : "Installer" }
    : e.includes(".msi")
      ? { platform: "Windows", variant: n ? `${n} MSI` : "MSI" }
      : e.includes(".apk")
        ? { platform: "Android", variant: n || null }
        : e.includes(".dmg")
          ? { platform: "macOS", variant: n || null }
          : e.includes(".AppImage")
            ? {
                platform: "Linux",
                variant: n ? `AppImage ${n}` : "AppImage",
              }
            : e.includes(".deb")
              ? {
                  platform: "Linux",
                  variant: n ? `Debian ${n}` : "Debian",
                }
              : e.includes(".rpm")
                ? { platform: "Linux", variant: n ? `RPM ${n}` : "RPM" }
                : e.includes(".tar.gz") || e.includes(".tgz")
                  ? {
                      platform: "Linux",
                      variant: n ? `Archive ${n}` : "Archive",
                    }
                  : { platform: e, variant: null };
}
function populateAllDownloads() {
  const e = document.getElementById("downloadsList");
  const n = getReleaseData();
  if (n.assets && n.assets.length > 0) {
    const t = n.assets.filter(
        (e) =>
          !(
            e.name.endsWith(".sig") ||
            e.name.endsWith(".txt") ||
            e.name.endsWith(".json") ||
            (e.name.includes(".dmg") &&
              (e.name.includes("aarch64") || e.name.includes("arm64")))
          ),
      ),
      { os: a } = detectOS();
    (t.sort((e, n) => {
      const t = (e) => {
          const n = e.includes(".exe") || e.includes(".msi"),
            t = e.includes(".dmg"),
            o = e.includes(".apk"),
            s = !n && !t && !o;
          return "Windows" === a && n
            ? e.includes(".exe")
              ? 1
              : 2
            : ("macOS" === a && t) ||
                ("Android" === a && o) ||
                ("Linux" === a && s)
              ? 1
              : e.includes(".exe")
                ? 10
                : e.includes(".msi")
                  ? 11
                  : e.includes(".dmg")
                    ? 20
                    : e.includes(".apk")
                      ? 30
                      : 40;
        },
        o = t(e.name),
        s = t(n.name);
      return o !== s ? o - s : e.name.localeCompare(n.name);
    }),
      t.forEach((t) => {
        const a = document.createElement("div");
        a.className = "download-item";
        const o = document.createElement("div");
        o.className = "download-name";
        const s = document.createElement("div");
        s.className = "os-icon";
        const { platform: i, variant: c } = simplifyFilename(t.name);
        let l = "Linux";
        (t.name.includes(".exe") || t.name.includes(".msi")
          ? (l = "Windows")
          : t.name.includes(".apk")
            ? (l = "Android")
            : t.name.includes(".dmg") && (l = "macOS"),
          (s.innerHTML = getOSIcon(l)));
        const d = document.createElement("div");
        d.className = "download-name-text";
        const r = document.createElement("span");
        if (
          ((r.className = "download-name-platform"),
          (r.textContent = i),
          d.appendChild(r),
          c)
        ) {
          const e = document.createElement("span");
          ((e.className = "download-name-variant"),
            (e.textContent = c),
            d.appendChild(e));
        }
        (o.appendChild(s), o.appendChild(d));
        const m = document.createElement("div");
        m.className = "download-links";
        const u = document.createElement("a");
        ((u.href = t.browser_download_url),
          (u.className = "download-link"),
          (u.textContent = "Download"),
          (u.target = "_blank"),
          m.appendChild(u));
        const g = n.assets.find((e) => e.name === `${t.name}.sig`);
        if (g) {
          const e = document.createElement("a");
          ((e.href = g.browser_download_url),
            (e.className = "download-link sig"),
            (e.textContent = ".sig"),
            (e.target = "_blank"),
            m.appendChild(e));
        }
        (a.appendChild(o), a.appendChild(m), e.appendChild(a));
      }));
  } else
    e.innerHTML =
      '<p style="color: #9ea2c1; text-align: center;">No downloads available</p>';
}
const toggleBtn = document.getElementById("toggleDownloads"),
  downloadsList = document.getElementById("downloadsList");
let isOpen = !1;
(toggleBtn.addEventListener("click", () => {
  ((isOpen = !isOpen),
    downloadsList.classList.toggle("open", isOpen),
    (toggleBtn.textContent = isOpen
      ? "Hide all downloads"
      : "Show All Downloads"),
    isOpen && 0 === downloadsList.children.length && populateAllDownloads());
}),
  setupDownloadButton());
