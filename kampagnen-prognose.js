class KampagnenPrognose extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Roboto, sans-serif;
        background: #f4f4f6;
        padding: 20px;
      }
      .calculator {
        max-width: 1200px;
        margin: 40px auto;
        background: #fff;
        border-radius: 24px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        padding: 32px;
        color: #1c1c1e;
      }
      h2 { text-align: center; font-size: 1.8rem; margin-bottom: 6px; }
      .subtitle { text-align: center; color: #666; margin-bottom: 24px; }
      .input-grid { display: flex; gap: 24px; flex-wrap: wrap; }
      .column { flex: 1; min-width: 280px; }
      label { font-size: 0.9rem; color: #444; display: block; margin-bottom: 6px; margin-top: 12px; }
      input { padding: 10px; border: 1px solid #d2d2d7; border-radius: 10px; font-size: 1rem; background: #f9f9f9; width: 100%; box-sizing: border-box; transition: all 0.2s; }
      input:focus { outline: none; border-color: #0071e3; background: white; box-shadow: 0 0 0 2px rgba(0,113,227,0.1); }
      .button-main { margin-top: 30px; width: 100%; background: #0071e3; color: white; font-weight: 600; border: none; border-radius: 14px; padding: 14px; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }
      .button-main:hover { background: #0a84ff; }
      .results { margin-top: 30px; text-align: center; display: none; }
      .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .result-card { background: #f5f5f7; padding: 16px; border-radius: 16px; }
      .result-card.highlight { background: #e8f0fe; box-shadow: 0 0 0 2px #0071e3 inset; }
      .result-card h1 { margin: 6px 0; font-size: 1.8rem; }
      .warning { color: #d70015; font-weight: 600; margin-top: 10px; }
      footer { text-align: center; margin-top: 20px; font-size: 13px; color: #999; }
      footer a { color: #0071e3; text-decoration: none; }
      footer a:hover { text-decoration: underline; }
      .overlay{
        position:fixed;
        top:0; left:0;
        width:100%; height:100%;
        background:rgba(0,0,0,0.5);
        display:none;
        justify-content:center;
        align-items:center;
        z-index:999;
        padding:20px;
        box-sizing:border-box;
        overflow:auto;
      }
      .overlay-content{
        background:#fff;
        padding:24px;
        border-radius:16px;
        width:100%;
        max-width:600px;
        max-height:90vh;
        box-shadow:0 10px 30px rgba(0,0,0,0.2);
        overflow:auto;
        box-sizing:border-box;
      }
      .overlay-content textarea{
        width:100%;
        height:120px;
        font-family:monospace;
        border-radius:8px;
        border:1px solid #ccc;
        padding:8px;
        box-sizing:border-box;
      }
      .close-btn{
        background:#0071e3;
        color:white;
        border:none;
        padding:8px 16px;
        border-radius:8px;
        margin-top:12px;
        cursor:pointer;
      }

   /* --- Schriftgrößenanpassungen --- */
.subtitle {
  font-size: 1rem;
}

.column h3 {
  font-size: 1.3rem;
}

.result-card p {
  font-size: 0.9rem;
}

/* --- Responsive Layout --- */
@media (max-width: 1200px) {
  .calculator {
    padding: 28px;
  }
}

@media (max-width: 900px) {
  .input-grid {
    flex-direction: column;
    gap: 12px;
  }
  .column {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .calculator {
    padding: 20px;
  }
  .column h3 {
    font-size: 1.2rem;
  }
  .subtitle {
    font-size: 0.95rem;
  }
  .result-card p {
    font-size: 0.85rem;
  }
  .input-grid {
    flex-direction: column;
  }
  .result-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

      </style>

      <div class="calculator">
        <h2>Kampagnen-Ergebnisprognose</h2>
        <p class="subtitle">Berechne, wie viel Gewinn oder Verlust deine Kampagne bei gegebenem Marketingbudget erzielt.</p>

        <div class="input-grid">
          <div class="column">
            <h3>Grunddaten</h3>
            <label>Bruttoumsatz pro Bestellung (in €)</label>
            <input id="revenueGross" type="text" placeholder="z. B. 60">
            <label>Netto-Umsatz (automatisch)</label>
            <input id="revenueNet" type="text" readonly style="background:#f0f0f0;">
            <label>Variable Kosten (Produktion + Versand, in €)</label>
            <input id="variableCost" type="text" placeholder="z. B. 30">
            <div id="netProfitInfo" style="font-size:0.85rem;color:#0071e3;margin-top:6px;"></div>
          </div>

          <div class="column">
            <h3>Kampagne</h3>
            <label>Marketingbudget (in €)</label>
            <input id="marketingBudget" type="text" placeholder="z. B. 1.000">
            <label>ROAS</label>
            <input id="roas" type="text" placeholder="z. B. 3">
            <label>Einmalige Fixkosten (optional, in €)</label>
            <input id="fixedCost" type="text" placeholder="z. B. 0">
          </div>
        </div>

        <button class="button-main" id="calcBtn">Berechnen</button>

        <div class="results" id="results">
          <div class="result-grid">
            <div class="result-card highlight">
              <p><strong>Profit pro Werbe-Euro</strong></p>
              <h1 id="profitPerEuro">–</h1>
            </div>
            <div class="result-card">
              <p><strong>Gesamtgewinn / -verlust</strong></p>
              <h1 id="totalProfit">–</h1>
            </div>
          </div>
          <p id="warning" class="warning"></p>
        </div>

        <footer>
          <a href="#" id="embedLink"><strong>🔗 Rechner einbetten / teilen</strong></a> – entwickelt von 
          <a href="https://www.purple-noon.de" target="_blank">Purple Noon</a>
        </footer>
      </div>

      <div class="overlay" id="overlay">
        <div class="overlay-content">
          <h3>Einbettungscode:</h3>
          <textarea readonly><iframe src="https://p-noon.github.io/kampagnen-prognose/" width="100%" height="950" style="border:none;"></iframe></textarea>
          <button class="close-btn" id="closeOverlay">Schließen</button>
        </div>
      </div>
    `;

    const $ = id => this.shadowRoot.getElementById(id);

    const parseNum = v => parseFloat(v.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")) || 0;
    const fmt = (num, dec = 2) => isFinite(num) ? num.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : "–";

    const updateNetto = () => {
      const gross = parseNum($("revenueGross").value);
      const variable = parseNum($("variableCost").value);
      const net = gross / 1.19;
      const profit = net - variable;
      $("revenueNet").value = gross ? fmt(net) + " €" : "";
      $("netProfitInfo").innerText = gross > 0 ? "Netto-Ertrag pro Bestellung: " + fmt(profit) + " €" : "";
    };

    const calcResult = () => {
      const gross = parseNum($("revenueGross").value);
      const variable = parseNum($("variableCost").value);
      const roas = parseNum($("roas").value);
      const fixed = parseNum($("fixedCost").value);
      const budget = parseNum($("marketingBudget").value);

      const net = gross / 1.19;
      const profitPerOrder = net - variable;
      const profitPerEuro = (profitPerOrder / gross) * roas - 1;

      $("results").style.display = "block";
      $("profitPerEuro").innerText = fmt(profitPerEuro);
      const totalProfit = budget * profitPerEuro - fixed;
      $("totalProfit").innerText = fmt(totalProfit) + " €";
      $("warning").innerText = totalProfit < 0 ? "Achtung: Verlust bei dieser Kampagne!" : "";
    };

    ["revenueGross", "variableCost", "marketingBudget", "roas", "fixedCost"].forEach(id => {
      const el = $(id);
      el.addEventListener("blur", () => { el.value = fmt(parseNum(el.value)).replace(",00", ""); });
      el.addEventListener("input", updateNetto);
    });

    $("calcBtn").addEventListener("click", calcResult);
    $("embedLink").addEventListener("click", e => {
      e.preventDefault();
      $("overlay").style.display = "flex";
    });
    $("closeOverlay").addEventListener("click", () => $("overlay").style.display = "none");

    updateNetto();
  }
}

customElements.define("kampagnen-prognose", KampagnenPrognose);
