const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

const container = document.getElementById("issuesContainer");
const loader = document.getElementById("loader");

let currentTab = "all";

// Load issues for tab on click
function switchTab(tab) {
  // currentTab = tab;
  // update active tab button styles
  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach(btn => {
    btn.classList.remove("bg-blue-700", "text-white");
    btn.classList.add("bg-gray-200", "text-gray-700");
  });

  const activeButton = document.getElementById(`tab-${tab}`);
  activeButton.classList.add("bg-blue-600", "text-white");
  activeButton.classList.remove("bg-gray-200", "text-gray-700");

  // ==== Another simplest way
  // document.querySelectorAll(".tab-button").forEach(btn => {
  //   btn.classList.remove("bg-blue-700", "text-white");
  //   btn.classList.add("bg-gray-200", "text-gray-700");
  // });
  // document.getElementById(`tab-${tab}`).classList.add("bg-blue-600", "text-white");
  // document.getElementById(`tab-${tab}`).classList.remove("bg-gray-200", "text-gray-700");

  loadIssues(tab);
}


async function searchIssue() {
  const text = document.getElementById("searchInput").value.trim();

  if (text === "") {
    // if search empty, reload current tab
    loadIssues(currentTab);
    return;
  }

  loader.classList.remove("hidden");
  container.innerHTML = "";

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
  const data = await res.json();

  document.getElementById("issue-count").innerText = data.data.length;

  displayIssues(data.data);
  loader.classList.add("hidden");
}

// load ISsue data
const loadIssues = async (type) => {
  let res = await fetch(API);
  let data = await res.json();
  let issues = data.data;

  if (type === "open") {
    issues = issues.filter(i => i.status === "open");
  } else if (type === "closed") {
    issues = issues.filter(i => i.status === "closed");
  }
  document.getElementById("issue-count").innerText = issues.length;

  // call the display function
  displayIssues(issues);
  // remove loader spinner
  loader.classList.add("hidden");
}

// display function for showing all data :

function displayIssues(issues) {
  container.innerHTML = "";

  issues.forEach(issue => {
    const card = document.createElement("div");
    // card.className = "bg-white p-4 rounded-lg shadow cursor-pointer border-t-3 ";

    const topBorderColor = issue.status === "open" ? "rgb(34,197,94)" : "rgb(124,58,237)";


    const statusStyle = issue.priority === "low" ? {
      bg: "#EEEFF2",
      text: "#9CA3AF",
      img: "./assets/Closed-Status.png"
    }
      : issue.priority === "medium" ? {
        bg: "#FFF6D1",
        text: "#F59E0B",
        img: "./assets/Open-Status.png"
      }
        :
        {
          bg: "#FEECEC",
          text: "#EF4444",
          img: "./assets/Open-Status.png"
        };

    //  const imgSrc = issue.priority === "low" ? "./assets/Closed-Status.png" : "./assets/Open-Status.png";
    // const statusBgColor = issue.priority === "low" ? "#EEEFF2"
    //   : issue.priority === "medium" ? "#FFF6D1" : "#FEECEC";
    // const statusTextColor = issue.priority === "low" ? "#9CA3AF"
    //   : issue.priority === "medium" ? "#F59E0B" : "#FEECEC";

    // const bugColor = issue.priority === "high" ? {
    //   bg: "#FEECEC",
    //   border: "#BBF7D0",
    //   text: "#00A96E"
    // }
    //   : {
    //     bg: "#FEECEC",
    //     border: "#FECACA",
    //     text: "#EF4444"
    //   };


    const labelStyles = {
      "bug": {
        bg: "#FEECEC",
        border: "#FECACA",
        text: "#EF4444",
        icon: `🐞`
      },
      "enhancement": {
        bg: "#DEFCE8",
        border: "#BBF7D0",
        text: "#00A96E",
        icon: "⚡"
      },
      "help wanted": {
        bg: "#FFF8DB",
        border: "#FDE68A",
        text: "#D97706",
        icon: "✨"
      },
      "good first issue": {
        "bg": "#E0F0FF",
        "border": "#A3D8FF",
        "text": "#0366D6",
        "icon": "🌱"
      }
    };


    const labelsHTML = issue.labels.map(label => {
      const style = labelStyles[label]
        || {
        bg: "#EEEFF2",
        border: "#D1D5DB",
        text: "#6B7280",
        icon: "🏷️"
      }; // default

      return `
    <span 
      class="flex items-center gap-0.5 px-2 py-1 rounded-2xl text-xs"
      style="background-color: ${style.bg}; border:1px solid ${style.border}; color: ${style.text};"
    >
      <span>${style.icon}</span>
      <span class="uppercase">${label}</span>
    </span>
  `;
    }).join("");



    card.innerHTML =
      `
       
    <div class="bg-white p-4 rounded-lg shadow cursor-pointer border-t-4 border-b-0 h-full"
        style="border-top-color: ${topBorderColor}; ">

        <div class="flex justify-between items-center mb-4">
            <img src="${statusStyle.img}" alt="">

            <span class="inline-block px-4 py-1 rounded-2xl text-xs uppercase"
                style="background-color: ${statusStyle.bg}; color:${statusStyle.text} ;">${issue.priority}</span>
        </div>

        <h4 class="font-semibold mb-2">${issue.title}</h4>
        <p class="text-sm text-gray-600 mb-2 line-clamp-2 ">${issue.description}</p>

        <div class="flex flex-wrap items-center gap-1.5 my-4">
            ${labelsHTML}
        </div>

        <div class="border-t border-t-gray-200 py-2 space-y-2">
            <p class="text-sm text-gray-500 mb-1">
                #${issue.id} by ${issue.assignee}
            </p>
            <p class="text-sm text-gray-500 mb-1">
                ${issue.createdAt}
            </p>
        </div>
    </div>
      `
      ;

    card.onclick = () => openModal(issue.id);
    container.appendChild(card);
  });
}

async function openModal(id) {
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
  const data = await res.json();
  const issue = data.data;

  document.getElementById("modalTitle").innerText = issue.title;
  document.getElementById("modalDesc").innerText = issue.description;
  document.getElementById("modalStatus").innerText = "Status: " + issue.status;
  document.getElementById("modalAuthor").innerText = "Author: " + issue.author;
  document.getElementById("modalPriority").innerText = "Priority: " + issue.priority;
  document.getElementById("modalLabel").innerText = "Label: " + issue.label;
  document.getElementById("modalDate").innerText = issue.createdAt;

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}


// On page load default tab
switchTab("all");