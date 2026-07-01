const PAPER_KEY = "researchmate-ai-papers";
const PLAN_KEY = "researchmate-ai-plan";

function getPapers() {
  return JSON.parse(localStorage.getItem(PAPER_KEY)) || [];
}

function savePapers(papers) {
  localStorage.setItem(PAPER_KEY, JSON.stringify(papers));
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scrollToPlanner() {
  document.getElementById("plannerSection").scrollIntoView({ behavior: "smooth" });
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s,]+/)
    .map(word => word.trim())
    .filter(word => word.length > 2);
}

function getKeywordsFromPaper(paper) {
  return tokenize(paper.keywords);
}

function generateResearchPlan() {
  const topic = document.getElementById("researchTopic").value.trim();
  const field = document.getElementById("researchField").value;
  const goal = document.getElementById("researchGoal").value;
  const timeframe = document.getElementById("timeframe").value;

  if (!topic) {
    alert("Please enter your research topic.");
    return;
  }

  const keywords = generateSearchKeywords(topic, field);
  const questions = generateResearchQuestions(topic);
  const methodology = suggestMethodology(field, goal);
  const phases = generatePhases(timeframe);

  const plan = {
    topic,
    field,
    goal,
    timeframe,
    keywords,
    questions,
    methodology,
    phases,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  renderResearchPlan(plan);
}

function generateSearchKeywords(topic, field) {
  const base = tokenize(topic);
  const fieldTerms = {
    "Computer Science": ["system design", "software framework", "user evaluation"],
    "Data Science": ["prediction model", "data analytics", "machine learning"],
    "Artificial Intelligence": ["AI model", "explainable AI", "intelligent system"],
    "Education Technology": ["e-learning", "student engagement", "adaptive learning"],
    "Cybersecurity": ["threat detection", "security analytics", "risk assessment"],
    "Healthcare Technology": ["digital health", "clinical decision support", "patient data"],
    "Business Technology": ["digital transformation", "process automation", "business analytics"],
    "Software Engineering": ["software quality", "requirement analysis", "agile development"]
  };

  return [...new Set([...base, ...(fieldTerms[field] || []), "research gap", "systematic review"])];
}

function generateResearchQuestions(topic) {
  return [
    `What are the current approaches used in ${topic}?`,
    `What limitations or gaps are commonly reported in ${topic}?`,
    `How can ${topic} be improved using a more practical or intelligent solution?`,
    `What evaluation metrics are suitable for measuring the effectiveness of ${topic}?`
  ];
}

function suggestMethodology(field, goal) {
  if (goal.includes("literature")) {
    return "Systematic Literature Review or Scoping Review";
  }

  if (goal.includes("gap")) {
    return "Literature Matrix Analysis with Thematic Gap Mapping";
  }

  if (field.includes("Artificial Intelligence") || field.includes("Data Science")) {
    return "Design Science Research with Machine Learning Experiment and Evaluation Metrics";
  }

  if (field.includes("Education")) {
    return "Mixed Method Study with Survey, Usability Testing, and Learning Analytics";
  }

  return "Design Science Research with Prototype Development and User Evaluation";
}

function generatePhases(timeframe) {
  const phaseMap = {
    "2 weeks": [
      "Day 1-3: Define topic, scope, and research questions",
      "Day 4-7: Search and collect at least 10 relevant papers",
      "Day 8-11: Build literature matrix and identify repeated themes",
      "Day 12-14: Write summary, gaps, and next research direction"
    ],
    "1 month": [
      "Week 1: Define research scope and collect initial literature",
      "Week 2: Review papers and classify methods, findings, and gaps",
      "Week 3: Compare studies and identify research opportunities",
      "Week 4: Draft literature review structure and research framework"
    ],
    "3 months": [
      "Month 1: Literature collection and screening",
      "Month 2: Literature matrix, gap analysis, and framework design",
      "Month 3: Methodology planning and proposal writing"
    ],
    "6 months": [
      "Month 1-2: Literature review and theoretical foundation",
      "Month 3: Research gap mapping and framework development",
      "Month 4: Methodology and instrument design",
      "Month 5: Prototype or experiment planning",
      "Month 6: Proposal/report writing and refinement"
    ],
    "1 year": [
      "Quarter 1: Literature review and problem formulation",
      "Quarter 2: Framework design and methodology preparation",
      "Quarter 3: Prototype, data collection, or experiment execution",
      "Quarter 4: Evaluation, writing, and publication preparation"
    ]
  };

  return phaseMap[timeframe] || phaseMap["1 month"];
}

function renderResearchPlan(plan) {
  document.getElementById("researchPlan").innerHTML = `
    <h3>${escapeHTML(plan.topic)}</h3>
    <p><strong>Field:</strong> ${escapeHTML(plan.field)}</p>
    <p><strong>Goal:</strong> ${escapeHTML(plan.goal)}</p>
    <p><strong>Timeframe:</strong> ${escapeHTML(plan.timeframe)}</p>

    <h4>Suggested Search Keywords</h4>
    <ul>
      ${plan.keywords.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
    </ul>

    <h4>Possible Research Questions</h4>
    <ol>
      ${plan.questions.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
    </ol>

    <h4>Suggested Methodology</h4>
    <p>${escapeHTML(plan.methodology)}</p>

    <h4>Research Timeline</h4>
    <ol>
      ${plan.phases.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
    </ol>
  `;
}

function copyResearchPlan() {
  const plan = JSON.parse(localStorage.getItem(PLAN_KEY));

  if (!plan) {
    alert("Please generate a research plan first.");
    return;
  }

  const text = `
Research Topic: ${plan.topic}
Field: ${plan.field}
Goal: ${plan.goal}
Timeframe: ${plan.timeframe}

Suggested Keywords:
${plan.keywords.map(item => `- ${item}`).join("\n")}

Research Questions:
${plan.questions.map((item, index) => `${index + 1}. ${item}`).join("\n")}

Suggested Methodology:
${plan.methodology}

Timeline:
${plan.phases.map((item, index) => `${index + 1}. ${item}`).join("\n")}
  `.trim();

  navigator.clipboard.writeText(text)
    .then(() => alert("Research plan copied."))
    .catch(() => alert("Unable to copy. Please copy manually."));
}

function addPaper() {
  const title = document.getElementById("paperTitle").value.trim();
  const authors = document.getElementById("authors").value.trim();
  const year = document.getElementById("year").value.trim();
  const sourceType = document.getElementById("sourceType").value;
  const methodology = document.getElementById("methodology").value;
  const relevance = Number(document.getElementById("relevance").value);
  const quality = Number(document.getElementById("quality").value) || 1;
  const status = document.getElementById("paperStatus").value;
  const keywords = document.getElementById("keywords").value.trim();
  const findings = document.getElementById("findings").value.trim();
  const researchGap = document.getElementById("researchGap").value.trim();
  const link = document.getElementById("paperLink").value.trim();

  if (!title || !authors || !year) {
    alert("Please enter paper title, author(s), and year.");
    return;
  }

  const papers = getPapers();

  papers.unshift({
    id: Date.now(),
    title,
    authors,
    year,
    sourceType,
    methodology,
    relevance,
    quality: Math.max(1, Math.min(10, quality)),
    status,
    keywords,
    findings,
    researchGap,
    link,
    createdAt: new Date().toISOString()
  });

  savePapers(papers);
  clearPaperForm();
  renderApp();
}

function clearPaperForm() {
  document.getElementById("paperTitle").value = "";
  document.getElementById("authors").value = "";
  document.getElementById("year").value = "";
  document.getElementById("quality").value = 7;
  document.getElementById("keywords").value = "";
  document.getElementById("findings").value = "";
  document.getElementById("researchGap").value = "";
  document.getElementById("paperLink").value = "";
}

function deletePaper(id) {
  const confirmed = confirm("Delete this paper?");
  if (!confirmed) return;

  const papers = getPapers().filter(paper => paper.id !== id);
  savePapers(papers);
  renderApp();
}

function updatePaperStatus(id, status) {
  const papers = getPapers().map(paper => {
    if (paper.id === id) {
      return { ...paper, status };
    }

    return paper;
  });

  savePapers(papers);
  renderApp();
}

function calculateResearchScore(papers) {
  if (papers.length === 0) return 0;

  const reviewed = papers.filter(paper => paper.status === "Reviewed" || paper.status === "Key Paper").length;
  const highRelevance = papers.filter(paper => paper.relevance >= 8).length;
  const gapCount = papers.filter(paper => paper.researchGap.trim()).length;
  const methodCount = new Set(papers.map(paper => paper.methodology)).size;
  const averageQuality = papers.reduce((sum, paper) => sum + Number(paper.quality), 0) / papers.length;

  let score = 0;

  score += Math.min(25, (reviewed / papers.length) * 25);
  score += Math.min(20, highRelevance * 4);
  score += Math.min(20, gapCount * 4);
  score += Math.min(15, methodCount * 3);
  score += Math.min(20, averageQuality * 2);

  return Math.round(Math.min(100, score));
}

function renderDashboard(papers) {
  const reviewed = papers.filter(paper => paper.status === "Reviewed" || paper.status === "Key Paper").length;
  const highRelevance = papers.filter(paper => paper.relevance >= 8).length;
  const gaps = papers.filter(paper => paper.researchGap.trim()).length;
  const avgQuality = papers.length
    ? papers.reduce((sum, paper) => sum + Number(paper.quality), 0) / papers.length
    : 0;
  const methods = new Set(papers.map(paper => paper.methodology)).size;
  const keywords = new Set(papers.flatMap(getKeywordsFromPaper)).size;
  const score = calculateResearchScore(papers);

  document.getElementById("totalPapers").textContent = papers.length;
  document.getElementById("reviewedPapers").textContent = reviewed;
  document.getElementById("highRelevance").textContent = highRelevance;
  document.getElementById("gapCount").textContent = gaps;
  document.getElementById("avgQuality").textContent = `${avgQuality.toFixed(1)}/10`;
  document.getElementById("methodCount").textContent = methods;
  document.getElementById("keywordCount").textContent = keywords;
  document.getElementById("researchScore").textContent = `${score}%`;

  document.getElementById("heroScore").textContent = `${score}%`;
  document.getElementById("heroProgress").style.width = `${score}%`;

  if (papers.length === 0) {
    document.getElementById("heroStatus").textContent = "No papers added yet";
  } else if (score >= 80) {
    document.getElementById("heroStatus").textContent = "Strong literature foundation";
  } else if (score >= 50) {
    document.getElementById("heroStatus").textContent = "Research review in progress";
  } else {
    document.getElementById("heroStatus").textContent = "Need more reviewed papers";
  }
}

function getStats(papers, key) {
  const stats = {};

  papers.forEach(paper => {
    const value = paper[key];
    stats[value] = (stats[value] || 0) + 1;
  });

  return Object.entries(stats).sort((a, b) => b[1] - a[1]);
}

function renderBreakdown(containerId, stats, suffix) {
  const box = document.getElementById(containerId);

  if (stats.length === 0) {
    box.innerHTML = `<p class="empty-text">No data yet.</p>`;
    return;
  }

  const max = Math.max(...stats.map(item => item[1]));

  box.innerHTML = stats.map(([label, value]) => {
    const percentage = Math.round((value / max) * 100);

    return `
      <div class="breakdown-item">
        <div class="breakdown-top">
          <span>${escapeHTML(label)}</span>
          <span>${value} ${suffix}</span>
        </div>
        <div class="breakdown-bg">
          <div class="breakdown-fill" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderKeywords(papers) {
  const box = document.getElementById("keywordCloud");
  const stats = {};

  papers.flatMap(getKeywordsFromPaper).forEach(keyword => {
    stats[keyword] = (stats[keyword] || 0) + 1;
  });

  const entries = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  if (entries.length === 0) {
    box.innerHTML = `<p class="empty-text">No keywords yet.</p>`;
    return;
  }

  box.innerHTML = entries.map(([keyword, count]) => `
    <span class="keyword-pill">${escapeHTML(keyword)} · ${count}</span>
  `).join("");
}

function renderGaps(papers) {
  const box = document.getElementById("gapThemes");
  const gaps = papers
    .filter(paper => paper.researchGap.trim())
    .slice(0, 6);

  if (gaps.length === 0) {
    box.innerHTML = `<p class="empty-text">No research gaps recorded yet.</p>`;
    return;
  }

  box.innerHTML = gaps.map(paper => `
    <div class="gap-item">
      <strong>${escapeHTML(paper.title)}</strong>
      <p>${escapeHTML(paper.researchGap)}</p>
    </div>
  `).join("");
}

function renderInsight(papers) {
  const title = document.getElementById("insightTitle");
  const text = document.getElementById("insightText");

  if (papers.length === 0) {
    title.textContent = "No insight yet";
    text.textContent = "Add papers to receive research direction insights.";
    return;
  }

  const reviewed = papers.filter(paper => paper.status === "Reviewed" || paper.status === "Key Paper").length;
  const gaps = papers.filter(paper => paper.researchGap.trim()).length;
  const keyPapers = papers.filter(paper => paper.status === "Key Paper").length;
  const methods = new Set(papers.map(paper => paper.methodology)).size;
  const newestYear = Math.max(...papers.map(paper => Number(paper.year) || 0));

  if (papers.length < 10) {
    title.textContent = "Need more literature coverage";
    text.textContent = "Your matrix is still small. Add at least 10 to 20 papers to build a stronger literature foundation.";
    return;
  }

  if (reviewed < papers.length / 2) {
    title.textContent = "Reading progress needs improvement";
    text.textContent = "Many papers are not reviewed yet. Focus on summarizing findings and gaps for each paper.";
    return;
  }

  if (gaps < 5) {
    title.textContent = "Research gap mapping is weak";
    text.textContent = "Add more gap or limitation notes. This will help you define a stronger problem statement.";
    return;
  }

  if (keyPapers < 3) {
    title.textContent = "Identify key papers";
    text.textContent = "Mark at least 3 highly relevant studies as Key Paper to support your theoretical foundation.";
    return;
  }

  if (methods < 3) {
    title.textContent = "Methodology diversity is limited";
    text.textContent = "Your literature uses limited methodology types. Add papers with different research designs for better comparison.";
    return;
  }

  if (newestYear < 2023) {
    title.textContent = "Add newer literature";
    text.textContent = "Your newest paper may be outdated. Add recent papers from the last 2 to 3 years.";
    return;
  }

  title.textContent = "Strong research foundation";
  text.textContent = "Your literature matrix has good coverage, reviewed papers, gap notes, and methodology variety. You can start building your research framework.";
}

function updateFilters(papers) {
  const methodFilter = document.getElementById("filterMethod");
  const current = methodFilter.value;
  const methods = ["All Methodologies", ...new Set(papers.map(paper => paper.methodology))];

  methodFilter.innerHTML = methods.map(method => `<option>${escapeHTML(method)}</option>`).join("");

  if (methods.includes(current)) {
    methodFilter.value = current;
  }
}

function renderPapers(papers) {
  const box = document.getElementById("paperList");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const method = document.getElementById("filterMethod").value;
  const status = document.getElementById("filterStatus").value;

  let filtered = papers;

  if (method !== "All Methodologies") {
    filtered = filtered.filter(paper => paper.methodology === method);
  }

  if (status !== "All Status") {
    filtered = filtered.filter(paper => paper.status === status);
  }

  if (search) {
    filtered = filtered.filter(paper => {
      const combined = `${paper.title} ${paper.authors} ${paper.year} ${paper.keywords} ${paper.findings} ${paper.researchGap}`.toLowerCase();
      return combined.includes(search);
    });
  }

  if (filtered.length === 0) {
    box.innerHTML = `
      <div class="empty-box wide">
        <h3>No papers found</h3>
        <p>Add papers or adjust your search/filter.</p>
      </div>
    `;
    return;
  }

  box.innerHTML = filtered.map(paper => {
    const cardClass = paper.status === "Key Paper" ? "key" : paper.status === "Reviewed" ? "reviewed" : "";

    return `
      <article class="paper-card ${cardClass}">
        <div class="paper-top">
          <div>
            <span class="badge">${escapeHTML(paper.sourceType)}</span>
            <span class="badge purple">${escapeHTML(paper.methodology)}</span>
            <span class="badge ${paper.status === "Reviewed" || paper.status === "Key Paper" ? "green" : "orange"}">${escapeHTML(paper.status)}</span>
          </div>
          <span class="badge">Quality ${paper.quality}/10</span>
        </div>

        <h3>${escapeHTML(paper.title)}</h3>
        <p><strong>Authors:</strong> ${escapeHTML(paper.authors)} · <strong>Year:</strong> ${escapeHTML(paper.year)}</p>
        <p><strong>Relevance:</strong> ${paper.relevance}/10</p>
        <p><strong>Keywords:</strong> ${escapeHTML(paper.keywords || "No keywords added")}</p>
        <p><strong>Findings:</strong> ${escapeHTML(paper.findings || "No findings added")}</p>
        <p><strong>Gap:</strong> ${escapeHTML(paper.researchGap || "No gap added")}</p>

        ${paper.link ? `<p><a href="${escapeHTML(paper.link)}" target="_blank" rel="noopener">Open Paper Link</a></p>` : ""}

        <div class="paper-actions">
          <button onclick="updatePaperStatus(${paper.id}, 'Reviewed')">Mark Reviewed</button>
          <button class="secondary" onclick="updatePaperStatus(${paper.id}, 'Key Paper')">Key Paper</button>
          <button class="dark" onclick="updatePaperStatus(${paper.id}, 'Reading')">Reading</button>
          <button class="danger" onclick="deletePaper(${paper.id})">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function exportCSV() {
  const papers = getPapers();

  if (papers.length === 0) {
    alert("No papers to export.");
    return;
  }

  const headers = [
    "Title",
    "Authors",
    "Year",
    "Source Type",
    "Methodology",
    "Relevance",
    "Quality",
    "Status",
    "Keywords",
    "Findings",
    "Research Gap",
    "Link"
  ];

  const rows = papers.map(paper => [
    paper.title,
    paper.authors,
    paper.year,
    paper.sourceType,
    paper.methodology,
    paper.relevance,
    paper.quality,
    paper.status,
    paper.keywords,
    paper.findings,
    paper.researchGap,
    paper.link
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  downloadFile(csv, "researchmate-literature-matrix.csv", "text/csv");
}

function exportJSON() {
  const papers = getPapers();

  if (papers.length === 0) {
    alert("No papers to export.");
    return;
  }

  downloadFile(
    JSON.stringify(papers, null, 2),
    "researchmate-literature-matrix.json",
    "application/json"
  );
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function printReport() {
  window.print();
}

function resetAllData() {
  const confirmed = confirm("Reset all ResearchMate AI data?");
  if (!confirmed) return;

  localStorage.removeItem(PAPER_KEY);
  localStorage.removeItem(PLAN_KEY);
  renderApp();

  document.getElementById("researchPlan").innerHTML = `
    <h3>No research plan yet</h3>
    <p>Enter your topic and generate an AI-style research plan.</p>
  `;
}

function loadDemoData() {
  const now = Date.now();

  const demo = [
    {
      id: now + 1,
      title: "Explainable AI for Adaptive E-Learning Recommendation Systems",
      authors: "Rahman et al.",
      year: "2025",
      sourceType: "Journal Article",
      methodology: "Machine Learning",
      relevance: 10,
      quality: 9,
      status: "Key Paper",
      keywords: "explainable AI, recommender system, e-learning, personalization",
      findings: "The study shows that explainable recommendations can improve learner trust and system transparency.",
      researchGap: "Limited real-world validation with higher education students over a long period.",
      link: "",
      createdAt: new Date().toISOString()
    },
    {
      id: now + 2,
      title: "Learning Analytics Dashboard for Student Engagement Prediction",
      authors: "Lim and Wong",
      year: "2024",
      sourceType: "Conference Paper",
      methodology: "Quantitative",
      relevance: 8,
      quality: 8,
      status: "Reviewed",
      keywords: "learning analytics, student engagement, dashboard, prediction",
      findings: "Engagement indicators can support early intervention for at-risk students.",
      researchGap: "The dashboard design did not include student-centered usability evaluation.",
      link: "",
      createdAt: new Date().toISOString()
    },
    {
      id: now + 3,
      title: "Design Science Research in Educational Technology Systems",
      authors: "Tan et al.",
      year: "2023",
      sourceType: "Journal Article",
      methodology: "Design Science",
      relevance: 8,
      quality: 7,
      status: "Reading",
      keywords: "design science, educational technology, prototype, evaluation",
      findings: "Design science provides a structured process for building and evaluating educational systems.",
      researchGap: "More practical examples are needed for AI-enabled learning platforms.",
      link: "",
      createdAt: new Date().toISOString()
    },
    {
      id: now + 4,
      title: "A Systematic Review of AI in Personalized Learning",
      authors: "Chen et al.",
      year: "2024",
      sourceType: "Journal Article",
      methodology: "Systematic Review",
      relevance: 10,
      quality: 9,
      status: "Reviewed",
      keywords: "artificial intelligence, personalized learning, adaptive system, review",
      findings: "AI personalization is widely studied but explainability and ethics remain underdeveloped.",
      researchGap: "Few studies combine personalization accuracy, explainability, and learner satisfaction.",
      link: "",
      createdAt: new Date().toISOString()
    }
  ];

  savePapers(demo);
  renderApp();
}

function renderApp() {
  const papers = getPapers();
  const plan = JSON.parse(localStorage.getItem(PLAN_KEY));

  if (plan) {
    renderResearchPlan(plan);
  }

  updateFilters(papers);
  renderDashboard(papers);
  renderInsight(papers);
  renderBreakdown("methodBreakdown", getStats(papers, "methodology"), "papers");
  renderBreakdown("statusBreakdown", getStats(papers, "status"), "papers");
  renderKeywords(papers);
  renderGaps(papers);
  renderPapers(papers);
}

renderApp();
